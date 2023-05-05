import Orientation from "@/types/Orientation";
import ShipName from "@/types/ShipName";


/**
 * @property `length` - The length of the ship in board cells.
 * @property `width` - The width of the ship in board cells.
 * @property `count` - The number of ships of this type that both players will have to place.
 */
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
    },

} as const;

export default SHIPS;

export function getShipHitboxes(shipName: ShipName, orientation: Orientation): { row: number, col: number }[] {
    const shipHitboxes: { row: number, col: number }[] = [];

    // The coordinates marked by row and col are the top left corner of the ship
    for (let i = 0; i < SHIPS[shipName].length; i++) {
        for (let j = 0; j < SHIPS[shipName].width; j++) {

            // If the ship is horizontal, i represents the column and j represents the row
            // This is because the length moves horizontally and the width moves vertically
            // X X X X X
            // X X X X X
            if (orientation === Orientation.HORIZONTAL) {
                shipHitboxes.push({
                    row: j,
                    col: i,
                });
            }

            // If the ship is vertical, i represents the row and j represents the column
            // This is because the length moves vertically and the width moves horizontally
            // X X
            // X X
            // X X
            // X X
            if (orientation === Orientation.VERTICAL) {
                shipHitboxes.push({
                    row: i,
                    col: j,
                });
            }
        }
    }

    return shipHitboxes;
}