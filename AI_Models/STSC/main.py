import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import CategoricalNB
from sklearn.preprocessing import LabelEncoder
from gensim.models import KeyedVectors
import tensorflow as tf

import os


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

# X = np.array(df['Symptom'].tolist())
# le = LabelEncoder()
# y = le.fit_transform(df['Disease']) 
# 
# class_names = le.classes_
# y_one_hot = to_categorical(y)
# 
# print(X.shape[1])