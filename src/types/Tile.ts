import Ship from "./Ship";


/**
 * @property `contains` - Regular and preview sprites indicate if an SVG sprite should be rendered on this tile.
 * @property `ship` - If ship is present, we consider that a hitbox is present on this tile.
 */
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

        regularSprite: boolean;
        previewSprite: boolean;
    };

    ship?: Ship

    constructor() {
        this.background = {
            isWater: false,
            isLand: false,
            isOutOfBounds: false,
        };

        this.contains = {
            missedShot: false,
            successfulShot: false,
            uncoveredShip: false,

            regularSprite: false,
            previewSprite: false,
        };
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