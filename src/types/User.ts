import Board from './Board';
import ShipName from './ShipName';
import SHIPS from '@/constants/Ships';


/**
 * @property `aircraftCarrier` - The shots property keeps track of how many shots the aircraft carrier has left to fire, as when it uses its ability it can fire multiple shots.
 * @property `isMoveInProgress` - Keeps track of whether the user is currently making a move, this flag gets set to true when the user clicks on a square.
 * @method `makeRandomValidMove` - If the game is over or there are no valid moves, an error is thrown.
 * @method `placeShip` - If the ship placement is invalid, an error is thrown.
 */
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

    isMoveInProgress: boolean;
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
            health: 4,
        };
        this[ShipName.FRIGATE] = {
            guiCount: SHIPS[ShipName.FRIGATE].count,
        };
        this[ShipName.AIRCRAFT_CARRIER] = {
            guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
            isUsingAbility: false,
            hasUsedAbility: false,
            health: 10,
            shots: 3,
        };
        this.isMoveInProgress = false;
        this.hasCurrentTurn = false;
        this.board = new Board();
    }

    hasLost(): boolean {
        return this.board.isGameOver();
    }

}