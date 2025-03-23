import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

class Comperator:
  def __init__(self):
    pass
  
  def compare(self, semDescMatrix, goldenMatrix):
    return cosine_similarity(semDescMatrix, goldenMatrix)[0][0]

  def main(self, semDescMatrix, goldenMatrix):
    return self.compare(semDescMatrix, goldenMatrix)