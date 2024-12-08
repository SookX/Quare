from gensim.models import KeyedVectors
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Embedding
from tensorflow.keras.utils import to_categorical
import numpy as np
import os

def load_classes():
    diseases_loaded = []
    path = os.path.dirname(os.getcwd())
    with open(f'{path}/AI_Models/STSC/diseases.txt', 'r') as f:
        diseases_loaded.append(f.read().splitlines())

    return np.array(diseases_loaded)

def load_weights_and_embeddings(classes):

    path = os.path.dirname(os.getcwd())
    pretrained_model_path  = f"{path}/AI_Models/STSC/dist/glove.6B.300d/glove.6B.300d.txt"  
    embeddings = KeyedVectors.load_word2vec_format(pretrained_model_path, binary=False, no_header=True)

    input_layer = Input(shape=(300,))
    hidden_layer = Dense(128, activation='relu')(input_layer)  
    output_layer = Dense(len(classes), activation='softmax')(hidden_layer) 
    
    model = Model(inputs=input_layer, outputs=output_layer)
    model.load_weights(f'{path}/AI_Models/STSC/weights.weights.h5')

    return model, embeddings

def get_symptom_vector(tokens, embeddings, dim=300):
    vectors = [embeddings[word] for word in tokens if word in embeddings]
    if len(vectors) > 0:
        return np.mean(vectors, axis=0)  
    else:
        return np.zeros(dim)
    
def predict(text, model, classes, embeddings):
    vector = get_symptom_vector(text.split(), embeddings, dim = 300)
    vector = np.expand_dims(vector, axis = 0)
    pred = model.predict(vector).argmax()
    return classes[pred]