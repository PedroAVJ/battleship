<template>
  <div :class="background" @click="Attack">
    <Sprite :tile="tile" :isPlayerSquare="false" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import Sprite from '@/components/Sprite.vue';
import { computed } from 'vue';
import Tile from '@/types/Tile';
import ShipName from '@/types/ShipName';


interface SquareProps {
  tile: Tile;
  row: number;
  col: number;
}

const props = defineProps<SquareProps>();
const store = useStore();

const background = computed(() => {
  if (props.tile.background.isWater) return 'water';
  if (props.tile.background.isLand) return 'land';
  if (props.tile.background.isOutOfBounds) return 'out-of-bounds';
});

// Hacky way to wait inlined in a function
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Attack() {
  if (store.computer.hasCurrentTurn) return;
  if (store.computer.board.tiles[props.row][props.col].isInvalidSquare()) return;
  if (store.player.hasLost() || store.computer.hasLost()) return;
  
  // Prevent player from spamming moves
  if (store.player.isMoveInProgress) return;
  store.setPlayerIsMoveInProgress(true);

  if (store.player.submarine.isUsingAbility) {
    store.computer.board.submarineAttack(props.row, props.col);
    store.player.board.uncoverShip(ShipName.SUBMARINE);
    store.setPlayerAircraftCarrierHasUsedAbility(true);
    store.setPlayerAircraftCarrierIsUsingAbility(false);
  }
  else if (store.player.battleship.isUsingAbility) {
    store.computer.board.battleshipAttack(props.row, props.col);
    store.player.board.uncoverShip(ShipName.BATTLESHIP);
    store.setPlayerBattleshipHasUsedAbility(true);
    store.setPlayerBattleshipIsUsingAbility(false);
  }
  else if (store.player.aircraftCarrier.isUsingAbility) {
    store.player.board.normalAttack(props.row, props.col);
    store.setPlayerAircraftCarrierShots(store.player.aircraftCarrier.shots - 1);

    // If it isn't the last shot, allow the player to make another move, while still using the ability and not changing turns
    if (store.player.aircraftCarrier.shots > 0) {
      store.setPlayerIsMoveInProgress(false);
      return;
    }

    store.player.board.uncoverShip(ShipName.AIRCRAFT_CARRIER);
    store.setPlayerSubmarineHasUsedAbility(true);
    store.setPlayerSubmarineIsUsingAbility(false);
  }
  else {
    store.computer.board.normalAttack(props.row, props.col);
  }

  store.substractComputerShipsHealth();

  // This ensures that Vue's reactivity system updates the state of the board
  store.setComputerBoardTiles(store.computer.board.tiles);

  // Waiting gives the player time to see the result of their move
  await sleep(1000);

  // If the player won the game, prevent computer move from happening in the background
  if (store.computer.hasLost()) return;

  store.setPlayerHasCurrentTurn(false);
  store.setComputerHasCurrentTurn(true);

  // For now, always try to use the abilities if it hasn't already
  if (!store.computer.aircraftCarrier.hasUsedAbility) {
    store.setComputerAircraftCarrierIsUsingAbility(true);
  } else if (!store.computer.battleship.hasUsedAbility) {
    store.setComputerBattleshipIsUsingAbility(true);
  } else if (!store.computer.submarine.hasUsedAbility) {
    store.setComputerSubmarineIsUsingAbility(true);
  }

  // Waiting gives the player time to see the computer choose a move
  await sleep(1000);

  // For now, computer moves are random
  const move = store.player.board.makeRandomValidMove();
  if (store.computer.submarine.isUsingAbility) {
    store.player.board.submarineAttack(move.row, move.col);
    store.computer.board.uncoverShip(ShipName.SUBMARINE);
    store.setComputerSubmarineHasUsedAbility(true);
    store.setComputerSubmarineIsUsingAbility(false);
  }
  else if (store.computer.battleship.isUsingAbility) {
    store.player.board.battleshipAttack(move.row, move.col);
    store.computer.board.uncoverShip(ShipName.BATTLESHIP);
    store.setComputerBattleshipHasUsedAbility(true);
    store.setComputerBattleshipIsUsingAbility(false);
  }
  else if (store.computer.aircraftCarrier.isUsingAbility) {
    while (store.computer.aircraftCarrier.shots != 0) {
      const current_move = store.player.board.makeRandomValidMove();
      store.player.board.normalAttack(current_move.row, current_move.col);
      store.setComputerAircraftCarrierShots(store.computer.aircraftCarrier.shots - 1);

      // If the computer won, return as to prevent the next move from happening in the background
      if (store.player.hasLost()) return;

      // Waiting gives the player time to see the result of the computer's move
      await sleep(1000);

    }
    store.computer.board.uncoverShip(ShipName.AIRCRAFT_CARRIER);
    store.setComputerAircraftCarrierHasUsedAbility(true);
    store.setComputerAircraftCarrierIsUsingAbility(false);
  }
  else {
    store.player.board.normalAttack(move.row, move.col);
  }

  store.substractPlayerShipsHealth();

  // This ensures that Vue's reactive system updates the state of the board
  store.setPlayerBoardTiles(store.player.board.tiles);

  // Waiting gives the player time to see the result of the computer's move, except for the aircraft carrier ability, as it already waits
  if (!store.computer.aircraftCarrier.isUsingAbility) {
    await sleep(1000);
  }

  store.setComputerHasCurrentTurn(false);
  store.setPlayerHasCurrentTurn(true);

  // Allow the squares to be clicked again
  store.setPlayerIsMoveInProgress(false);
}
</script>

<style scoped>
.water {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #4a6a85;
}

.land {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #2ecc71;
}

.out-of-bounds {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #3c6e8f;
}

/** When the water style gets hovered over, change the background color */
.water:hover {
  background-color: #2c3e50;
}
</style>
