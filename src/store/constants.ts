import { ShipName, MapName } from '@/store/enums'
import { Tile } from '@/store/interfaces'


/**
 * Represents the number of ships of each type that are available to place on the board.
 */
export const SHIP_COUNTS = {
    [ShipName.AIRCRAFT_CARRIER]: 1,
    [ShipName.FRIGATE]: 1,
    [ShipName.BATTLESHIP]: 1,
    [ShipName.DESTROYER]: 1,
    [ShipName.SUPPLY_BOAT]: 1,
    [ShipName.SUBMARINE]: 1,
} as const;

export const SHIP_DIMENSIONS = {

    [ShipName.SUBMARINE]: {
        length: 1,
        width: 1,
    },
    [ShipName.SUPPLY_BOAT]: {
        length: 2,
        width: 1,
    },
    [ShipName.DESTROYER]: {
        length: 3,
        width: 1,
    },
    [ShipName.BATTLESHIP]: {
        length: 4,
        width: 1,
    },
    [ShipName.FRIGATE]: {
        length: 5,
        width: 1,
    },
    [ShipName.AIRCRAFT_CARRIER]: {
        length: 5,
        width: 2,
    },

} as const;

// Water Tile (_): see MAPS for context
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
};

// Land Tile (M): see MAPS for context
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
};

// Out of bounds Tile (X): see MAPS for context
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
};

/**
 * This is where maps are sketched and designed.
 * M represents land, _ represents water, and X represents out of bounds.
 *
 * This format achieves an optimal height-to-width ratio on the screen.
 * - Using '.' for water, '#' for land and 'X' for out of bounds in nested lists was too wide.
 * - Using strings like 'X..#..#..#.X' for each row was too tall.
 *
 * This map data is only used once in the application, so there is no risk of
 * just passing it directly as a board as it is not a big deal to have to convert
 * it to a board. It is more important to have a readable map.
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