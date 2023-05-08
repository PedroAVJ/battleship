import ShipName from "@/types/ShipName";


const SHIPS = {

    [ShipName.SUBMARINE]: {
        length: 1,
        width: 1,
        count: 1,
    },
    [ShipName.SUPPLY_BOAT]: {
        length: 2,
        width: 1,
        count: 1,
    },
    [ShipName.DESTROYER]: {
        length: 3,
        width: 1,
        count: 1,
    },
    [ShipName.BATTLESHIP]: {
        length: 4,
        width: 1,
        count: 1,
        health: 4,
    },
    [ShipName.FRIGATE]: {
        length: 5,
        width: 1,
        count: 1,
    },
    [ShipName.AIRCRAFT_CARRIER]: {
        length: 5,
        width: 2,
        count: 1,
        health: 10,
        shots: 3,
    },

} as const;

export default SHIPS;