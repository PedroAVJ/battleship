import ShipName from './ShipName';
import Tile from './Tile';


export default interface User {

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