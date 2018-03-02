#!/usr/bin/python

""" Script to be run by the server to get data from the INA219 sensor """
import json
import sys
from datetime import datetime
from random import uniform
from random import randint
from ina219 import INA219
from ina219 import DeviceRangeError

# Resistance of the shunt resistor (default = 0.1)
SHUNT_OHMS = 0.1

# Maximum expected currents (default = None)
MAX_EXPECTED_AMPS = None

# Input address arg
ADDRESS = sys.argv[1]

STATS = {}

def read_sensor(address):
    """ Read the INA219 sensor at ceratin address and return readings"""
    ina = INA219(SHUNT_OHMS, MAX_EXPECTED_AMPS, address)
    ina.configure()

    stats = {}

    try:
        stats['time'] = str(datetime.utcnow())
        stats['voltage'] = ina.voltage()
        stats['current'] = ina.current()
        stats['power'] = ina.power()

    except DeviceRangeError as error_msg:
        # Current out of device range with specified shunt resistor
        print(error_msg)
    
    return stats

def read_random():
    """ Generate random data and return it """
    stats = {}

    stats['time'] = str(datetime.utcnow())
    stats['voltage'] = float("%.1f" % uniform(20, 30))
    stats['current'] = float("%.1f" % uniform(5, 20))
    stats['power'] = float("%.1f" % (stats['voltage'] * stats['current']))

    return stats

# STATS = read_sensor(ADDRESS)
STATS = read_random()

print(json.dumps(STATS))