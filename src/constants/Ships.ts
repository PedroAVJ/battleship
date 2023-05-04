import ShipName from "@/types/ShipName";


/**
 * @property `length` - The length of the ship in board cells.
 * @property `width` - The width of the ship in board cells.
 * @property `count` - The number of ships of this type that both players will have to place.
 */
const SHIPS = {

    [ShipName.SUBMARINE]: {
        name: ShipName.SUBMARINE,
        length: 1,
        width: 1,
        count: 1,
    },
    [ShipName.SUPPLY_BOAT]: {
        name: ShipName.SUPPLY_BOAT,
        length: 2,
        width: 1,
        count: 1,
    },
    [ShipName.DESTROYER]: {
        name: ShipName.DESTROYER,
        length: 3,
        width: 1,
        count: 1,
    },
    [ShipName.BATTLESHIP]: {
        name: ShipName.BATTLESHIP,
        length: 4,
        width: 1,
        count: 1,
    },
    [ShipName.FRIGATE]: {
        name: ShipName.FRIGATE,
        length: 5,
        width: 1,
        count: 1,
    },
    [ShipName.AIRCRAFT_CARRIER]: {
        name: ShipName.AIRCRAFT_CARRIER,
        length: 5,
        width: 2,
        count: 1,
    },

} as const;

export default SHIPS;