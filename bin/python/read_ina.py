#!/usr/bin/python

""" Script to be run by the server to get data from the INA219 sensor """
import json
import sys
from datetime import datetime
from ina219 import INA219
from ina219 import DeviceRangeError

# Resistance of the shunt resistor (default = 0.1)
SHUNT_OHMS = 0.1

# Maximum expected currents (default = None)
MAX_EXPECTED_AMPS = None

# Input address arg
ADDRESS = int(sys.argv[1])

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

STATS = read_sensor(ADDRESS) # Read INA219 sensors

print(json.dumps(STATS))