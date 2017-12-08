#!/usr/bin/python

""" Script to be run by the server to get data from the INA219 sensor """
import json
from datetime import datetime
from random import uniform
from random import randint
from ina219 import INA219
from ina219 import DeviceRangeError

SHUNT_OHMS = 0.1

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

def read_sensor(obj):
    """ Read the INA219 sensor and put the readings into 'obj' """
    ina = INA219(SHUNT_OHMS)
    ina.configure()

    try:
        obj['time'] = str(datetime.utcnow())
        obj['voltage'] = ina.voltage()
        obj['current'] = ina.current()
        obj['power'] = ina.power()

    except DeviceRangeError as error_msg:
        # Current out of device range with specified shunt resister
        print(error_msg)

try:
    # gen_rand_data(STATS)
    read_sensor(STATS)
except Exception as error_msg:
    print('Error: ' + str(error_msg))
else:
    print(json.dumps(STATS))
