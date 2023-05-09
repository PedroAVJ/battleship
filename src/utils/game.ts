import { User, Tile } from "./Interfaces";
import { ShipName, Orientation } from "./Enums";
import { SHIPS } from "./Constants";


// Hacky way to wait inlined in a function
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function allShipsPlaced(user: User): boolean {
    let flag = true;
    Object.values(ShipName).forEach((shipName) => {
        if (user[shipName].guiCount > 0) {
            flag = false;
        }
    });
    return flag;
}

export function isGameOver(board: Tile[][]): boolean {

    // Empty board is not game over
    if (board.length === 0) return false;
    if (board[0].length === 0) return false;

    for (const row of board) {
        for (const tile of row) {
            if (tile.shipHitbox && !tile.contains.successfulShot) {
                return false;
            }
        }
    }
    return true;
}

export function hasValidMove(board: Tile[][]): boolean {
    for (const row of board) {
        for (const tile of row) {
            if (!isInvalidSquare(tile)) {
                return true;
            }
        }
    }
    return false;
}

export function makeRandomValidMove(board: Tile[][]): { row: number, col: number } {
    if (isGameOver(board)) {
        throw new Error('Game is over, cannot make a move.');
    }
    if (!hasValidMove(board)) {
        throw new Error('No valid moves available.');
    }
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);

    if (isInvalidSquare(board[row][col])) {
        return makeRandomValidMove(board);
    }
    return { row, col };
}

export function getShipHitboxes(shipName: ShipName, orientation: Orientation): { row: number, col: number }[] {
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

export function isInvalidShipPlacement(board: Tile[][], shipName: ShipName, shipOrientation: Orientation, row: number, col: number): boolean {
    const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
    for (const hitbox of shipHitboxes) {
        if (hitbox.row + row >= board.length) return true;
        if (hitbox.col + col >= board[0].length) return true;
        const tile = board[hitbox.row + row][hitbox.col + col];
        if (isInvalidSquare(tile)) return true;
        if (tile.shipHitbox) return true;
    }
    return false;
}

export function placeShip(board: Tile[][], shipName: ShipName, shipOrientation: Orientation, row: number, col: number): void {
    if (isInvalidShipPlacement(board, shipName, shipOrientation, row, col)) {
        throw new Error('Invalid ship placement.');
    }
    const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
    for (const hitbox of shipHitboxes) {
        const tile = board[hitbox.row + row][hitbox.col + col];
        tile.shipHitbox = shipName;
        if (tile.shipSprite) {
            tile.shipSprite.isPreview = false;
        }
    }
}

export function randomlyPlaceShips(board: Tile[][]): void {
    const shipNames = Object.values(ShipName);
    shipNames.forEach((shipName) => {
        for (let i = 0; i < SHIPS[shipName].count; i++) {
            while (true) {
                const row = Math.floor(Math.random() * board.length);
                const col = Math.floor(Math.random() * board[0].length);
                const orientation = Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;

                if (isInvalidShipPlacement(board, shipName, orientation, row, col)) continue;

                placeShip(board, shipName, orientation, row, col);
                break;
            }
        }
    });

}

export function uncoverShip(board: Tile[][], shipName: ShipName): void {
    for (const row of board) {
        for (const tile of row) {
            if (tile.shipHitbox && tile.shipHitbox === shipName) {
                tile.contains.uncoveredShip = true;
            }
        }
    }
}

export function submarineAttack(board: Tile[][], row_origin: number, col_origin: number): void {
    for (let row = row_origin - 1; row <= row_origin + 1; row++) {
        for (let col = col_origin - 1; col <= col_origin + 1; col++) {

            // Out of bounds check
            if (row < 0 || row >= board.length) continue;
            if (col < 0 || col >= board[0].length) continue;

            const tile = board[row][col];
            if (isInvalidSquare(tile)) continue;

            if (tile.shipHitbox) {
                tile.contains.uncoveredShip = true;
            }
            else {
                tile.contains.missedShot = true;
            }

        }
    }

}

export function battleshipAttack(board: Tile[][], row_origin: number, col_origin: number): void {
    for (let row = row_origin - 1; row <= row_origin + 1; row++) {
        for (let col = col_origin - 1; col <= col_origin + 1; col++) {
            normalAttack(board, row, col);
        }
    }
}

export function normalAttack(board: Tile[][], row: number, col: number): void {

    // Out of bounds check
    if (row < 0 || row >= board.length) return;
    if (col < 0 || col >= board[0].length) return;

    const tile = board[row][col];
    if (isInvalidSquare(tile)) return;

    if (tile.shipHitbox !== undefined) {
        tile.contains.successfulShot = true;
    }
    else {
        tile.contains.missedShot = true;
    }
}

export function isInvalidSquare(tile: Tile): boolean {
    const isInvalidSquare =
        tile.background.isLand
        || tile.background.isOutOfBounds
        || tile.contains.missedShot
        || tile.contains.successfulShot;
    return isInvalidSquare;
}