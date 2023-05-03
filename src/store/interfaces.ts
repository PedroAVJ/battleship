import { ShipName, MapName, Orientation } from '@/store/enums';


export interface RootState {

    game: {
        isInProgress: boolean;
        mapName?: MapName;
        isMoveInProgress: boolean;
    }

    gui: {

        // Keeps track of the ships left to place in case the page is refreshed
        submarineCount: number;
        supplyBoatCount: number;
        destroyerCount: number;
        battleshipCount: number;
        frigateCount: number;
        aircraftCarrierCount: number;

    };

    // Keeps track of what ship should be rendered on the board while hoovering over the board
    shipNamePreview?: ShipName;
    shipOrientationPreview?: Orientation;

    // User stores info about abilities, health, board, etc.
    player: User;
    computer: User;

}

export interface User {

    // GUI changes during ability usage
    isUsingSubmarineAbility: boolean;
    isUsingAircraftCarrierAbility: boolean;
    isUsingBattleshipAbility: boolean;

    // GUI changes after ability usage
    hasUsedSubmarineAbility: boolean;
    hasUsedAircraftCarrierAbility: boolean;
    hasUsedBattleshipAbility: boolean;

    // If their health is 0, their ability is consumed
    aircraftCarrierHealth: number;
    battleshipHealth: number;

    // When the ability is used, this is the number of shots that can be fired
    aircraftCarrierShots: number;

    hasCurrentTurn: boolean;
    hasWonTheGame: boolean;
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

    /**
     * If ship is present, we consider that a hitbox is present on this tile.
     */
    ship?: {
        name: ShipName;

        /**
         * If the orientation is present, we start drawing the SVG from this tile.
         */
        orientation?: Orientation;
    };

    /**
     * This is used to preview the ship before it is placed.
     */
    ship_preview?: {
        name: ShipName;
        orientation: Orientation;
    };
}