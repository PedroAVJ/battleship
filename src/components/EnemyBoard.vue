<template>
  <div class="board-wrapper">
    <div v-for="(row, rowIndex) in store.player.board.tiles" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <div :class="getBackground(col)" @click="Attack(rowIndex, colIndex)">
          <Sprite :tile="removeShipFromTile(col)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sprite from '@/components/Sprite.vue';
import Tile from '@/types/Tile';
import { useStore } from '@/store';
import ShipName from '@/types/ShipName';

const store = useStore();

function getBackground(tile: Tile): string {
  if (tile.background.isWater) return 'water';
  if (tile.background.isLand) return 'land';
  if (tile.background.isOutOfBounds) return 'out-of-bounds';
  return '';
}

function removeShipFromTile(tile: Tile): Tile {
  tile.shipSprite = undefined;
  return tile;
}

// Hacky way to wait inlined in a function
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Attack(row: number, col: number) {
  if (store.computer.hasCurrentTurn) return;
  if (store.computer.board.tiles[row][col].isInvalidSquare()) return;
  if (store.player.board.isGameOver() || store.computer.board.isGameOver()) return;
  
  // Prevent player from spamming moves
  if (store.player.isMakingMove) return;
  store.setPlayerIsMakingMove(true);

  if (store.player[ShipName.SUBMARINE].isUsingAbility) {
    store.computer.board.submarineAttack(row, col);
    store.player.board.uncoverShip(ShipName.SUBMARINE);
    store.setPlayerShipHasUsedAbility(ShipName.SUBMARINE, true);
    store.setPlayerShipIsUsingAbility(ShipName.SUBMARINE, false);
  }
  else if (store.player[ShipName.BATTLESHIP].isUsingAbility) {
    store.computer.board.battleshipAttack(row, col);
    store.player.board.uncoverShip(ShipName.BATTLESHIP);
    store.setPlayerShipHasUsedAbility(ShipName.BATTLESHIP, true);
    store.setPlayerShipIsUsingAbility(ShipName.BATTLESHIP, false);
  }
  else if (store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    store.player.board.normalAttack(row, col);
    store.setPlayerAircraftCarrierShots(store.player[ShipName.AIRCRAFT_CARRIER].shots - 1);

    // If it isn't the last shot, allow the player to make another move, while still using the ability and not changing turns
    if (store.player[ShipName.AIRCRAFT_CARRIER].shots != 0) {
      store.setPlayerIsMakingMove(false);
      return;
    }

    store.player.board.uncoverShip(ShipName.AIRCRAFT_CARRIER);
    store.setPlayerShipHasUsedAbility(ShipName.AIRCRAFT_CARRIER, true);
    store.setPlayerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, false);
  }
  else {
    store.computer.board.normalAttack(row, col);
  }

  store.recalculateShipsHealth();

  // This ensures that Vue's reactivity system updates the state of the board
  store.setComputerBoardTiles(store.computer.board.tiles);

  // Waiting gives the player time to see the result of their move
  await sleep(1000);

  // If the player won the game, prevent computer move from happening in the background
  if (store.computer.board.isGameOver()) return;

  store.setPlayerHasCurrentTurn(false);
  store.setComputerHasCurrentTurn(true);

  // For now, always try to use the abilities if it hasn't already
  if (!store.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, true);
  } else if (!store.computer[ShipName.BATTLESHIP].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.BATTLESHIP, true);
  } else if (!store.computer[ShipName.SUBMARINE].hasUsedAbility) {
    store.setComputerShipIsUsingAbility(ShipName.SUBMARINE, true);
  }

  // Waiting gives the player time to see the computer choose a move
  await sleep(1000);

  // For now, computer moves are random
  const move = store.player.board.makeRandomValidMove();
  if (store.computer[ShipName.SUBMARINE].isUsingAbility) {
    store.player.board.submarineAttack(move.row, move.col);
    store.computer.board.uncoverShip(ShipName.SUBMARINE);
    store.setComputerShipHasUsedAbility(ShipName.SUBMARINE, true);
    store.setComputerShipIsUsingAbility(ShipName.SUBMARINE, false);
  }
  else if (store.computer[ShipName.BATTLESHIP].isUsingAbility) {
    store.player.board.battleshipAttack(move.row, move.col);
    store.computer.board.uncoverShip(ShipName.BATTLESHIP);
    store.setComputerShipHasUsedAbility(ShipName.BATTLESHIP, true);
    store.setComputerShipIsUsingAbility(ShipName.BATTLESHIP, false);
  }
  else if (store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    while (store.computer[ShipName.AIRCRAFT_CARRIER].shots != 0) {
      const current_move = store.player.board.makeRandomValidMove();
      store.player.board.normalAttack(current_move.row, current_move.col);
      store.setComputerAircraftCarrierShots(store.computer[ShipName.AIRCRAFT_CARRIER].shots - 1);

      // If the computer won, return as to prevent the next move from happening in the background
      if (store.player.board.isGameOver()) return;

      // Waiting gives the player time to see the result of the computer's move
      await sleep(1000);

    }
    store.computer.board.uncoverShip(ShipName.AIRCRAFT_CARRIER);
    store.setComputerShipHasUsedAbility(ShipName.AIRCRAFT_CARRIER, true);
    store.setComputerShipIsUsingAbility(ShipName.AIRCRAFT_CARRIER, false);
  }
  else {
    store.player.board.normalAttack(move.row, move.col);
  }

  store.recalculateShipsHealth();

  // This ensures that Vue's reactive system updates the state of the board
  store.setPlayerBoardTiles(store.player.board.tiles);

  // Waiting gives the player time to see the result of the computer's move, except for the aircraft carrier ability, as it already waits
  if (!store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    await sleep(1000);
  }

  store.setComputerHasCurrentTurn(false);
  store.setPlayerHasCurrentTurn(true);

  // Allow the squares to be clicked again
  store.setPlayerIsMakingMove(false);
}
</script>

<style scoped>
.containerrr {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  margin: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}


h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.gui {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.board {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
}

.ship-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

.svg {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.start-game {
  background-color: #ff9800;
  border-radius: 4px;
  color: #e0e0e0;
  display: inline-block;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  font-size: large;
}

.start-game:hover {
  background-color: #f57c00;
}

.water.darken {
  background-color: #2c3e50;
}
</style>