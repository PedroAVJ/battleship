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
        health: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
    }

    [ShipName.SUPPLY_BOAT]: {
        guiCount: number;
        health: number;
    }

    [ShipName.DESTROYER]: {
        guiCount: number;
        health: number;
    }

    [ShipName.BATTLESHIP]: {
        guiCount: number;
        health: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
    }

    [ShipName.FRIGATE]: {
        guiCount: number;
        health: number;
    }

    [ShipName.AIRCRAFT_CARRIER]: {
        guiCount: number;
        health: number;
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
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