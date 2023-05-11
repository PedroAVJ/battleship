<template>
  <div class="board-wrapper">
    <div v-for="(row, rowIndex) in store.computer.board" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <div :class="getBackground(col)" @click="Attack(rowIndex, colIndex)" @touchend="Attack(rowIndex, colIndex)">
          <Sprite :tile="col" :isEnemyBoard="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sprite from '@/components/Sprite.vue';
import { useStore } from '@/store';
import { ShipName } from '@/utils/Enums';
import { Tile } from '@/utils/Interfaces';
import { isGameOver, isInvalidSquare, uncoverShip, submarineAttack, normalAttack, battleshipAttack, makeRandomValidMove, sleep, useAbility, mostLikelyAdjacentSquare, makeOptimalMove } from '@/utils/Game';

const store = useStore();

function getBackground(tile: Tile): string {
  if (tile.background.isWater) return 'water';
  if (tile.background.isLand) return 'land';
  if (tile.background.isOutOfBounds) return 'out-of-bounds';
  return '';
}

async function Attack(row: number, col: number) {
  if (isInvalidSquare(store.computer.board[row][col])) return;
  if (isGameOver(store.player.board) || isGameOver(store.computer.board)) return;

  // Prevent player from spamming moves
  if (store.player.isMakingMove) return;
  store.setPlayerIsMakingMove(true);

  if (store.player[ShipName.SUBMARINE].isUsingAbility) {
    submarineAttack(store.computer.board, row, col);
    uncoverShip(store.player.board, ShipName.SUBMARINE);
    store.setPlayerShipHasUsedAbility(ShipName.SUBMARINE, true);
    store.setPlayerShipIsUsingAbility(ShipName.SUBMARINE, false);
  }
  else if (store.player[ShipName.BATTLESHIP].isUsingAbility) {
    battleshipAttack(store.computer.board, row, col);
    uncoverShip(store.player.board, ShipName.BATTLESHIP);
    store.setPlayerShipHasUsedAbility(ShipName.BATTLESHIP, true);
    store.setPlayerShipIsUsingAbility(ShipName.BATTLESHIP, false);
  }
  else if (store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    normalAttack(store.computer.board, row, col);
    store.setPlayerAircraftCarrierShots(store.player[ShipName.AIRCRAFT_CARRIER].shots - 1);

    // If it isn't the last shot, allow the player to make another move, while still using the ability and not changing turns
    if (store.player[ShipName.AIRCRAFT_CARRIER].shots != 0) {
      store.setPlayerIsMakingMove(false);

      // This call also triggers a computed property that shows the ship if it has been sunk
      store.recalculateShipsHealth();

      // This triggers the watcher that shows the modal, in case a user won
      store.setPlayerBoard(store.player.board);
      store.setComputerBoard(store.computer.board);
      return;
    }

    uncoverShip(store.player.board, ShipName.AIRCRAFT_CARRIER);
    store.setPlayerShipHasUsedAbility(ShipName.AIRCRAFT_CARRIER, true);
    store.setPlayerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, false);
  }
  else {
    normalAttack(store.computer.board, row, col);
  }

  store.recalculateShipsHealth();

  // Waiting gives the player time to see the result of their move
  await sleep(1000);

  // If the player won the game, prevent computer move from happening in the background
  if (isGameOver(store.computer.board)) {

    // This triggers the watcher that shows the modal, in case a user won
    store.setPlayerBoard(store.player.board);
    store.setComputerBoard(store.computer.board);
    return;
  }

  store.setPlayerHasCurrentTurn(false);
  store.setComputerHasCurrentTurn(true);

  // Waiting gives the player time to see the board change turns
  await sleep(1000);

  // Let the AI decide if it should use an ability
  useAbility(store.computer);

  // If there is an uncovered ship, save it, as this will take priority over the optimal move
  let uncoveredSquare = { row: -1, col: -1 };

  // Likewise, if there is a square were we know a ship that is not sunk is, save it
  let huntMode = false;

  // Find both of these values
  for (let row = 0; row < store.player.board.length; row++) {
    for (let col = 0; col < store.player.board[row].length; col++) {
      const tile = store.player.board[row][col];
      if (tile.contains.uncoveredShip) {
        uncoveredSquare = {
          row: row,
          col: col
        };
      }

      if (tile.contains.successfulShot || tile.contains.uncoveredShip) {
        if (!tile.shipHitbox) continue;

        // Make sure the ship is not sunk
        const health = store.player[tile.shipHitbox].health;
        if (health === 0) continue;

        huntMode = true;
      }
    }
  }

  // Waiting gives the player time to see the computer choose an ability
  await sleep(1000);

  // Let the AI make a move, given the ability it chose
  if (store.computer[ShipName.SUBMARINE].isUsingAbility) {

    // If there is an uncovered ship, attack it
    if (uncoveredSquare.row !== -1 && uncoveredSquare.col !== -1) {
      submarineAttack(store.player.board, uncoveredSquare.row, uncoveredSquare.col);
    }

    // If hunt mode is active, attack the most likely adjacent square
    else if (huntMode) {
      const move = mostLikelyAdjacentSquare(store.player);
      submarineAttack(store.player.board, move.row, move.col);
    }

    // Otherwise, make an optimal move
    else {
      const move = makeOptimalMove(store.player);
      submarineAttack(store.player.board, move.row, move.col);
    }

    uncoverShip(store.computer.board, ShipName.SUBMARINE);
    store.setComputerShipHasUsedAbility(ShipName.SUBMARINE, true);
    store.setComputerShipIsUsingAbility(ShipName.SUBMARINE, false);
  }
  else if (store.computer[ShipName.BATTLESHIP].isUsingAbility) {

    // If there is an uncovered ship, attack it
    if (uncoveredSquare.row !== -1 && uncoveredSquare.col !== -1) {
      battleshipAttack(store.player.board, uncoveredSquare.row, uncoveredSquare.col);
    }

    // If hunt mode is active, attack the most likely adjacent square
    else if (huntMode) {
      const move = mostLikelyAdjacentSquare(store.player);
      battleshipAttack(store.player.board, move.row, move.col);
    }

    // Otherwise, make an optimal move
    else {
      const move = makeOptimalMove(store.player);
      battleshipAttack(store.player.board, move.row, move.col);
    }

    uncoverShip(store.computer.board, ShipName.BATTLESHIP);
    store.setComputerShipHasUsedAbility(ShipName.BATTLESHIP, true);
    store.setComputerShipIsUsingAbility(ShipName.BATTLESHIP, false);
  }
  else if (store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    while (store.computer[ShipName.AIRCRAFT_CARRIER].shots != 0) {
      
      // If there is an uncovered ship, attack it
      if (uncoveredSquare.row !== -1 && uncoveredSquare.col !== -1) {
        normalAttack(store.player.board, uncoveredSquare.row, uncoveredSquare.col);
      }

      // If hunt mode is active, attack the most likely adjacent square
      else if (huntMode) {
        const move = mostLikelyAdjacentSquare(store.player);
        normalAttack(store.player.board, move.row, move.col);
      }

      // Otherwise, make an optimal move
      else {
        const move = makeOptimalMove(store.player);
        normalAttack(store.player.board, move.row, move.col);
      }

      store.setComputerAircraftCarrierShots(store.computer[ShipName.AIRCRAFT_CARRIER].shots - 1);

      // If the computer won, return as to prevent the next move from happening in the background
      if (isGameOver(store.player.board)) {

        // This triggers the watcher that shows the modal, in case a user won
        store.setPlayerBoard(store.player.board);
        store.setComputerBoard(store.computer.board);
        return;
      }

      // Waiting gives the player time to see the result of the aircraft carrier attack
      if (store.computer[ShipName.AIRCRAFT_CARRIER].shots !== 0) await sleep(1000);

    }
    uncoverShip(store.computer.board, ShipName.AIRCRAFT_CARRIER);
    store.setComputerShipHasUsedAbility(ShipName.AIRCRAFT_CARRIER, true);
    store.setComputerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, false);
  }
  else {
    const move = makeOptimalMove(store.player);
    normalAttack(store.player.board, move.row, move.col);
  }

  store.recalculateShipsHealth();

  // Waiting gives the player time to see the result of the computer's move
  await sleep(2000);

  store.setComputerHasCurrentTurn(false);
  store.setPlayerHasCurrentTurn(true);

  // Allow the squares to be clicked again
  store.setPlayerIsMakingMove(false);
}
</script>

<style scoped>
.water:hover {
  background-color: #2c3e50;
}
</style>