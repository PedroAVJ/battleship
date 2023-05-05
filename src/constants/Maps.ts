import Tile from "@/types/Tile";
import MapName from "@/types/MapName";


// Water Tile (_): see const MAPS for context
const _ = new Tile();
_.background.isWater = true;

// Land Tile (M): see const MAPS for context
const M = new Tile();
M.background.isLand = true;

// Out of bounds Tile (X): see const MAPS for context
const X = new Tile();
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