import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord, percussion
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint

#----------------------------------------------------------------------------------------------------------------------
#извлекает все ноты и аккорды из MIDI-файлов
def get_notes():
    midi_files_path = "input-sounds/genres/test/*.mid"
    notes = []

    for file in glob.glob(midi_files_path):
        #преобразует файл MIDI в объект midi библиотеки music21
        midi = converter.parse(file)

        notes_to_parse = None

        try: 
            #разделяет ноты в MIDI-файле по инструментам
            s2 = instrument.partitionByInstrument(midi)
            notes_to_parse = s2.parts[0:-1].recurse() 

        except: 
            #получает все ноты из файла в одной структуре
            notes_to_parse = midi.flat.notes

        #перебирает либо ноту либо аккорд
        for element in notes_to_parse:
            #если элемент нота, то преобразуем в строку и добавляем в [notes]
            if isinstance(element, note.Note):
                notes.append(str(element.pitch))
            #если элемент аккорд, то преобразуем массив нот в массив цифр, объединяем массив через точку в строку. добавляем в [notes]
            elif isinstance(element, chord.Chord):
                notes.append('.'.join(str(n) for n in element.normalOrder))
            # elif isinstance(element, percussion.PercussionChord):

    with open('data/generated/notes/test/notes', 'wb') as filepath:
        #записываем данные midi в файл notes
        pickle.dump(notes, filepath)

    return notes

#----------------------------------------------------------------------------------------------------------------------
#подготавливает последовательности (sequences) для обучения нейронной сети
def prepare_sequences(notes, n_vocab):
    #определяет количество нот, которые будут использоваться для предсказания следующей ноты в последовательности
    sequence_length = 100

    #извлекаются уникальные имена нот и сортируются в алфавитном порядке 
    pitchnames = sorted(set(item for item in notes))

    #cоздается словарь note_to_int, который связывает каждое имя высоты со своим уникальным целочисленным значением
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    #списки для хранения входных и выходных последовательностей
    network_input = []
    network_output = []


    #создаются входные и выходные последовательности
    for i in range(0, len(notes) - sequence_length):
        #каждая входная последовательность содержит sequence_length нот, начиная с i-й ноты в списке notes
        sequence_in = notes[i:i + sequence_length]

        #выходная последовательность содержит следующую ноту (i + sequence_length)
        sequence_out = notes[i + sequence_length]

        #входная последовательность преобразуется в список целых чисел, используя словарь note_to_int и добавляется в список network_input
        network_input.append([note_to_int[char] for char in sequence_in])

        #cответствующее значение следующей ноты, для sequence_length предидущих добавляется в список network_output    
        network_output.append(note_to_int[sequence_out])

    #количество последовательностей
    n_patterns = len(network_input)

    #network_input преобразуется в формат, совместимый с LSTM слоями, с помощью функции numpy.reshape()
    network_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))
   
    #входные данные нормализуются, разделив каждое значение на количество уникальных нот (n_vocab)
    network_input = network_input / float(n_vocab)

    #выходные данные преобразуются в категориальный формат с помощью функции np_utils.to_categorical()
    network_output = np_utils.to_categorical(network_output)

    return (network_input, network_output)

#----------------------------------------------------------------------------------------------------------------------
#lstm для предсказания по последовательности нот 1 следующую
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

    return model

#----------------------------------------------------------------------------------------------------------------------
#обучение нейронной сети
def train(model, network_input, network_output):
    
    filepath = "data/weights/test/weights-{epoch:02d}-{loss:.4f}-bigger.hdf5"

    #для сохранения модели наилучшего качества в процессе обучения по пути filepath, по метрике loss(минимальное число потерь)
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )
    callbacks_list = [checkpoint]

    #обучение, 200 итераций, callbacks - для логов во время обучения
    model.fit(network_input, network_output, epochs=200, callbacks=callbacks_list)

#----------------------------------------------------------------------------------------------------------------------
#собираем все методы
def train_network():
    notes = get_notes()

    n_vocab = len(set(notes))

    network_input, network_output = prepare_sequences(notes, n_vocab)

    model = create_network(network_input, n_vocab)

    train(model, network_input, network_output)


if __name__ == '__main__':
    train_network()


