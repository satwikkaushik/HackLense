import json
from scipy.sparse import save_npz, load_npz
import pickle

import os
base_dir = os.path.dirname(os.path.abspath(__file__))

class DataBase:
  def __init__(self):
    pass

  def getParemList(self):
    f = open(os.path.join(base_dir, "database", "keywords.json"), 'r')
    data = json.load(f)
    return data.keys()

  def getKeywords(self, parameter):
    f = open(os.path.join(base_dir, "database", "keywords.json"), 'r')
    data = json.load(f)
    f.close()
    return data.get(parameter)

  def getPriorityList(self):
    f = open(os.path.join(base_dir, "database", "priority.json"), 'r')
    data = json.load(f)
    f.close()
    return data

  def storeModel(self, name, model, matrix):
    # golden matrix
    save_npz(os.path.join(base_dir, "database", f"{name}.npz"), matrix)
    # model
    f = open(os.path.join(base_dir, "database", f"{name}.pkl"), 'wb')
    pickle.dump(model, f)

  def loadModel(self, name):
    # golden matrix
    golden_mat = load_npz(os.path.join(base_dir, "database", f"{name}.npz"))
    # model
    f = open(os.path.join(base_dir, "database", f"{name}.pkl"), 'rb')
    model = pickle.load(f)
    return model, golden_mat

  def storeSemDescMatrix(self, name, matrix):
    save_npz(os.path.join(base_dir, "temp", f"{name}.npz"), matrix)

  def loadSemDescMatrix(self, name):
    return load_npz(os.path.join(base_dir, "temp", f"{name}.npz"))
