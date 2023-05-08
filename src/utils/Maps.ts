import Tile from "@/types/Tile";
import MapName from "@/types/MapName";

const tileSchema = {
    background: {
        isWater: false,
        isLand: false,
        isOutOfBounds: false,
    },
    contains: {
        missedShot: false,
        successfulShot: false,
        uncoveredShip: false,
    },
};
// Water Tile (_): see const MAPS for context
const _ = new Tile(tileSchema.background, tileSchema.contains);
_.background.isWater = true;

// Land Tile (M): see const MAPS for context
const M = new Tile(tileSchema.background, tileSchema.contains);
M.background.isLand = true;

// Out of bounds Tile (X): see const MAPS for context
const X = new Tile(tileSchema.background, tileSchema.contains);
X.background.isOutOfBounds = true;

/**
 * WARNING: Use JSON.stringify() to get a deep copy of the map.
 */
const MAPS = {
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

export default MAPS;