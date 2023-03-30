import glob
import pickle
import numpy as np
from music21 import converter, instrument, note, chord, percussion
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint
from music21 import instrument, note, stream, chord, duration

#----------------------------------------------------------------------------------------------------------------------
def get_notes():
    midi_files_path = "input-sounds/genres/test/*.mid"
    notes = []
    duration = []
    offsets = []

    for file in glob.glob(midi_files_path):
        midi = converter.parse(file)

        last_offset = None
        notes_to_parse = None

        try: 
            s2 = instrument.partitionByInstrument(midi)
            notes_to_parse = s2.parts[0:-1].recurse() 

        except: 
            notes_to_parse = midi.flat.notes

     
        for element in notes_to_parse:
      
            if isinstance(element, note.Note):
                transform_duration = element.duration.quarterLength           
                transform_note = str(element.pitch)
                notes.append(transform_note)
                duration.append(transform_duration)
                if last_offset is not None:
                    distance = element.offset - last_offset
                    offsets.append(distance)      
                else:                
                    offsets.append(0.5)
                last_offset = element.offset
            elif isinstance(element, chord.Chord):
                transform_duration = element.duration.quarterLength
                transform_chord = '.'.join(str(n) for n in element.normalOrder)
                transform_chord = transform_chord
                notes.append(transform_chord)
                duration.append(transform_duration)
                if last_offset is not None:
                    distance = element.offset - last_offset
                    offsets.append(distance)
                # print(element.offset)
                else:                
                    offsets.append(0.5)
                last_offset = element.offset
    

    with open('generated/notes/test/notes', 'wb') as filepath:
        pickle.dump(notes, filepath)

    with open('generated/notes/test/duration', 'wb') as filepath:
        pickle.dump(duration, filepath)

    with open('generated/notes/test/offsets', 'wb') as filepath:
        pickle.dump(offsets, filepath)   
    
    return (notes, duration, np.array(offsets[1:]).astype('float32'))

#----------------------------------------------------------------------------------------------------------------------
def prepare_offsets_for_pair_notes(notes):
    pair_notes_for_offsets = []
    pitchnames = sorted(set(item for item in notes))
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    notes = [note_to_int[char] for char in notes]


    for i in range(0, len(notes)-1):
        pair_notes_for_offsets.append([notes[i], notes[i+1]])

    return np.array(pair_notes_for_offsets)

#----------------------------------------------------------------------------------------------------------------------
def prepare_sequences(notes, offsets,  n_vocab):
    sequence_length = 100

    pitchnames = sorted(set(item for item in notes))

    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    network_input = []
    network_output = []
    notes_for_offsets = []
    offsets_to_sequence = []

    for i in range(0, len(notes) - sequence_length):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]

        network_input.append([note_to_int[char] for char in sequence_in])

        
        # for i in range(0, len(network_input[-1]), 2):
        #     notes_for_offsets.append([network_input[-1][i], network_input[-1][i+1]])
        # offsets_to_sequence.append(offsets[i:len(notes_for_offsets)]) 
        # print(len(notes_for_offsets))
        # print(len(offsets_to_sequence))

        network_output.append(note_to_int[sequence_out])


    n_patterns = len(network_input)
  
    network_input = np.reshape(network_input, (n_patterns, sequence_length, 1))

    network_input = network_input / float(n_vocab)

    network_output = np_utils.to_categorical(network_output)

    return (network_input, network_output, notes_for_offsets)

#----------------------------------------------------------------------------------------------------------------------
def create_network_for_offsets():
    model = Sequential()
    model.add(Dense(64, input_shape=(2,), activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(1))

    model.compile(optimizer='sgd', loss='mse')
    return model

#----------------------------------------------------------------------------------------------------------------------
def create_network_for_notes(network_input, n_vocab):
    # physical_devices = tf.config.list_physical_devices('GPU')
    # print(tf.test.is_gpu_available())
    # tf.config.experimental.set_memory_growth(physical_devices[0], True)

    model = Sequential()

    model.add(LSTM(
        512,
        input_shape=(network_input.shape[1], network_input.shape[2]),
        recurrent_dropout=0.3,
        return_sequences=True
    ))
    model.add(LSTM(512, return_sequences=True, recurrent_dropout=0.3,))
    model.add(LSTM(512))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop')

    # model.load_weights('generated/weights/test/weights.hdf5')

    return model

#----------------------------------------------------------------------------------------------------------------------
#обучение нейронной сети
def train(model, network_input, network_output):
    
    filepath = "generated/weights/test/weights-{epoch:02d}-{loss:.4f}-bigger.hdf5"

   
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )
    callbacks_list = [checkpoint]

    
    model.fit(network_input, network_output, epochs=200,  batch_size=64, callbacks=callbacks_list)


#----------------------------------------------------------------------------------------------------------------------
def train_for_offsets(model, pair_notes, offsets):
    filepath = "generated/weights/offsets/weights-{epoch:02d}-{loss:.4f}-bigger.hdf5"

    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )
    callbacks_list = [checkpoint]

    model.fit(pair_notes, offsets, epochs=500, batch_size=64, callbacks=callbacks_list, verbose=0)
    
    predict = model.predict(np.array([[7, 16], [16, 7], [7, 16], [16, 7], [7, 16], [16, 7], [7, 16], [16, 7], [7, 16], [16, 7], [7, 13], [13, 26], [26, 13], [13, 7], [7, 13]]))
    return predict

#----------------------------------------------------------------------------------------------------------------------

def train_network():
    notes, duration, offsets = get_notes()

    n_vocab = len(set(notes))

    network_input, network_output, notes_for_offsets = prepare_sequences(notes, offsets, n_vocab)

    model_for_notes = create_network_for_notes(network_input, n_vocab)
    model_for_offsets = create_network_for_offsets()
    train(model_for_notes, network_input, network_output)


if __name__ == '__main__':
    # train_network()
    notes, duration, offsets = get_notes()
    pair_notes = prepare_offsets_for_pair_notes(notes)
    model = create_network_for_offsets()
    predict = train_for_offsets(model, pair_notes, offsets)
    print(predict)
