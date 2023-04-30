import { ShipName, MapName } from '@/store/enums'
import { Tile } from '@/store/interfaces'


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
 * M represents land, _ represents water.
 *
 * This format achieves an optimal height-to-width ratio on the screen.
 * - Using '.' for water and '#' for land in nested lists was too wide.
 * - Using strings like '..#..#..#.' for each row was too tall.
 *
 * This map data is only used once in the application, so there is no risk of
 * just passing it directly as a board as it is not a big deal to have to convert
 * it to a board. It is more important to have a readable map.
 */
export const MAPS = {
    [MapName.MAP1]: [
        [_, _, _, _, _, _, _, _, _, _],
        [_, M, M, M, M, M, M, M, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, _, M, M, M, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, M, M, M, M, M, M, M, _],
    ],
    [MapName.MAP2]: [
        [_, _, _, _, _, _, _, _, _, _],
        [_, M, M, M, M, M, M, M, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, _, M, M, M, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, M, M, M, M, M, M, M, _],
    ],
    [MapName.MAP3]: [
        [_, _, _, _, _, _, _, _, _, _],
        [_, M, M, M, M, M, M, M, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, _, M, M, M, M, _, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, M, _, _, M, _, M, _],
        [_, M, _, _, _, _, _, _, M, _],
        [_, M, M, M, M, M, M, M, M, _],
    ],
} as const;