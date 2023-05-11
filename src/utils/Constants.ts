import { ShipName, MapName } from "./Enums";
import { Tile } from "./Interfaces";

export const SHIPS = {

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
        shots: 3,
    },

} as const;


// Water Tile (_): see const MAPS for context
const _: Tile = {
    background: {
        isWater: true,
        isLand: false,
        isOutOfBounds: false,
    },
    contains: {
        missedShot: false,
        successfulShot: false,
        uncoveredShip: false,
    },
}

// Land Tile (M): see const MAPS for context
const M: Tile = {
    background: {
        isWater: false,
        isLand: true,
        isOutOfBounds: false,
    },
    contains: {
        missedShot: false,
        successfulShot: false,
        uncoveredShip: false,
    },
}

// Out of bounds Tile (X): see const MAPS for context
const X: Tile = {
    background: {
        isWater: false,
        isLand: false,
        isOutOfBounds: true,
    },
    contains: {
        missedShot: false,
        successfulShot: false,
        uncoveredShip: false,
    },
}

/**
 * WARNING: Use JSON.stringify() to get a deep copy of the map.
 */
export const MAPS = {
    [MapName.CLASSIC]: [
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
    ],
    [MapName.THE_GREAT_DIVIDE]: [
        [_, _, M, M, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, M, M, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, M, M, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, M, M, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, M, M, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, M, M, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, M, M, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, M, M, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, M, M, M, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, M, M, M, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, M, M, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, M, M, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, M, M, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, M, M, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, M, M, _, _, _, _, _, _],
    ],
    [MapName.ARCHIPELAGO_ASSAULT]: [
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, M, M, M, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, M, _, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, M, _, _],
        [_, _, _, _, _, _, M, _, _, _, _, _, M, _, _],
        [_, _, _, _, _, M, M, M, M, M, _, _, M, M, _],
        [_, _, _, _, _, M, M, _, _, _, _, _, _, M, M],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        [_, M, _, M, _, _, _, _, _, _, M, _, _, _, _],
        [M, M, M, M, M, _, _, _, _, M, M, _, _, _, _],
        [M, M, M, _, _, _, _, _, _, _, M, M, _, _, _],
        [M, M, _, _, _, _, _, _, _, _, _, M, M, _, _],
        [_, _, _, _, _, _, _, _, _, _, M, M, M, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, M, M, _, _],
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ],
    [MapName.PACMAN]: [
        [X, X, X, X, X, _, _, _, _, _, X, X, X, X, X],
        [X, X, X, X, _, _, _, _, _, _, _, X, X, X, X],
        [X, X, X, _, _, _, _, _, _, _, _, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, X, X, X],
        [X, _, _, _, _, _, _, _, _, _, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, _, X, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, X, X, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, _, X, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, _, _, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, _, _, _, _, _, _, _, _, _, X, X, X],
        [X, X, X, X, _, _, _, _, _, _, _, X, X, X, X],
        [X, X, X, X, X, _, _, _, _, _, X, X, X, X, X],
    ],
} as const;