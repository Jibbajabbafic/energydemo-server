#!/usr/bin/python

""" Script to be run by the server to get data from the INA219 sensor """
import json
from datetime import datetime
from random import uniform
from random import randint
from ina219 import INA219
from ina219 import DeviceRangeError

# Resistance of the shunt resistor (default = 0.1)
SHUNT_OHMS = 0.1

# Maximum expected currents (default = None)
MAX_EXPECTED_AMPS = None

# Check if sensors already initialised
SENSORS_INIT = False

# List of addresses
ADDRESS_LIST = [0x40, 0x41, 0x44]

# List of sensors
INA_SENSORS = []


# STATS = {
#     'time': 0.0,
#     'voltage': 0.0,
#     'current': 0.0,
#     'power': 0.0,
#     # 'rpm0': 0,
#     # 'rpm1': 0,
#     # 'rpm2': 0,
# }

# Dictionary to hold all stats
STATS = {}

# def gen_rand_data(obj):
#     """ Generate random data to put into the define object """
#     obj['time'] = str(datetime.utcnow())
#     obj['voltage'] = float("%.3f" % uniform(20, 30))
#     obj['current'] = float("%.3f" % uniform(5, 20))
#     obj['power'] = float("%.3f" % (obj['voltage'] * obj['current']))
#     # obj['rpm0'] = randint(100, 2000)
#     # obj['rpm1'] = randint(100, 2000)
#     # obj['rpm2'] = randint(100, 1000)

# def read_sensor(obj):
#     """ Read the INA219 sensor and put the readings into 'obj' """
#     ina = INA219(SHUNT_OHMS)
#     ina.configure()

#     try:
#         obj['time'] = str(datetime.utcnow())
#         obj['voltage'] = ina.voltage()
#         obj['current'] = ina.current()
#         obj['power'] = ina.power()

#     except DeviceRangeError as error_msg:
#         # Current out of device range with specified shunt resistor
#         print(error_msg)

def gen_rand_ina():

    stats = {}
    # stats = {    
    #     'time': 0.0,
    #     'voltage': 0.0,
    #     'current': 0.0,
    #     'power': 0.0
    # }

    """ Generate random data to return """
    stats['time'] = str(datetime.utcnow())
    stats['voltage'] = float("%.1f" % uniform(20, 30))
    stats['current'] = float("%.1f" % uniform(5, 20))
    stats['power'] = float("%.1f" % (stats['voltage'] * stats['current']))

    return stats

def read_ina(address):

    ina = INA219(SHUNT_OHMS, MAX_EXPECTED_AMPS, address)

    stats = {}
    # stats = {    
    #     'time': 0.0,
    #     'voltage': 0.0,
    #     'current': 0.0,
    #     'power': 0.0
    # }

    try:
        stats['time'] = str(datetime.utcnow())
        stats['voltage'] = ina.voltage()
        stats['current'] = ina.current()
        stats['power'] = ina.power()
        return stats
    except DeviceRangeError as error_msg:
        # Current is out of device range with specified shunt resistor
        print(error_msg)

for num, ADDRESS in enumerate(ADDRESS_LIST):
    try:
        # Read each sensor in turn
        # STATS[num] = read_ina(ADDRESS)

        # Generate random data for testing
        STATS[num] = gen_rand_ina()
        # print(json.dumps(STATS[num]))
    except Exception as error_msg:
        print('Error: ' + str(error_msg))

print(json.dumps(STATS))

# if SENSORS_INIT:
    # for ADDRESS in ADDRESS_LIST:
    #     try:
    #         # STATS[ADDRESS] = read_ina(INA_SENSORS[ADDRESS])
    #         STATS[ADDRESS] = gen_rand_ina()
    #     except Exception as error_msg:
    #         print('Error: ' + str(error_msg))
    #     else:
    #         print(json.dumps(STATS))
# else:
#     # Loop through available addresses and initialise a sensor object
#     # for ADDRESS in ADDRESS_LIST:
#     #     INA_SENSORS[ADDRESS] = INA219(SHUNT_OHMS, MAX_EXPECTED_AMPS, ADDRESS)
#     # for ADDRESS in ADDRESS_LIST:
#     #     try:
#     #         # STATS[ADDRESS] = read_ina(INA_SENSORS[ADDRESS])
#     #         STATS[ADDRESS] = gen_rand_ina()
#     #     except Exception as error_msg:
#     #         print('Error: ' + str(error_msg))
#     #     else:
#     #         print(json.dumps(STATS))
#     print(json.dumps("Initial state!"))
#     SENSOR_INIT = True

# try:
#     gen_rand_data(STATS)
#     # read_sensor(STATS)
# except Exception as error_msg:
#     print('Error: ' + str(error_msg))
# else:
#     print(json.dumps(STATS))