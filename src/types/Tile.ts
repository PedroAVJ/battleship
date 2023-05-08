import ShipName from "./ShipName";
import Orientation from "./Orientation";


export default interface Tile {

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

}