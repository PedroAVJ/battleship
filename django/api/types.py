from enum import Enum


class ShipName(Enum):
    SUBMARINE = 'submarine'
    SUPPLY_BOAT = 'supplyBoat'
    DESTROYER = 'destroyer'
    BATTLESHIP = 'battleship'
    FRIGATE = 'frigate'
    AIRCRAFT_CARRIER = 'aircraftCarrier'


class Orientation(Enum):
    HORIZONTAL = 'horizontal'
    VERTICAL = 'vertical'


SHIP_DIMENSIONS = {
    ShipName.SUBMARINE: {
        'length': 1,
        'width': 1,
    },
    ShipName.SUPPLY_BOAT: {
        'length': 2,
        'width': 1,
    },
    ShipName.DESTROYER: {
        'length': 3,
        'width': 1,
    },
    ShipName.BATTLESHIP: {
        'length': 4,
        'width': 1,
    },
    ShipName.FRIGATE: {
        'length': 5,
        'width': 1,
    },
    ShipName.AIRCRAFT_CARRIER: {
        'length': 5,
        'width': 2,
    },
}
