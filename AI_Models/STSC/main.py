import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from gensim.models import KeyedVectors
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Embedding
from tensorflow.keras.utils import to_categorical


def get_symptom_vector(tokens, embeddings, dim=300):
    vectors = [embeddings[word] for word in tokens if word in embeddings]
    if len(vectors) > 0:
        return np.mean(vectors, axis=0)  
    else:
        return np.zeros(dim)

df = pd.read_csv('AI_Models/STSC/dist/archive/dataset.csv')
df = df.fillna(" ")
df['Symptom']=""
for index, row in df.iterrows():
    symptoms = []
    for i in range(1, 18):  
        symptom = str(row[i]) 
        symptom = symptom.replace('_', ' ') 
        symptoms.append(symptom) 
    df.at[index, 'Symptom'] = ''.join(symptoms)  

for i in range(1, 18):
    df = df.drop(f"Symptom_{i}", axis = 1)

pretrained_model_path  = "AI_Models/STSC/dist/glove.6B.300d/glove.6B.300d.txt"  
embeddings = KeyedVectors.load_word2vec_format(pretrained_model_path, binary=False, no_header=True)

df['Symptom_tokens'] = df['Symptom'].apply(lambda x: x.split())
df['Symptom_vector'] = df['Symptom_tokens'].apply(lambda x: get_symptom_vector(x, embeddings))

X = np.array(df['Symptom_vector'].tolist())
le = LabelEncoder()
y = le.fit_transform(df['Disease']) 
y_one_hot = to_categorical(y)

input_layer = Input(shape=(X.shape[1],))
hidden_layer = Dense(128, activation='relu')(input_layer)  
output_layer = Dense(len(le.classes_), activation='softmax')(hidden_layer) 

model = Model(inputs=input_layer, outputs=output_layer)
model.load_weights('AI_Models/STSC/weights.weights.h5')

text = 'Diarrhea fever headache tootchache'
vector = get_symptom_vector(text.split(), embeddings, dim = 300)
vector = np.expand_dims(vector, axis = 0)
pred = model.predict(vector).argmax()

