import Board from './Board';
import ShipName from './ShipName';
import SHIPS from '@/constants/Ships';


export default class User {

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

    board: Board;

    constructor() {
        this[ShipName.SUBMARINE] = {
            guiCount: SHIPS[ShipName.SUBMARINE].count,
            isUsingAbility: false,
            hasUsedAbility: false,
        };
        this[ShipName.SUPPLY_BOAT] = {
            guiCount: SHIPS[ShipName.SUPPLY_BOAT].count,
        };
        this[ShipName.DESTROYER] = {
            guiCount: SHIPS[ShipName.DESTROYER].count,
        };
        this[ShipName.BATTLESHIP] = {
            guiCount: SHIPS[ShipName.BATTLESHIP].count,
            isUsingAbility: false,
            hasUsedAbility: false,
            health: SHIPS[ShipName.BATTLESHIP].health,
        };
        this[ShipName.FRIGATE] = {
            guiCount: SHIPS[ShipName.FRIGATE].count,
        };
        this[ShipName.AIRCRAFT_CARRIER] = {
            guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
            isUsingAbility: false,
            hasUsedAbility: false,
            health: SHIPS[ShipName.AIRCRAFT_CARRIER].health,
            shots: SHIPS[ShipName.AIRCRAFT_CARRIER].shots,
        };
        this.isMakingMove = false;
        this.hasCurrentTurn = false;
        this.board = new Board([[]]);
    }

    allShipsPlaced(): boolean {
        return Object.values(this).every((ship: any) => ship.guiCount === 0);
    }

}