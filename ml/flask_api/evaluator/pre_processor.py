import nltk
import os

nltk_data_path = os.path.join(os.path.dirname(__file__), "nltk_data")
nltk.data.path.append(nltk_data_path)

# for tokenization
nltk.download('punkt')
nltk.download('punkt_tab')

from nltk.tokenize import word_tokenize

# for lemmatization
nltk.download('wordnet')
nltk.download('omw-1.4')
from nltk.stem import WordNetLemmatizer

# for stopwords
from nltk.corpus import stopwords
nltk.download('stopwords')

# for additional pre-processing
import string

class PreProcessor:
  def __init__(self, text):
    self.text = text
    self.word_tokenize = word_tokenize
    self.lemmatizer = WordNetLemmatizer()
    self.stop_words = set(stopwords.words('english'))

  def tokenize(self):
    return self.word_tokenize(self.text)

  def lemmatize(self, tokkens):
    return [self.lemmatizer.lemmatize(tok, pos='v') for tok in tokkens]

  def removeStopWords(self, lematized):
    return [word for word in lematized if word not in self.stop_words]
  
  def preproc(self, filter_words):
    return [word for word in filter_words if word not in string.punctuation]

  def main(self):
    tokkens = self.tokenize()
    lematized = self.lemmatize(tokkens)
    filter_words = self.removeStopWords(lematized)
    preproc_words = self.preproc(filter_words)
    
    return preproc_words