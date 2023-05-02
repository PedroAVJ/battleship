import { Orientation, ShipName, Mutation } from "@/store/enums";
import { SHIP_DIMENSIONS } from "@/store/constants";
import { Tile, RootState } from "@/store/interfaces";
import { Store } from "vuex";


/**
 * Returns the hitboxes of a ship given its name, orientation, and top left corner coordinates.
 */
export function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation, row: number, col: number): { row: number, col: number }[] {
  const length = SHIP_DIMENSIONS[shipName].length;
  const width = SHIP_DIMENSIONS[shipName].width;
  const shipHitboxes: { row: number, col: number }[] = [];

  // The coordinates marked by row and col are the top left corner of the ship
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < width; j++) {

      // If the ship is horizontal, i represents the column and j represents the row
      // This is because the length moves horizontally and the width moves vertically
      // X X X X X
      // X X X X X
      if (shipOrientation === Orientation.HORIZONTAL) {
        shipHitboxes.push({
          row: row + j,
          col: col + i,
        });
      }

      // If the ship is vertical, i represents the row and j represents the column
      // This is because the length moves vertically and the width moves horizontally
      // X X
      // X X
      // X X
      // X X
      if (shipOrientation === Orientation.VERTICAL) {
        shipHitboxes.push({
          row: row + i,
          col: col + j,
        });
      }
    }
  }

  return shipHitboxes;
}

/**
 * Checks if a square is invalid. The board is only read, not modified.
 */
export function isInvalidSquare(row: number, col: number, board: Tile[][]): boolean {

  // Make sure the coordinates are inside the board
  if (row < 0 || row >= board.length) return true;
  if (col < 0 || col >= board[0].length) return true;

  const tile = board[row][col];

  if (tile.background.isLand) return true;
  if (tile.background.isOutOfBounds) return true;
  if (tile.contains.missedShot) return true;
  if (tile.contains.successfulShot) return true;

  return false;
}

/**
 * Returns true if the ship placement is invalid, false otherwise.
 * The board is only read, not modified.
 */
export function isInvalidShipPlacement(shipName: ShipName, shipOrientation: Orientation, row: number, col: number, board: Tile[][]): boolean {
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation, row, col);

  for (const hitbox of shipHitboxes) {
    if (isInvalidSquare(hitbox.row, hitbox.col, board)) return true;

    // Ship hitbox check
    if (board[hitbox.row][hitbox.col].ship) return true;

  }

  return false;
}

/**
 * Handles the placement of hitboxes on the board, the orientation of the ship,
 * and the mutation of the store.
 */
export function placeShip(store: Store<RootState>, shipName: ShipName, shipOrientation: Orientation, row: number, col: number, user: 'player' | 'computer'): void {
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation, row, col);
  const board = store.state.player.board;

  for (const hitbox of shipHitboxes) {
    const tile: Tile = {
      ...board[hitbox.row][hitbox.col],
      ship: {
        name: shipName,
      },
    };

    // If this is the first tile, set the ship orientation
    // This is because the ship orientation defines were we start drawing the ship sprite
    if (hitbox.row === row && hitbox.col === col && tile.ship) {
      tile.ship.orientation = shipOrientation;
    }

    if (user === 'player') {
      store.commit(Mutation.SET_PLAYER_TILE, {
        row: hitbox.row,
        col: hitbox.col,
        tile: tile,
      });
    } else if (user === 'computer') {
      store.commit(Mutation.SET_COMPUTER_TILE, {
        row: hitbox.row,
        col: hitbox.col,
        tile: tile,
      });
    }
  }
}

/**
 * Returns a random row and column that is a valid square on the board.
 */
export function makeRandomValidMove(board: Tile[][]): { row: number, col: number } {
  while (true) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[row].length);

    // If the square is invalid, try again
    if (isInvalidSquare(row, col, board)) continue;
    return { row, col };

  }
}