from .database import DataBase
from .pre_processor import PreProcessor
from .golden_Vectorizer import GoldenVectorizer
from .vectorizer import Vectorizer
from .comperator import Comperator

class GoldenMatrix:
  def __init__(self):
    self.db = DataBase()

  def generate_golden_matrices(self, parameter: str) -> None:
    GoldenVectorizer(parameter).main()

  def init(self):
    for parameter in self.db.getParemList():
      self.generate_golden_matrices(parameter)

class Evaluator:
  def __init__(self, sem_desc_text: str):
    self.sem_desc_text = sem_desc_text
    self.db = DataBase()

  def evaluate(self):
    scores = {}
    for param in self.db.getParemList():
      pre_proc = PreProcessor(self.sem_desc_text).main() # preprocessed
      sem_desc_mat, golden_mat = Vectorizer(pre_proc, param).main() # vectorised

      scores[param] = Comperator().main(sem_desc_mat, golden_mat) # score
    return scores
  
  def calcWeight(self):
    priority = self.db.getPriorityList()
    total_priority = sum(priority.values())
    
    for param in priority:
      priority[param] = (total_priority - priority[param]) / total_priority
    
    return priority

  def combineScore(self, scores: dict):
    weight = self.calcWeight()
    total_weight = sum(weight.values())
    final_score = 0
    for param in scores:
      final_score += scores[param] * weight[param]
    
    return final_score / total_weight

  def run(self) -> (dict, float):
    scores = self.evaluate()
    final_score = self.combineScore(scores)

    return scores, final_score