import Orientation from "./Orientation";
import SHIPS from "@/constants/Ships";


/**
 * @method `getShipHitboxes` - Returns the hitboxes of a ship given its top left corner coordinates. This is to keep it consistent with the way ships are placed on the board.
 */
export default class Ship {
    readonly name: keyof typeof SHIPS;
    readonly length: number;
    readonly width: number;
    readonly count: number;
    orientation: Orientation;
  
    constructor(ship: keyof typeof SHIPS, orientation: Orientation) {
      this.name = SHIPS[ship].name;
      this.length = SHIPS[ship].length;
      this.width = SHIPS[ship].width;
      this.count = SHIPS[ship].count;
      this.orientation = orientation;
    }

    getShipHitboxes(): { row: number, col: number }[] {
        const shipHitboxes: { row: number, col: number }[] = [];

        // The coordinates marked by row and col are the top left corner of the ship
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.width; j++) {

                // If the ship is horizontal, i represents the column and j represents the row
                // This is because the length moves horizontally and the width moves vertically
                // X X X X X
                // X X X X X
                if (this.orientation === Orientation.HORIZONTAL) {
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
                if (this.orientation === Orientation.VERTICAL) {
                    shipHitboxes.push({
                        row: i,
                        col: j,
                    });
                }
            }
        }

        return shipHitboxes;
    }
}