import { ShipName, Orientation } from "./Enums";


export interface RootState {

    player: User;
    computer: User;

    currentlyDraggedShip?: {
        name: ShipName;
        orientation: Orientation;
    }

}


export interface User {

    [ShipName.SUBMARINE]: {
        guiCount: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
    }

    [ShipName.SUPPLY_BOAT]: {
        guiCount: number;
    }

    [ShipName.DESTROYER]: {
        guiCount: number;
    }

    [ShipName.BATTLESHIP]: {
        guiCount: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
        health: number;
    }

    [ShipName.FRIGATE]: {
        guiCount: number;
    }

    [ShipName.AIRCRAFT_CARRIER]: {
        guiCount: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
        health: number;
        shots: number;
    }

    isMakingMove: boolean;
    hasCurrentTurn: boolean;

    board: Tile[][];

}


export interface Tile {

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