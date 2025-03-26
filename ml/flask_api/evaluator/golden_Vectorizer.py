from sklearn.feature_extraction.text import TfidfVectorizer
from .database import DataBase

class GoldenVectorizer:
  def __init__(self, parameter_name):
    self.vectorizer = TfidfVectorizer()
    self.parameter = parameter_name
    self.db = DataBase()
  
  def preproc_words(self, words):
    if isinstance(words, list): return words
    elif isinstance(words, str): return [words.replace(',', '')]

  def TF_IDF(self, corpus):
    return self.vectorizer.fit_transform(corpus)

  def main(self):
    keywords = self.db.getKeywords(self.parameter)
    corpus = self.preproc_words(keywords)
    golden_matrix = self.TF_IDF(corpus)
    self.db.storeModel(self.parameter, self.vectorizer, golden_matrix)