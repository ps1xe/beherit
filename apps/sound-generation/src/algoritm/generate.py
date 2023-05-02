from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense, BatchNormalization, Activation
from music21 import instrument, note, stream, chord
import pickle
import numpy as np
import boto3
import uuid
import os
import sys
from dotenv import load_dotenv
from midi2audio import FluidSynth

load_dotenv()


def prepare_sequences(notes, pitchnames, n_vocab):

    note_to_int = dict((note, number)
                       for number, note in enumerate(pitchnames))

    sequence_length = 200

    network_input = []

    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]

        network_input.append([note_to_int[char] for char in sequence_in])

    n_patterns = len(network_input)

    normalized_input = np.reshape(
        network_input, (n_patterns, sequence_length, 1))

    normalized_input = normalized_input / float(n_vocab)

    return (network_input, normalized_input)


def create_network(input_data, n_vocab, genre):

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

    if (genre == "classical"):
        model.load_weights("weights/classical/weights.hdf5")
    elif (genre == "8-bit"):
        model.load_weights("weights/8-bit/weights.hdf5")
    else:
        model.load_weights("weights/classical/weights.hdf5")

    return model


def generate_notes(model, network_input, length, pitchnames, n_vocab):

    start = np.random.randint(0, len(network_input)-1)

    int_to_note = dict((number, note)
                       for number, note in enumerate(pitchnames))

    pattern = network_input[start]

    prediction_output = []

    for note_index in range(length):

        prediction_input = np.reshape(pattern, (1, len(pattern), 1))

        prediction_input = prediction_input / float(n_vocab)

        prediction = model.predict(prediction_input, verbose=0)

        index = np.argmax(prediction)

        result = int_to_note[index]

        prediction_output.append(result)

        pattern.append(index)

        pattern = pattern[1:len(pattern)]

    return prediction_output


def create_midi(prediction_output):

    offset = 0
    output_notes = []

    for pattern in prediction_output:
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.Piano()
                notes.append(new_note)
            new_chord = chord.Chord(notes)
            new_chord.offset = offset
            output_notes.append(new_chord)
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.Piano()
            output_notes.append(new_note)

        offset += 0.5

    midi_stream = stream.Stream(output_notes)

    midi_name = str(uuid.uuid4())

    midi_stream.write('midi', fp='generated/tmp/' + midi_name + '.mid')

    return midi_name


def midi_to_wav(midi_name, genre):
    midi_path = 'generated/tmp/' + midi_name + '.mid'
    wav_path = 'generated/tmp/' + midi_name + '.wav'
    if (genre == "classical"):
        s_font = 'soundfonts/classical/piano.sf2'
    elif (genre == "8-bit"):
       s_font = 'soundfonts/8-bit/8bit.sf2'
    else:
        s_font = 'soundfonts/classical/piano.sf2'
    fs = FluidSynth(sound_font=s_font)
    fs.midi_to_audio(midi_path, wav_path)
    os.remove(midi_path)
    with open(wav_path, 'rb') as f:
        return (f.read(), midi_name)


def save_in_s3(wav_buffer, wav_name):

    access_key = str(os.environ.get('S3_ACCESS_KEY_ID'))
    secret_access_key = str(os.environ.get('S3_SECRET_ACCESS_KEY'))
    endpoint_url = str(os.environ.get('S3_ENDPOINT'))
    bucket = str(os.environ.get('S3_BUCKET_NAME_SOUNDS'))

    session = boto3.session.Session()
    s3 = session.client(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_access_key,
        service_name='s3',
        endpoint_url=endpoint_url,
    )

    key = wav_name + '.wav'
    s3.put_object(Bucket=bucket, Key=key, Body=wav_buffer)

    wav_path = 'generated/tmp/' + wav_name + '.wav'

    os.remove(wav_path)

    print(key)


def generate(genre, length=500):
    with open('input-data/notes/'+ genre +'/notes', 'rb') as filepath:
        notes = pickle.load(filepath)

    pitchnames = sorted(set(item for item in notes))
    n_vocab = len(set(notes))

    network_input, normalized_input = prepare_sequences(
        notes, pitchnames, n_vocab)
    model = create_network(normalized_input, n_vocab, genre)
    prediction_output = generate_notes(
        model, network_input, length, pitchnames, n_vocab)
    midi_name = create_midi(prediction_output)
    wav, wav_name = midi_to_wav(midi_name, genre)
    return save_in_s3(wav, wav_name)


if __name__ == '__main__':
    generate(sys.argv[1], int(sys.argv[2]))
