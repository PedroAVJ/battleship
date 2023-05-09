<template>
  <div class="board-wrapper">
    <div v-for="(row, rowIndex) in store.computer.board" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <div :class="getBackground(col)" @click="Attack(rowIndex, colIndex)" @touchend="Attack(rowIndex, colIndex)">
          <Sprite :tile="removeShipFromTile(col)" :is-enemy-board="true" />
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
import { isGameOver, isInvalidSquare, uncoverShip, submarineAttack, normalAttack, battleshipAttack, makeRandomValidMove, sleep } from '@/utils/Game';

const store = useStore();

function getBackground(tile: Tile): string {
  if (tile.background.isWater) return 'water';
  if (tile.background.isLand) return 'land';
  if (tile.background.isOutOfBounds) return 'out-of-bounds';
  return '';
}

function removeShipFromTile(tile: Tile): Tile {
  const new_tile = { ...tile };
  new_tile.shipSprite = undefined;
  return new_tile;
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
  // await sleep(1000);

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
  // await sleep(1000);

  // For now, always try to use the abilities if it hasn't already
  if (!store.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, true);
  } else if (!store.computer[ShipName.BATTLESHIP].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.BATTLESHIP, true);
  } else if (!store.computer[ShipName.SUBMARINE].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.SUBMARINE, true);
  }

  // Waiting gives the player time to see the computer choose an ability
  // await sleep(1000);

  // For now, computer moves are random
  const move = makeRandomValidMove(store.player.board);
  if (store.computer[ShipName.SUBMARINE].isUsingAbility) {
    submarineAttack(store.player.board, move.row, move.col);
    uncoverShip(store.computer.board, ShipName.SUBMARINE);
    store.setComputerShipHasUsedAbility(ShipName.SUBMARINE, true);
    store.setComputerShipIsUsingAbility(ShipName.SUBMARINE, false);
  }
  else if (store.computer[ShipName.BATTLESHIP].isUsingAbility) {
    battleshipAttack(store.player.board, move.row, move.col);
    uncoverShip(store.computer.board, ShipName.BATTLESHIP);
    store.setComputerShipHasUsedAbility(ShipName.BATTLESHIP, true);
    store.setComputerShipIsUsingAbility(ShipName.BATTLESHIP, false);
  }
  else if (store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    while (store.computer[ShipName.AIRCRAFT_CARRIER].shots != 0) {
      const current_move = makeRandomValidMove(store.player.board);
      normalAttack(store.player.board, current_move.row, current_move.col);
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
    normalAttack(store.player.board, move.row, move.col);
  }

  store.recalculateShipsHealth();

  // Waiting gives the player time to see the result of the computer's move
  // await sleep(2000);

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