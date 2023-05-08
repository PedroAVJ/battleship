import Tile from './Tile';
import ShipName from './ShipName';
import Orientation from './Orientation';
import SHIPS from '@/constants/Ships';


export default class Board {

    tiles: Tile[][];

    constructor(tiles: Tile[][]) {
        this.tiles = tiles;
    }

    isGameOver(): boolean {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (tile.shipHitbox && !tile.contains.uncoveredShip) {
                    return false;
                }
            }
        }
        return true;
    }

    hasValidMove(): boolean {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile.isInvalidSquare()) {
                    return true;
                }
            }
        }
        return false;
    }

    makeRandomValidMove(): { row: number, col: number } {
        if (this.isGameOver()) {
            throw new Error('Game is over, cannot make a move.');
        }
        if (!this.hasValidMove()) {
            throw new Error('No valid moves available.');
        }
        const row = Math.floor(Math.random() * this.tiles.length);
        const col = Math.floor(Math.random() * this.tiles[0].length);

        if (this.tiles[row][col].isInvalidSquare()) {
            return this.makeRandomValidMove();
        }
        return { row, col };
    }

    getShipHitboxes(shipName: ShipName, orientation: Orientation): { row: number, col: number }[] {
        const shipHitboxes: { row: number, col: number }[] = [];
        for (let i = 0; i < SHIPS[shipName].length; i++) {
            for (let j = 0; j < SHIPS[shipName].width; j++) {
    
                // If the ship is horizontal, i represents the column and j represents the row
                // This is because the length moves horizontally and the width moves vertically
                // X X X X X
                // X X X X X
                if (orientation === Orientation.HORIZONTAL) {
                    shipHitboxes.push({
                        row: j,
                        col: i,
                    });
                }
    
                // If the ship is vertical, i represents the row and j represents the column
                // This is because the length moves vertically and the width moves horizontally
                // X X
                // X X
                // X X
                // X X
                if (orientation === Orientation.VERTICAL) {
                    shipHitboxes.push({
                        row: i,
                        col: j,
                    });
                }
            }
        }
    
        return shipHitboxes;
    }

    isInvalidShipPlacement(shipName: ShipName, shipOrientation: Orientation, row: number, col: number): boolean {
        const shipHitboxes = this.getShipHitboxes(shipName, shipOrientation);
        for (const hitbox of shipHitboxes) {
            const tile = this.tiles[hitbox.row + row][hitbox.col + col];
            if (tile.isInvalidSquare()) return true;
            if (tile.shipHitbox) return true;
        }
        return false;
    }

    placeShip(shipName: ShipName, shipOrientation: Orientation, row: number, col: number): void {
        if (this.isInvalidShipPlacement(shipName, shipOrientation, row, col)) {
            throw new Error('Invalid ship placement.');
        }
        const shipHitboxes = this.getShipHitboxes(shipName, shipOrientation);
        for (const hitbox of shipHitboxes) {
            this.tiles[hitbox.row + row][hitbox.col + col].shipHitbox = shipName;

            const hitboxIsTopLeftCorner = hitbox.row === 0 && hitbox.col === 0;
            if (hitboxIsTopLeftCorner) {
                this.tiles[hitbox.row + row][hitbox.col + col].shipSprite = {
                    name: shipName,
                    orientation: shipOrientation,
                    isPreview: false,
                }
            }
        }
    }

    randomlyPlaceShips(): void {
        const shipNames = Object.values(ShipName);
        shipNames.forEach((shipName) => {
            for (let i = 0; i < SHIPS[shipName].count; i++) {
                while (true) {
                    const row = Math.floor(Math.random() * this.tiles.length);
                    const col = Math.floor(Math.random() * this.tiles[0].length);
                    const orientation = Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;

                    if (this.isInvalidShipPlacement(shipName, orientation, row, col)) continue;

                    this.placeShip(shipName, orientation, row, col);
                    break;
                }
            }
        });

    }

    uncoverShip(shipName: ShipName): void {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (tile.shipHitbox && tile.shipHitbox === shipName) {
                    tile.contains.uncoveredShip = true;
                }
            }
        }
    }

    submarineAttack(row_origin: number, col_origin: number): void {
        for (let row = row_origin - 1; row <= row_origin + 1; row++) {
            for (let col = col_origin - 1; col <= col_origin + 1; col++) {
                const tile = this.tiles[row][col];
                if (tile.isInvalidSquare()) continue;

                if (tile.shipHitbox) {
                    tile.contains.uncoveredShip = true;
                }
                else {
                    tile.contains.missedShot = true;
                }

            }
        }

    }

    battleshipAttack(row_origin: number, col_origin: number): void {
        for (let row = row_origin - 1; row <= row_origin + 1; row++) {
            for (let col = col_origin - 1; col <= col_origin + 1; col++) {
                const tile = this.tiles[row][col];
                if (tile.isInvalidSquare()) continue;

                if (tile.shipHitbox) {
                    tile.contains.successfulShot = true;
                }
                else {
                    tile.contains.missedShot = true;
                }

            }
        }

    }

    normalAttack(row: number, col: number): void {
        const tile = this.tiles[row][col];
        if (tile.isInvalidSquare()) return;

        if (tile.shipHitbox !== undefined) {
            tile.contains.successfulShot = true;
        }
        else {
            tile.contains.missedShot = true;
        }

    }

}