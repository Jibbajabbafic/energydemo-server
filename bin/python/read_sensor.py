#!/usr/bin/python
""" Script to be run by the server to get data from the INA219 sensor """
from datetime import datetime
from random import uniform
from random import randint
import json

STATS = {
    'time': 0.0,
    'voltage': 0.0,
    'current': 0.0,
    'power': 0.0,
    'rpm0': 0,
    'rpm1': 0,
    'rpm2': 0,
}

def gen_rand_data(obj):
    """ Generate random data to put into the define object """
    obj['time'] = str(datetime.utcnow())
    obj['voltage'] = float("%.3f" % uniform(20, 30))
    obj['current'] = float("%.3f" % uniform(5, 20))
    obj['power'] = float("%.3f" % (obj['voltage'] * obj['current']))
    obj['rpm0'] = randint(100, 2000)
    obj['rpm1'] = randint(100, 2000)
    obj['rpm2'] = randint(100, 1000)

try:
    gen_rand_data(STATS)
except Exception as e:
    print('Error: ' + str(e))
else:
    print(json.dumps(STATS))
