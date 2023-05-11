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
        const isFirstHitbox = hitbox.row === 0 && hitbox.col === 0;
        if (isFirstHitbox) {
            tile.shipSprite = {
                name: shipName,
                orientation: shipOrientation,
                isPreview: false,
            }
        }
    }
}

export function randomlyPlaceShips(board: Tile[][], shipNames: ShipName[]): void {
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


    if (tile.shipHitbox) {
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

export function useAbility(user: User): void {

    // The priority of the abilities is as follows:
    // 1. Battleship
    // 2. Submarine
    // 3. Aircraft Carrier
    // This goes from most powerful to least powerful

    if (!user[ShipName.BATTLESHIP].hasUsedAbility) {

        // Randomly use this ability, as a function of the battleship health
        const health = user[ShipName.BATTLESHIP].health;

        // Base probability is 5%
        let probability = 0.05;

        // Probability increases as the battleship health decreases
        if (health === 3) {
            probability = 0.1;
        } else if (health === 2) {
            probability = 0.4;
        } else if (health === 1) {
            probability = 0.8;
        }

        if (Math.random() < probability) {
            user[ShipName.BATTLESHIP].isUsingAbility = true;
            return;
        }

    }

    if (!user[ShipName.SUBMARINE].hasUsedAbility) {
        
        // Since its health is 1, the probability is constant
        if (Math.random() < 0.1) {
            user[ShipName.SUBMARINE].isUsingAbility = true;
            return;
        }

    }

    if (!user[ShipName.AIRCRAFT_CARRIER].hasUsedAbility) {
        
        // Randomly use this ability, as a function of the aircraft carrier health
        const health = user[ShipName.AIRCRAFT_CARRIER].health;

        // Base probability is 5%
        let probability = 0.05;

        // Probability increases as the aircraft carrier health decreases
        if (health === 6) {
            probability = 0.1;
        } else if (health === 5) {
            probability = 0.15;
        } else if (health === 4) {
            probability = 0.2;
        } else if (health === 3) {
            probability = 0.30;
        } else if (health === 2) {
            probability = 0.60;
        } else if (health === 1) {
            probability = 0.90;
        }

        if (Math.random() < probability) {
            user[ShipName.AIRCRAFT_CARRIER].isUsingAbility = true;
            return;
        }
    }

    // Getting here means that no ability was used
    return;
}

/**
 * It will try to return moves that are adjacent
 * to squares which still haven't been fully sunk.
 * Because all ships are longer than wider (except for the submarine,
 * which is equal in length and width), it is best to look for adjacent
 * squares in the direction of the longest straight line of hits.
 */
export function mostLikelyAdjacentSquare(user: User):  { row: number, col: number } {

    // Initialize the scores array
    const scores: number[][] = [];
    for (let row = 0; row < user.board.length; row++) {
        scores.push([]);
        for (let col = 0; col < user.board[0].length; col++) {
            scores[row].push(0);
        }
    }

    // Create a copy of the board, where we will remove the ships, as to not leak information
    let boardWithoutShips = JSON.parse(JSON.stringify(user.board)) as Tile[][];
    for (const row of boardWithoutShips) {
        for (const tile of row) {
            if (tile.shipHitbox) {
                tile.shipSprite = undefined;

                // Because we don't want to take into account sunk ships
                // we will change the contains successful shot to false and
                // make it a missed shot
                const shipName = tile.shipHitbox;
                if (user[shipName].health === 0) {
                    tile.contains.successfulShot = false;
                    tile.contains.missedShot = true;
                }

                // In any case, we will remove the ship hitbox
                tile.shipHitbox = undefined;
            }
        }
    }

    // Iterate over the board
    for (let row = 0; row < boardWithoutShips.length; row++) {
        for (let col = 0; col < boardWithoutShips[0].length; col++) {
            const tile = boardWithoutShips[row][col];
            if (isInvalidSquare(tile)) continue;

            // Top
            let scoreTop = 0;
            for (let i = row - 1; i >= 0; i--) {
                if (boardWithoutShips[i][col].contains.successfulShot) {
                    scoreTop++;
                } else {
                    break;
                }
            }

            // Bottom
            let scoreBottom = 0;
            for (let i = row + 1; i < boardWithoutShips.length; i++) {
                if (boardWithoutShips[i][col].contains.successfulShot) {
                    scoreBottom++;
                } else {
                    break;
                }
            }

            // Left
            let scoreLeft = 0;
            for (let i = col - 1; i >= 0; i--) {
                if (boardWithoutShips[row][i].contains.successfulShot) {
                    scoreLeft++;
                } else {
                    break;
                }
            }

            // Right
            let scoreRight = 0;
            for (let i = col + 1; i < boardWithoutShips[0].length; i++) {
                if (boardWithoutShips[row][i].contains.successfulShot) {
                    scoreRight++;
                } else {
                    break;
                }
            }

            // Update the scores
            scores[row][col] = Math.max(scoreTop, scoreBottom, scoreLeft, scoreRight);
        }
    }

    // Find the square with the highest score
    let maxScore = 0;
    let maxScoreRow = -1;
    let maxScoreCol = -1;
    for (let row = 0; row < scores.length; row++) {
        for (let col = 0; col < scores[0].length; col++) {
            if (scores[row][col] > maxScore) {
                maxScore = scores[row][col];
                maxScoreRow = row;
                maxScoreCol = col;
            }
        }
    }

    // If the max score is 0, then we will just make a random move
    if (maxScore === 0) {
        return makeRandomValidMove(user.board);
    }

    // Otherwise, we will make the move with the highest score
    return { row: maxScoreRow, col: maxScoreCol };
}

/**
 * We will compute a heat map of the board, where each square
 * is assigned a value based on the probability that it contains
 * a ship. Calculating this precisely takes too long, so we will
 * use the Monte Carlo method to estimate this probability.
 */
export function makeOptimalMove(user: User): { row: number, col: number } {
    const numberOfSimulations = 1000;
    const heatMap: number[][] = [];
    for (let row = 0; row < user.board.length; row++) {
        heatMap.push([]);
        for (let col = 0; col < user.board[0].length; col++) {
            heatMap[row].push(0);
        }
    }

    // List of ships that are not yet sunk
    const shipsNotYetSunk: ShipName[] = [];
    Object.values(ShipName).forEach((shipName) => {
        if (user[shipName].health > 0) {
            shipsNotYetSunk.push(shipName);
        }
    });

    // Order the ships by health, so that we can place the larger ships first
    shipsNotYetSunk.sort((a, b) => {
        const shipAHealth = SHIPS[a].length * SHIPS[a].width;
        const shipBHealth = SHIPS[b].length * SHIPS[b].width;
        return shipBHealth - shipAHealth;
    });

    // Define a board which will not contain any ships, as to not leak information
    let boardWithoutShips = JSON.parse(JSON.stringify(user.board)) as Tile[][];
    for (const row of boardWithoutShips) {
        for (const tile of row) {
            tile.shipHitbox = undefined;
            tile.shipSprite = undefined;
        }
    }


    // Run the simulations
    for (let i = 0; i < numberOfSimulations; i++) {
        const board = JSON.parse(JSON.stringify(boardWithoutShips)) as Tile[][];
        
        // For each simulation, we will attempt to place all the ships
        // from the ships that are not yet sunk

        randomlyPlaceShips(board, shipsNotYetSunk);

        // Now we update the heat map, based on the ships that were placed
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                const tile = board[row][col];
                if (tile.shipHitbox) {
                    heatMap[row][col]++;
                }
            }
        }
    }

    // Divide by the number of simulations to get the probability
    for (let row = 0; row < heatMap.length; row++) {
        for (let col = 0; col < heatMap[0].length; col++) {
            heatMap[row][col] /= numberOfSimulations;
        }
    }

    // Now we find the square with the highest probability
    let maxProbability = 0;
    let maxProbabilityRow = -1;
    let maxProbabilityCol = -1;
    for (let row = 0; row < heatMap.length; row++) {
        for (let col = 0; col < heatMap[0].length; col++) {
            if (heatMap[row][col] > maxProbability) {
                maxProbability = heatMap[row][col];
                maxProbabilityRow = row;
                maxProbabilityCol = col;
            }
        }
    }

    // If the max probability is 0, then we will just make a random move
    if (maxProbability === 0) {
        return makeRandomValidMove(user.board);
    }

    // Otherwise, we will make the move with the highest probability
    return { row: maxProbabilityRow, col: maxProbabilityCol };
}