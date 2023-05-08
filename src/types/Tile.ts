import ShipName from "./ShipName";
import Orientation from "./Orientation";


export default class Tile {

    background: {
        isWater: boolean;
        isLand: boolean;
        isOutOfBounds: boolean;
    };

    contains: {
        missedShot: boolean;
        successfulShot: boolean;
        uncoveredShip: boolean;
    };

    shipSprite?: {
        isPreview: boolean;
        name: ShipName;
        orientation: Orientation;
    };

    shipHitbox?: ShipName;

    constructor(background: {
        isWater: boolean;
        isLand: boolean;
        isOutOfBounds: boolean;
    }, contains: {
        missedShot: boolean;
        successfulShot: boolean;
        uncoveredShip: boolean;
    }) {
        this.background = background;
        this.contains = contains;
    }

    isInvalidSquare(): boolean {
        const isInvalidSquare =
            this.background.isLand
            || this.background.isOutOfBounds
            || this.contains.missedShot
            || this.contains.successfulShot;
        return isInvalidSquare;
    }
}