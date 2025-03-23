from database import DataBase
from pre_processor import PreProcessor
from golden_Vectorizer import GoldenVectorizer
from vectorizer import Vectorizer
from comperator import Comperator

class GoldenMatrix:
  def __init__(self):
    self.db = DataBase()

  def generate_golden_matrices(self, parameter: str) -> None:
    GoldenVectorizer(parameter).main()

  def init(self):
    for parameter in self.db.getParemList():
      self.generate_golden_matrices(parameter)

class Evaluator:
  def __init__(self, sem_desc_dict: dict):
    self.sem_desc_dict = sem_desc_dict
    self.db = DataBase()

  def evaluate(self, sem_desc):
    scores = {}
    for param in self.db.getParemList():
      pre_proc = PreProcessor(sem_desc).main() # preprocessed
      sem_desc_mat, golden_mat = Vectorizer(pre_proc, param).main() # vectorised
      scores[param] = Comperator().main(sem_desc_mat, golden_mat) # score

      print(f"Score of {param} :", scores[param]) # temp
    
    return scores
    
  def combineScore(self, scores: dict):
    s = 0
    for submi_type in scores:
      for param in scores[submi_type]:
        s += scores[submi_type][param]
    
    return s

  def run(self):
    scores = {}

    for submi_type in self.sem_desc_dict:
      scores[submi_type] = self.evaluate(self.sem_desc_dict[submi_type])
    
    final_score = self.combineScore(scores)

    return final_score
