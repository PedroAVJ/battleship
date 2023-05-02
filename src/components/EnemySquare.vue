<template>
  <div :class="background" @click="Attack">
    <Sprite :tile="tile" :isPlayerSquare="false" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Mutation } from '@/store/enums';
import { Tile } from '@/store/interfaces';
import { useStore } from '@/store';
import Sprite from '@/components/Sprite.vue';
import { computed } from 'vue';
import { isInvalidSquare, makeRandomValidMove } from '@/utils/shipUtils';


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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Attack() {
  if (store.state.computer.hasCurrentTurn) return;
  const computer_board = store.state.computer.board
  const player_board = store.state.player.board
  if (isInvalidSquare(props.row, props.col, computer_board)) return;

  // Player submarine ability
  if (store.state.player.isUsingSubmarineAbility) {

    // Iterate over a 3x3 area around the square
    for (let row = props.row - 1; row <= props.row + 1; row++) {
      for (let col = props.col - 1; col <= props.col + 1; col++) {

        // Make sure the square is valid
        if (isInvalidSquare(row, col, computer_board)) continue;

        // If the square contains a ship, uncover it
        const tile = computer_board[row][col];
        if (tile.ship !== undefined) {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

        // Otherwise, mark it as a missed shot
        else {
          
          // Except if it already contains a missed shot, successful shot, or uncovered ship
          if (tile.contains.missedShot) continue;
          if (tile.contains.successfulShot) continue;
          if (tile.contains.uncoveredShip) continue;

          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.missedShot = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

      }
    }

    // Uncover the submarine
    for (let row = 0; row < player_board.length; row++) {
      for (let col = 0; col < player_board[row].length; col++) {
        if (player_board[row][col].ship?.name === ShipName.SUBMARINE) {
          const new_tile = JSON.parse(JSON.stringify(player_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // Reflect the state of the abilities used
    store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
    store.commit(Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false);
  
  }

  // Player battleship ability
  else if (store.state.player.isUsingBattleshipAbility) {

    // Iterate over a 3x3 square around the battleship
    for (let row = props.row - 1; row <= props.row + 1; row++) {
      for (let col = props.col - 1; col <= props.col + 1; col++) {

        // Make sure the square is valid
        if (isInvalidSquare(row, col, computer_board)) continue;

        // If the square contains a ship, hit it
        const tile = computer_board[row][col];
        if (tile.ship !== undefined) {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.successfulShot = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });

          // If the ship is an aircraft carrier, subtract 1 from its health
          if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
            store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, store.state.computer.aircraftCarrierHealth - 1);
          }

          // If the ship is a battleship, subtract 1 from its health
          else if (tile.ship?.name === ShipName.BATTLESHIP) {
            store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, store.state.computer.battleshipHealth - 1);
          }

          // If the ship is a submarine, sink it, as it only has 1 health
          else if (tile.ship?.name === ShipName.SUBMARINE) {
            store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, true);
          }

        }

        // Otherwise, mark it as a missed shot
        else {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.missedShot = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

      }
    }

    // Uncover the battleship
    for (let row = 0; row < player_board.length; row++) {
      for (let col = 0; col < player_board[row].length; col++) {
        if (player_board[row][col].ship?.name === ShipName.BATTLESHIP) {
          const new_tile = JSON.parse(JSON.stringify(player_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // Reflect the state of the abilities used
    store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, true);
    store.commit(Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY, false);
  }

  // Player aircraft carrier ability
  else if (store.state.player.isUsingAircraftCarrierAbility) {
    const tile = computer_board[props.row][props.col];

    // Hit the square
    const new_tile = JSON.parse(JSON.stringify(tile));
    if (new_tile.ship !== undefined) {
      new_tile.contains.successfulShot = true;

      // If the ship is an aircraft carrier, subtract 1 from its health
      if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
        store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, store.state.computer.aircraftCarrierHealth - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, store.state.computer.battleshipHealth - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, true);
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
    store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_SHOTS, store.state.player.aircraftCarrierShots - 1);

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
      store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
      store.commit(Mutation.SET_PLAYER_HAS_WON_THE_GAME, true);
      return;
    }

    // If it isn't the last shot, return
    if (store.state.player.aircraftCarrierShots > 0) return;

    // Uncover the aircraft carrier
    for (let row = 0; row < player_board.length; row++) {
      for (let col = 0; col < player_board[row].length; col++) {
        if (player_board[row][col].ship?.name === ShipName.AIRCRAFT_CARRIER) {
          const new_tile = JSON.parse(JSON.stringify(player_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // If it is the last shot, change the state of the abilities
    store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
    store.commit(Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false);
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
        store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, store.state.computer.aircraftCarrierHealth - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, store.state.computer.battleshipHealth - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, true);
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

  // Check if either the battleship or the aircraft carrier were sunk
  if (store.state.computer.aircraftCarrierHealth === 0) {
    store.commit(Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
  } else if (store.state.computer.battleshipHealth === 0) {
    store.commit(Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY, true);
  }

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
    store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
    store.commit(Mutation.SET_PLAYER_HAS_WON_THE_GAME, true);
    return;
  }

  // Since the players move is over, change the turn
  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, false);
  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, true);

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // For now, always try to use the abilities if it hasn't already
  if (!store.state.computer.hasUsedAircraftCarrierAbility) {
    store.commit(Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY, true);
  } else if (!store.state.computer.hasUsedBattleshipAbility) {
    store.commit(Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY, true);
  } else if (!store.state.computer.hasUsedSubmarineAbility) {
    store.commit(Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY, true);
  }

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // Computer submarine ability
  if (store.state.computer.isUsingSubmarineAbility) {
    const move = makeRandomValidMove(player_board);

    // Iterate over a 3x3 area around the square
    for (let row = move.row - 1; row <= move.row + 1; row++) {
      for (let col = move.col - 1; col <= move.col + 1; col++) {

        // Make sure the square is valid
        if (isInvalidSquare(row, col, player_board)) continue;

        // If the square contains a ship, uncover it
        const tile = player_board[row][col];
        if (tile.ship !== undefined) {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

        // Otherwise, mark it as a missed shot
        else {
          
          // Except if it already contains a missed shot, successful shot, or uncovered ship
          if (tile.contains.missedShot) continue;
          if (tile.contains.successfulShot) continue;
          if (tile.contains.uncoveredShip) continue;

          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.missedShot = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

      }
    }

    // Uncover the submarine
    for (let row = 0; row < computer_board.length; row++) {
      for (let col = 0; col < computer_board[row].length; col++) {
        if (computer_board[row][col].ship?.name === ShipName.SUBMARINE) {
          const new_tile = JSON.parse(JSON.stringify(computer_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // Reflect the state of the abilities used
    store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, true);
    store.commit(Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY, false);
  
  }

  // Computer battleship ability
  else if (store.state.computer.isUsingBattleshipAbility) {
    const move = makeRandomValidMove(player_board);

    // Iterate over a 3x3 area around the square
    for (let row = move.row - 1; row <= move.row + 1; row++) {
      for (let col = move.col - 1; col <= move.col + 1; col++) {

        // Make sure the square is valid
        if (isInvalidSquare(row, col, player_board)) continue;

        // If it already contains a missed shot, or a successful shot, skip it
        const tile = player_board[row][col];
        if (tile.contains.missedShot) continue;
        if (tile.contains.successfulShot) continue;

        // If the square contains a ship, hit it
        if (tile.ship !== undefined) {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.successfulShot = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });

          // If the ship is an aircraft carrier, subtract 1 from its health
          if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
            store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, store.state.player.aircraftCarrierHealth - 1);
          }

          // If the ship is a battleship, subtract 1 from its health
          else if (tile.ship?.name === ShipName.BATTLESHIP) {
            store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, store.state.player.battleshipHealth - 1);
          }

          // If the ship is a submarine, sink it, as it only has 1 health
          else if (tile.ship?.name === ShipName.SUBMARINE) {
            store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
          }

        } else {
          const new_tile = JSON.parse(JSON.stringify(tile));
          new_tile.contains.missedShot = true;
          store.commit(Mutation.SET_PLAYER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }

      }
    }

    // Uncover the battleship
    for (let row = 0; row < computer_board.length; row++) {
      for (let col = 0; col < computer_board[row].length; col++) {
        if (computer_board[row][col].ship?.name === ShipName.BATTLESHIP) {
          const new_tile = JSON.parse(JSON.stringify(computer_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // Reflect the state of the abilities used
    store.commit(Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY, true);
    store.commit(Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY, false);
  }

  // Computer aircraft carrier ability
  else if (store.state.computer.isUsingAircraftCarrierAbility) {
    
    // For each of the computer aircraft carrier's shots
    while (store.state.computer.aircraftCarrierShots != 0) {
      const move = makeRandomValidMove(player_board);

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
          store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, store.state.player.aircraftCarrierHealth - 1);
        }

        // If the ship is a battleship, subtract 1 from its health
        else if (tile.ship?.name === ShipName.BATTLESHIP) {
          store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, store.state.player.battleshipHealth - 1);
        }

        // If the ship is a submarine, sink it, as it only has 1 health
        else if (tile.ship?.name === ShipName.SUBMARINE) {
          store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
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
      store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_SHOTS, store.state.computer.aircraftCarrierShots - 1);

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
        store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
        store.commit(Mutation.SET_COMPUTER_HAS_WON_THE_GAME, true);
        return;
      }

    }

    // Uncover the aircraft carrier
    for (let row = 0; row < computer_board.length; row++) {
      for (let col = 0; col < computer_board[row].length; col++) {
        if (computer_board[row][col].ship?.name === ShipName.AIRCRAFT_CARRIER) {
          const new_tile = JSON.parse(JSON.stringify(computer_board[row][col]));
          new_tile.contains.uncoveredShip = true;
          store.commit(Mutation.SET_COMPUTER_TILE, {
            row: row,
            col: col,
            tile: new_tile
          });
        }
      }
    }

    // If it is the last shot, change the state of the abilities
    store.commit(Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
    store.commit(Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false);
  }

  // Computer normal move
  else {
    const move = makeRandomValidMove(player_board);
    const tile = player_board[move.row][move.col];

    // Hit the square
    const new_tile = JSON.parse(JSON.stringify(tile));
    if (new_tile.ship !== undefined) {
      new_tile.contains.successfulShot = true;

      // If the ship is an aircraft carrier, subtract 1 from its health
      if (tile.ship?.name === ShipName.AIRCRAFT_CARRIER) {
        store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, store.state.player.aircraftCarrierHealth - 1);
      }

      // If the ship is a battleship, subtract 1 from its health
      else if (tile.ship?.name === ShipName.BATTLESHIP) {
        store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, store.state.player.battleshipHealth - 1);
      }

      // If the ship is a submarine, sink it, as it only has 1 health
      else if (tile.ship?.name === ShipName.SUBMARINE) {
        store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
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

  // Wait for 1 second (1000 milliseconds)
  await sleep(1000);

  // Check if either the battleship or the aircraft carrier were sunk
  if (store.state.player.aircraftCarrierHealth === 0) {
    store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
  } else if (store.state.player.battleshipHealth === 0) {
    store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, true);
  }

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
    store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
    store.commit(Mutation.SET_COMPUTER_HAS_WON_THE_GAME, true);
    return;
  }

  // Since the computer's move is over, change the turn
  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, false);
  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, true);

}
</script>

<style scoped>
.water {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #34495e;
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
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #ffffff;
}

/** When the water style gets hovered over, change the background color */
.water:hover {
  background-color: #2c3e50;
}
</style>
