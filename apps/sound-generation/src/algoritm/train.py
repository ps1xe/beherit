from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense, BatchNormalization, Activation
import numpy as np
import sys
from keras.callbacks import ModelCheckpoint
import glob
from music21 import instrument, note, chord, converter
import pickle
from keras.utils import np_utils


def midi_to_sequence_note(genre):
    midi_files_path = "src/algoritm/input-data/midi/" + genre + "/*.mid"
    notes = []

    for file in glob.glob(midi_files_path):
        try:
            midi = converter.parse(file)
        except:
            continue

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
                notes.append(transform_chord)

    with open('src/algoritm/input-data/notes/' + genre + '/notes', 'wb') as filepath:
        pickle.dump(notes, filepath)

    return notes


def prepare_sequences(notes, n_vocab):
    sequence_length = 100

    pitchnames = sorted(set(item for item in notes))

    note_to_int = dict((note, number)
                       for number, note in enumerate(pitchnames))

    network_input = []
    network_output = []

    for i in range(0, len(notes) - sequence_length):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]

        network_input.append([note_to_int[char] for char in sequence_in])
        network_output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)
    network_input = np.reshape(network_input, (n_patterns, sequence_length, 1))

    network_input = network_input / float(n_vocab)

    network_output = np_utils.to_categorical(network_output)

    return (network_input, network_output)


def create_network(input_data, n_vocab):

    model = Sequential()
    model.add(LSTM(
        512,
        input_shape=(input_data.shape[1], input_data.shape[2]),
        recurrent_dropout=0.3,
        return_sequences=True
    ))
    model.add(LSTM(512, return_sequences=True, recurrent_dropout=0.3))
    model.add(LSTM(512))
    model.add(BatchNormalization())
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop')

    return model


def train_model(input_data, output_data, genre):
    n_vocab = output_data.shape[1]
    model = create_network(input_data, n_vocab)

    filepath = "src/algoritm/weights/tmp/" + genre + \
        "/weights-{epoch:02d}-{loss:.4f}-bigger.hdf5"

    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )

    callbacks_list = [checkpoint]

    model.fit(input_data, output_data, epochs=200,
              batch_size=128, callbacks=callbacks_list)
    model.save('src/algoritm/weights/' + genre + '/weights.hdf5')


if __name__ == '__main__':
    genre = str(sys.argv[1])
    notes = midi_to_sequence_note(genre)
    n_vocab = len(set(notes))
    input_data, output_data = prepare_sequences(notes, n_vocab)
    print('Preprocessing completed')
    train_model(input_data, output_data, genre)
    print('Train completed')
