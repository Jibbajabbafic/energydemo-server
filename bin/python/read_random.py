#!/usr/bin/python

""" Script to be run by the server to get data from the INA219 sensor """
import json
import sys
from datetime import datetime
from random import uniform

# Input address arg
ADDRESS = int(sys.argv[1])

STATS = {}

def read_random():
    """ Generate random data and return it """
    stats = {}

    stats['time'] = str(datetime.utcnow())
    stats['voltage'] = float("%.1f" % uniform(20, 30))
    stats['current'] = float("%.1f" % uniform(5, 20))
    stats['power'] = float("%.1f" % (stats['voltage'] * stats['current']))

    return stats

STATS = read_random() # Generate random data

print(json.dumps(STATS))