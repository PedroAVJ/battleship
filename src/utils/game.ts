import ShipName from "@/types/ShipName";
import User from "@/types/User";
import Orientation from "@/types/Orientation";
import SHIPS from "./Ships";
import Board from "@/types/Board";
import Tile from "@/types/Tile";

export function allShipsPlaced(user: User): boolean {
    let flag = true;
    Object.values(ShipName).forEach((shipName) => {
        if (user[shipName].guiCount > 0) {
            flag = false;
        }
    });
    return flag;
}

export function isGameOver(board: Board): boolean {
    for (const row of board.tiles) {
        for (const tile of row) {
            if (tile.shipHitbox && !tile.contains.uncoveredShip) {
                return false;
            }
        }
    }
    return true;
}

export function hasValidMove(board: Board): boolean {
    for (const row of board.tiles) {
        for (const tile of row) {
            if (!isInvalidSquare(tile)) {
                return true;
            }
        }
    }
    return false;
}

export function makeRandomValidMove(board: Board): { row: number, col: number } {
    if (board.isGameOver()) {
        throw new Error('Game is over, cannot make a move.');
    }
    if (!board.hasValidMove()) {
        throw new Error('No valid moves available.');
    }
    const row = Math.floor(Math.random() * board.tiles.length);
    const col = Math.floor(Math.random() * board.tiles[0].length);

    if (isInvalidSquare(board.tiles[row][col])) {
        return board.makeRandomValidMove();
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

export function isInvalidShipPlacement(board: Board, shipName: ShipName, shipOrientation: Orientation, row: number, col: number): boolean {
    const shipHitboxes = board.getShipHitboxes(shipName, shipOrientation);
    for (const hitbox of shipHitboxes) {
        if (hitbox.row + row >= board.tiles.length) return true;
        if (hitbox.col + col >= board.tiles[0].length) return true;
        const tile = board.tiles[hitbox.row + row][hitbox.col + col];
        if (isInvalidSquare(tile)) return true;
        if (tile.shipHitbox) return true;
    }
    return false;
}

export function placeShip(board: Board, shipName: ShipName, shipOrientation: Orientation, row: number, col: number): void {
    if (board.isInvalidShipPlacement(shipName, shipOrientation, row, col)) {
        throw new Error('Invalid ship placement.');
    }
    const shipHitboxes = board.getShipHitboxes(shipName, shipOrientation);
    for (const hitbox of shipHitboxes) {
        const tile = board.tiles[hitbox.row + row][hitbox.col + col];
        tile.shipHitbox = shipName;
        if (tile.shipSprite) {
            tile.shipSprite.isPreview = false;
        }
    }
}

export function randomlyPlaceShips(board: Board): void {
    const shipNames = Object.values(ShipName);
    shipNames.forEach((shipName) => {
        for (let i = 0; i < SHIPS[shipName].count; i++) {
            while (true) {
                const row = Math.floor(Math.random() * board.tiles.length);
                const col = Math.floor(Math.random() * board.tiles[0].length);
                const orientation = Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;

                if (board.isInvalidShipPlacement(shipName, orientation, row, col)) continue;

                board.placeShip(shipName, orientation, row, col);
                break;
            }
        }
    });

}

export function uncoverShip(board: Board, shipName: ShipName): void {
    for (const row of board.tiles) {
        for (const tile of row) {
            if (tile.shipHitbox && tile.shipHitbox === shipName) {
                tile.contains.uncoveredShip = true;
            }
        }
    }
}

export function submarineAttack(board: Board, row_origin: number, col_origin: number): void {
    for (let row = row_origin - 1; row <= row_origin + 1; row++) {
        for (let col = col_origin - 1; col <= col_origin + 1; col++) {
            const tile = board.tiles[row][col];
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

export function battleshipAttack(board: Board, row_origin: number, col_origin: number): void {
    for (let row = row_origin - 1; row <= row_origin + 1; row++) {
        for (let col = col_origin - 1; col <= col_origin + 1; col++) {
            const tile = board.tiles[row][col];
            if (isInvalidSquare(tile)) continue;

            if (tile.shipHitbox) {
                tile.contains.successfulShot = true;
            }
            else {
                tile.contains.missedShot = true;
            }

        }
    }

}

export function normalAttack(board: Board, row: number, col: number): void {
    const tile = board.tiles[row][col];
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