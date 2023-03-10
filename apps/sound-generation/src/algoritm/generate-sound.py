import pickle
import numpy
from music21 import instrument, note, stream, chord
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import BatchNormalization as BatchNorm
from keras.layers import Activation

#----------------------------------------------------------------------------------------------------------------------
#готовит данные для генератора
def prepare_sequences(notes, pitchnames, n_vocab):

    #создает словарь, который сопоставляет каждой ноте или аккорду число
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    #длина последовательности(количество нот)
    sequence_length = 100

    #входные данные 
    network_input = []

    for i in range(0, len(notes) - sequence_length, 1):
        #каждая входная последовательность содержит sequence_length нот, начиная с i-й ноты в списке notes
        sequence_in = notes[i:i + sequence_length]

        #входная последовательность преобразуется в список целых чисел, используя словарь note_to_int и добавляется в список network_input
        network_input.append([note_to_int[char] for char in sequence_in])

    #количество последовательностей
    n_patterns = len(network_input)

    #network_input преобразуется в формат, совместимый с LSTM слоями, с помощью функции numpy.reshape()
    normalized_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))

    #входные данные нормализуются, разделив каждое значение на количество уникальных нот (n_vocab)
    normalized_input = normalized_input / float(n_vocab)

    return (network_input, normalized_input)

#----------------------------------------------------------------------------------------------------------------------
#создает lstm для генерации
def create_network(network_input, n_vocab):
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

    model.load_weights('weights.hdf5')

    return model

#----------------------------------------------------------------------------------------------------------------------
#генерирует новую музыку используя обученную модель
def generate_notes(model, network_input, pitchnames, n_vocab):

    #случайное число для выбора последовательности
    start = numpy.random.randint(0, len(network_input)-1)

    #словарь нота - уникальное целое число
    int_to_note = dict((number, note) for number, note in enumerate(pitchnames))

    #входные данные для предсказания
    pattern = network_input[start]

    #выходные данные для предсказания
    prediction_output = []

    # Генерирует 500 нот
    for note_index in range(500):

        #prediction_input преобразуется в формат, совместимый с LSTM слоями, с помощью функции numpy.reshape()
        prediction_input = numpy.reshape(pattern, (1, len(pattern), 1))

        #prediction_input нормализуются, разделив каждое значение на количество уникальных нот (n_vocab)
        prediction_input = prediction_input / float(n_vocab)

        #предсказание следующей ноты для последовательности
        prediction = model.predict(prediction_input, verbose=0)
        
        #индификатор ноты в инт
        index = numpy.argmax(prediction)

        #сама нота или аккорд
        result = int_to_note[index]
    
        #ресультат
        prediction_output.append(result)

        #добавление ноты в патерн для предсказания
        pattern.append(index)

        #новая последовательность из старой, полученная добавлением новой ноты в конец и смещением на одну позицию
        pattern = pattern[1:len(pattern)]

    return prediction_output

#----------------------------------------------------------------------------------------------------------------------
#из списка нот(или аккордов) преобразует в midi
def create_midi(prediction_output):
    #растояние воспроизведения ноты от начала
    offset = 0

    output_notes = []

    #проходим по prediction_output перебирая ноты или аккорды
    for pattern in prediction_output:
        #если pattern содержит точку или состоит из чисел, то это аккорд
        if ('.' in pattern) or pattern.isdigit():
            #разделяем ноты аккорда по точке
            notes_in_chord = pattern.split('.')
            notes = []
            #проходим по нотам аккорда преобразовывая в объект Chord
            for current_note in notes_in_chord:
                #получение из числа ноты
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.Piano()
                #список нот(Note) аккорда
                notes.append(new_note)

            #создаем аккорд из списка notes
            new_chord = chord.Chord(notes)
            new_chord.offset = offset

            #добавляем в последовательность нот
            output_notes.append(new_chord)
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.Piano()
            output_notes.append(new_note)

        offset += 0.5

    midi_stream = stream.Stream(output_notes)

    #запись в midi
    midi_stream.write('midi', fp='data/generated/midi/test/test_output.mid')

#----------------------------------------------------------------------------------------------------------------------
#собираем все методы
def generate():
    with open('data/generated/notes/test/notes', 'rb') as filepath:
        notes = pickle.load(filepath)

    pitchnames = sorted(set(item for item in notes))
    n_vocab = len(set(notes))

    network_input, normalized_input = prepare_sequences(notes, pitchnames, n_vocab)
    model = create_network(normalized_input, n_vocab)
    prediction_output = generate_notes(model, network_input, pitchnames, n_vocab)
    create_midi(prediction_output)



if __name__ == '__main__':
    generate()
