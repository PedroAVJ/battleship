import Ship from './Ship';
import Tile from './Tile';
import SHIPS from '@/constants/Ships';
import ShipName from './ShipName';
import Orientation from './Orientation';


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

    board: Tile[][];

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
        this.board = [[]];
    }

    hasValidMove(): boolean {
        for (const row of this.board) {
            for (const tile of row) {
                if (!tile.isInvalidSquare()) {
                    return true;
                }
            }
        }

        return false;
    }

    hasLost(): boolean {
        for (const row of this.board) {
            for (const tile of row) {
                if (tile.ship && !tile.contains.uncoveredShip) {
                    return false;
                }
            }
        }

        return true;
    }

    makeRandomValidMove(): { row: number, col: number } {
        if (this.hasLost()) {
            throw new Error('Game is over, cannot make a move.');
        }
        if (!this.hasValidMove()) {
            throw new Error('No valid moves available.');
        }
        const row = Math.floor(Math.random() * this.board.length);
        const col = Math.floor(Math.random() * this.board[0].length);

        if (this.board[row][col].isInvalidSquare()) {
            return this.makeRandomValidMove();
        }

        return { row, col };
    }

    isInvalidShipPlacement(ship: Ship, row: number, col: number): boolean {
        const shipHitboxes = ship.getShipHitboxes();

        for (const hitbox of shipHitboxes) {
            const tile = this.board[hitbox.row + row][hitbox.col + col];
            if (tile.isInvalidSquare()) return true;

            // Ship hitbox check
            if (tile.ship) return true;

        }

        return false;
    }

    placeShip(ship: Ship, row: number, col: number): void {
        if (this.isInvalidShipPlacement(ship, row, col)) {
            throw new Error('Invalid ship placement.');
        }
        const shipHitboxes = ship.getShipHitboxes();
        for (const hitbox of shipHitboxes) {
            this.board[hitbox.row + row][hitbox.col + col].ship = ship;

            // If this is the top left corner of the ship (the first hitbox), set the ship sprite
            if (hitbox.row === 0 && hitbox.col === 0) {
                this.board[hitbox.row + row][hitbox.col + col].contains.regularSprite = true;
            }
        }
    }

    randomlyPlaceShips(): void {

        // Since TS doesn't infer the type in a for loop, we need to uses Object.values
        Object.values(ShipName).forEach((shipName) => {
            for (let i = 0; i < SHIPS[shipName].count; i++) {
                while (true) {
                    const row = Math.floor(Math.random() * this.board.length);
                    const col = Math.floor(Math.random() * this.board[0].length);
                    const orientation = Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;
                    const ship = new Ship(shipName, orientation);

                    if (this.isInvalidShipPlacement(ship, row, col)) {
                        continue;
                    }

                    this.placeShip(ship, row, col);
                    break;
                }
            }
        });

    }

    uncoverShip(shipName: ShipName): void {
        for (const row of this.board) {
            for (const tile of row) {
                if (tile.ship && tile.ship.name === shipName) {
                    tile.contains.uncoveredShip = true;
                }
            }
        }
    }

    submarineAttack(row_origin: number, col_origin: number): void {

        // Iterate over a 3x3 area around the square
        for (let row = row_origin - 1; row <= row_origin + 1; row++) {
            for (let col = col_origin - 1; col <= col_origin + 1; col++) {
                const tile = this.board[row][col];
                if (tile.isInvalidSquare()) continue;

                // If the square contains a ship, uncover it
                if (tile.ship !== undefined) {
                    tile.contains.uncoveredShip = true;
                }

                // Otherwise, mark it as a missed shot
                else {
                    tile.contains.missedShot = true;
                }

            }
        }

    }

    battleshipAttack(row_origin: number, col_origin: number): void {

        // Iterate over a 3x3 area around the square
        for (let row = row_origin - 1; row <= row_origin + 1; row++) {
            for (let col = col_origin - 1; col <= col_origin + 1; col++) {
                const tile = this.board[row][col];
                if (tile.isInvalidSquare()) continue;

                // If the square contains a ship, hit it
                if (tile.ship !== undefined) {
                    tile.contains.successfulShot = true;
                }

                // Otherwise, mark it as a missed shot
                else {
                    tile.contains.missedShot = true;
                }

            }
        }

    }

    normalAttack(row: number, col: number): void {
        const tile = this.board[row][col];
        if (tile.isInvalidSquare()) return;

        // If the square contains a ship, hit it
        if (tile.ship !== undefined) {
            tile.contains.successfulShot = true;
        }

        // Otherwise, mark it as a missed shot
        else {
            tile.contains.missedShot = true;
        }

    }

}