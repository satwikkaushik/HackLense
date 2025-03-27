from .database import DataBase

class Vectorizer:
  def __init__(self, words, parameter):
    self.parameter = parameter
    self.words = words
    self.db = DataBase()

  def join_preproc_words(self, words):
    return [' '.join(words)]

  def TF_IDF(self, corpus, parameter):
    vectorizer, golden_mat = self.db.loadModel(parameter)
    return vectorizer.transform(corpus), golden_mat
  
  def main(self):
    corpus = self.join_preproc_words(self.words)
    semdesc_mat, golden_mat = self.TF_IDF(corpus, self.parameter)
    return semdesc_mat, golden_mat