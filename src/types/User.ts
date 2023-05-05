import Board from './Board';


/**
 * @property `aircraftCarrier` - The shots property keeps track of how many shots the aircraft carrier has left to fire, as when it uses its ability it can fire multiple shots.
 * @property `isMoveInProgress` - Keeps track of whether the user is currently making a move, this flag gets set to true when the user clicks on a square.
 * @method `makeRandomValidMove` - If the game is over or there are no valid moves, an error is thrown.
 * @method `placeShip` - If the ship placement is invalid, an error is thrown.
 */
export default class User {

    submarine: {
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
    }

    battleship: {
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
        health: number;
    }

    aircraftCarrier: {
        isUsingAbility: boolean;
        hasUsedAbility: boolean;
        health: number;
        shots: number;
    }

    isMoveInProgress: boolean;
    hasCurrentTurn: boolean;

    board: Board;

    constructor() {
        this.submarine = {
            isUsingAbility: false,
            hasUsedAbility: false,
        };
        this.battleship = {
            isUsingAbility: false,
            hasUsedAbility: false,
            health: 0,
        };
        this.aircraftCarrier = {
            isUsingAbility: false,
            hasUsedAbility: false,
            health: 0,
            shots: 0,
        };
        this.isMoveInProgress = false;
        this.hasCurrentTurn = false;
        this.board = new Board();
    }

    hasLost(): boolean {
        return this.board.isGameOver();
    }

}