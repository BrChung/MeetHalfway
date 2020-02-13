import json

def init():
  global data
  
  with open('config.json') as config_file:
    data = json.load(config_file)