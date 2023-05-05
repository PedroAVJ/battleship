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
  if (store.player.isMoveInProgress) return;
  const computer_board = store.computer.board
  const player_board = store.player.board
  if (computer_board[props.row][props.col].isInvalidSquare()) return;

  // Prevent player from spamming squares
  store.setPlayerIsMoveInProgress(true);

  // Player submarine ability
  if (store.player.submarine.isUsingAbility) {

    // Iterate over a 3x3 area around the square
    store.computer.submarineAttack(props.row, props.col);

    // Uncover the submarine
    store.player.uncoverShip(ShipName.SUBMARINE);

  }

  // Player battleship ability
  else if (store.player.battleship.isUsingAbility) {

    // Iterate over a 3x3 square around the battleship
    store.computer.battleshipAttack(props.row, props.col);

    // Uncover the battleship
    store.player.uncoverShip(ShipName.BATTLESHIP);

  }

  // Player aircraft carrier ability
  else if (store.player.aircraftCarrier.isUsingAbility) {
    const tile = computer_board[props.row][props.col];

    // Hit the square
    const new_tile = JSON.parse(JSON.stringify(tile));
    if (new_tile.ship !== undefined) {
      new_tile.contains.successfulShot = true;

      // If the ship is an aircraft carrier, subtract 1 from its health
      if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
        store.setComputerAircraftCarrierHealth(store.computer.aircraftCarrier.health - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.setComputerBattleshipHealth(store.computer.battleship.health - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.setComputerBattleshipHasUsedAbility(true);
      }

    }
    else {
      new_tile.contains.missedShot = true;
    }

    // Reflect the state of the square
    store.commit(Mutation.SET_COMPUTER_TILE, {
      row: props.row,
      col: props.col,
      tile: new_tile
    });

    // Substract 1 from the aircraft carrier's shots
    store.setPlayerAircraftCarrierShots(store.player.aircraftCarrier.shots - 1);

    // Check if the player won
    let player_won = true;
    for (let row = 0; row < computer_board.length; row++) {
      for (let col = 0; col < computer_board[row].length; col++) {
        if (computer_board[row][col].ship !== undefined && !computer_board[row][col].contains.successfulShot) {
          player_won = false;
          break
        }
      }
    }

    // If so, change the state of the game
    if (player_won) {
      return;
    }

    // If it isn't the last shot, return
    if (store.player.aircraftCarrier.shots > 0) {
      store.setPlayerIsMoveInProgress(false);
      return;
    }

    // Uncover the aircraft carrier
    store.player.uncoverShip(ShipName.AIRCRAFT_CARRIER);

  }

  // Player normal move
  else {
    const tile = computer_board[props.row][props.col];

    // Hit the square
    const new_tile = JSON.parse(JSON.stringify(tile));
    if (new_tile.ship !== undefined) {
      new_tile.contains.successfulShot = true;

      // If the ship is an aircraft carrier, subtract 1 from its health
      if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
        store.setComputerAircraftCarrierHealth(store.computer.aircraftCarrier.health - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.setComputerBattleshipHealth(store.computer.battleship.health - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.setComputerSubmarineHasUsedAbility(true);
      }

    }
    else {
      new_tile.contains.missedShot = true;
    }

    // Reflect the state of the square
    store.commit(Mutation.SET_COMPUTER_TILE, {
      row: props.row,
      col: props.col,
      tile: new_tile
    });

  }

  // This ensures that Vue's reactivity system updates the state of the board
  store.setComputerBoard(store.computer.board);

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // Make sure the abilities are consumed after being used
  if (store.player.aircraftCarrier.isUsingAbility) {
    store.setPlayerAircraftCarrierHasUsedAbility(true);
    store.setPlayerAircraftCarrierIsUsingAbility(false);
  } else if (store.player.battleship.isUsingAbility) {
    store.setPlayerBattleshipHasUsedAbility(true);
    store.setPlayerBattleshipIsUsingAbility(false);
  } else if (store.player.submarine.isUsingAbility) {
    store.setPlayerSubmarineHasUsedAbility(true);
    store.setPlayerSubmarineIsUsingAbility(false);
  }

  // Check if either the battleship or the aircraft carrier were sunk
  if (store.computer.aircraftCarrier.health === 0) {
    store.setComputerAircraftCarrierHasUsedAbility(true);
  } else if (store.computer.battleship.health === 0) {
    store.setComputerBattleshipHasUsedAbility(true);
  }

  // If the player won the game, return
  if (store.computer.hasLost()) return;

  // Since the players move is over, change the turn
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

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // Computer submarine ability
  if (store.computer.submarine.isUsingAbility) {
    const move = store.player.makeRandomValidMove();

    // Iterate over a 3x3 area around the square
    store.player.submarineAttack(move.row, move.col);

    // Uncover the submarine
    store.computer.uncoverShip(ShipName.SUBMARINE);

  }

  // Computer battleship ability
  else if (store.computer.battleship.isUsingAbility) {
    const move = store.player.makeRandomValidMove();

    // Iterate over a 3x3 area around the square
    store.player.battleshipAttack(move.row, move.col);

    // Uncover the battleship
    store.computer.uncoverShip(ShipName.BATTLESHIP);

  }

  // Computer aircraft carrier ability
  else if (store.computer.aircraftCarrier.isUsingAbility) {

    // For each of the computer aircraft carrier's shots
    while (store.computer.aircraftCarrier.shots != 0) {
      const move = store.player.makeRandomValidMove();

      // If the square already contains a missed shot, or a successful shot, skip it
      const tile = player_board[move.row][move.col];
      if (tile.contains.missedShot) continue;
      if (tile.contains.successfulShot) continue;

      const new_tile = JSON.parse(JSON.stringify(tile));
      // If the square contains a ship, hit it
      if (tile.ship !== undefined) {
        new_tile.contains.successfulShot = true;
        store.commit(Mutation.SET_PLAYER_TILE, {
          row: move.row,
          col: move.col,
          tile: new_tile
        });

        // If the ship is an aircraft carrier, subtract 1 from its health
        if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
          store.setPlayerAircraftCarrierHealth(store.player.aircraftCarrier.health - 1);
        }

        // If the ship is a battleship, subtract 1 from its health
        else if (tile.ship?.name === ShipName.BATTLESHIP) {
          store.setPlayerBattleshipHealth(store.player.battleship.health - 1);
        }

        // If the ship is a submarine, sink it, as it only has 1 health
        else if (tile.ship?.name === ShipName.SUBMARINE) {
          store.setPlayerSubmarineHasUsedAbility(true);
        }

      }

      // Otherwise, mark it as a missed shot
      else {
        new_tile.contains.missedShot = true;
        store.commit(Mutation.SET_PLAYER_TILE, {
          row: move.row,
          col: move.col,
          tile: new_tile
        });
      }

      // Decrement the number of shots
      store.setComputerAircraftCarrierShots(store.computer.aircraftCarrier.shots - 1);

      // Check if the computer won
      let computer_won = true;
      for (let row = 0; row < player_board.length; row++) {
        for (let col = 0; col < player_board[row].length; col++) {
          if (player_board[row][col].ship !== undefined && !player_board[row][col].contains.successfulShot) {
            computer_won = false;
            break
          }
        }
      }

      // If so, change the state of the game
      if (computer_won) {
        return;
      }

    }

    // Uncover the aircraft carrier
    store.computer.uncoverShip(ShipName.AIRCRAFT_CARRIER);

  }

  // Computer normal move
  else {
    const move = store.player.makeRandomValidMove();
    const tile = player_board[move.row][move.col];

    // Hit the square
    const new_tile = JSON.parse(JSON.stringify(tile));
    if (new_tile.ship !== undefined) {
      new_tile.contains.successfulShot = true;

      // If the ship is an aircraft carrier, subtract 1 from its health
      if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
        store.setPlayerAircraftCarrierHealth(store.player.aircraftCarrier.health - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.setPlayerBattleshipHealth(store.player.battleship.health - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.setPlayerSubmarineHasUsedAbility(true);
      }

    }
    else {
      new_tile.contains.missedShot = true;
    }

    // Reflect the state of the square
    store.commit(Mutation.SET_PLAYER_TILE, {
      row: move.row,
      col: move.col,
      tile: new_tile
    });
  }

  // This ensures that Vue's reactive system updates the state of the board
  store.setPlayerBoard(store.player.board);

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // Make sure the abilities are consumed after being used
  if (store.computer.aircraftCarrier.isUsingAbility) {
    store.setComputerAircraftCarrierHasUsedAbility(true);
    store.setComputerAircraftCarrierIsUsingAbility(false);
  } else if (store.computer.battleship.isUsingAbility) {
    store.setComputerBattleshipHasUsedAbility(true);
    store.setComputerBattleshipIsUsingAbility(false);
  } else if (store.computer.submarine.isUsingAbility) {
    store.setComputerSubmarineHasUsedAbility(true);
    store.setComputerSubmarineIsUsingAbility(false);
  }

  // Check if either the battleship or the aircraft carrier were sunk
  if (store.player.aircraftCarrier.health === 0) {
    store.setPlayerAircraftCarrierHasUsedAbility(true);
  } else if (store.player.battleship.health === 0) {
    store.setPlayerBattleshipHasUsedAbility(true);
  }

  // If the computer won the game, return
  if (store.player.hasLost()) return;

  // Since the computer's move is over, change the turn
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
