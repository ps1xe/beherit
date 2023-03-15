import glob
import pickle
import numpy
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

#----------------------------------------------------------------------------------------------------------------------
def get_notes():
    midi_files_path = "input-sounds/genres/test/*.mid"
    notes = []

    for file in glob.glob(midi_files_path):
        midi = converter.parse(file)

        notes_to_parse = None

        try: 
            s2 = instrument.partitionByInstrument(midi)
            notes_to_parse = s2.parts[0:-1].recurse() 

        except: 
            notes_to_parse = midi.flat.notes

     
        for element in notes_to_parse:
      
            if isinstance(element, note.Note):
                transform_note = str(element.pitch)
                notes.append(transform_note)

            elif isinstance(element, chord.Chord):
                transform_chord = '.'.join(str(n) for n in element.normalOrder)
                transform_chord = transform_chord
                notes.append(transform_chord)
    

    with open('generated/notes/test/notes', 'wb') as filepath:

        pickle.dump(notes, filepath)

    return notes

#----------------------------------------------------------------------------------------------------------------------
def prepare_sequences(notes,  n_vocab):
    sequence_length = 100

    pitchnames = sorted(set(item for item in notes))

    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    network_input = []
    network_output = []


    for i in range(0, len(notes) - sequence_length):
        sequence_in = notes[i:i + sequence_length]

        sequence_out = notes[i + sequence_length]

        network_input.append([note_to_int[char] for char in sequence_in])
  
        network_output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)
  
    network_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))

    network_input = network_input / float(n_vocab)

    network_output = np_utils.to_categorical(network_output)
 
    return (network_input, network_output)

#----------------------------------------------------------------------------------------------------------------------
def create_network(network_input, n_vocab):
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

def train_network():
    notes = get_notes()

    n_vocab = len(set(notes))

    network_input, network_output = prepare_sequences(notes, n_vocab)

    model = create_network(network_input, n_vocab)

    train(model, network_input, network_output)


if __name__ == '__main__':
    train_network()
