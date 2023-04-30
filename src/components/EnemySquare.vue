<template>
  <div :class="background" @click="Attack">
    <Sprite :tile="tile" :isPlayerSquare="false" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Orientation, Mutation } from '../store/enums';
import { Tile } from '../store/interfaces';
import { SHIP_DIMENSIONS } from '../store/constants';
import { useStore } from '../store';
import Sprite from './Sprite.vue';
import { computed } from 'vue';


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

function Attack() {

  // If there is no id, then a game isn't in progress
  if (!store.state.game.id) return;
  if (!store.state.game.isPlayersTurn) return;
  if (isInvalidSquare(store.state.enemy.board, props.row, props.col)) return;

  store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, false);

  // If the player is using an ability, update the board and send the move to the server
  const player_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][];
  if (store.state.player.isUsingAircraftCarrierAbility) {
    for (const tile of getAircraftCarrierTiles()) {
      player_board[tile.row][tile.col].contains.uncoveredShip = true;
    }
  } else if (store.state.player.isUsingSubmarineAbility) {
    for (const tile of getSubmarineTiles()) {
      player_board[tile.row][tile.col].contains.uncoveredShip = true;
    }
  }
  store.commit(MutationType.SET_PLAYER_BOARD, player_board);

  // Create a copy of the player board, without the ship positions
  const player_board_without_ships = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][];
  for (const row of player_board_without_ships) {
    for (const tile of row) {
      delete tile.ship;
    }
  }

  fetch('http://localhost:8000/api/make_move/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      game: {
        id: store.state.game.id,
      },
      player: {
        board: player_board_without_ships,
        move: {
          row: props.row,
          col: props.col,
          isSubmarineAbility: store.state.player.isUsingSubmarineAbility,
          isAircraftCarrierAbility: store.state.player.isUsingAircraftCarrierAbility,
        }
      },
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const player = {
      won: data.player.won,
    }
    const computer = {
      board: data.computer.board,
      move: {
        row: data.computer.move.row,
        col: data.computer.move.col,
        isSubmarineAbility: data.computer.move.isSubmarineAbility,
        isAircraftCarrierAbility: data.computer.move.isAircraftCarrierAbility,
      }
    }

    // Update the enemy board
    store.commit(MutationType.SET_ENEMY_BOARD, computer.board);
    
    // If the player won, set the won state and return
    console.log(`Row: ${computer.move.row}, Col: ${computer.move.col}`);
    if (player.won) {
      store.commit(MutationType.SET_PLAYER_WON, true);
      return;
    }
    
    // Now deal with the computer's move
    const player_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][];
    if (computer.move.isSubmarineAbility) {

      // Check a 3x3 square around the tile, and uncover any ships
      for (let row = computer.move.row - 1; row <= computer.move.row + 1; row++) {
        for (let col = computer.move.col - 1; col <= computer.move.col + 1; col++) {
          
          // Out of bounds check
          if (row < 0 || row > player_board.length - 1 || col < 0 || col > player_board[0].length - 1) continue;

          // if ship is present, uncover it
          if (player_board[row][col].ship) {
            player_board[row][col].contains.uncoveredShip = true;
          }
        }
      }

    } else if (computer.move.isAircraftCarrierAbility) {

      // Check a 3x3 square around the tile, and uncover any ships
      for (let row = computer.move.row - 1; row <= computer.move.row + 1; row++) {
        for (let col = computer.move.col - 1; col <= computer.move.col + 1; col++) {
          
          if (isInvalidSquare(player_board, row, col)) continue;

          // Attack the tile
          const tile = player_board[row][col];
          if (tile.ship) {
            tile.contains.successfulShot = true;

            // If it hit the aircraft carrier, lower the health by 1
            if (tile.ship.name === ShipName.AIRCRAFT_CARRIER) {
              store.commit(MutationType.SET_GAME_AIRCRAFT_CARRIER_HEALTH, store.state.game.aircraftCarrierHealth - 1);
            } else if (tile.ship.name === ShipName.SUBMARINE) {

              // As the submarine has 1 health, it is destroyed when hit
              store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
            }

          } else {
            tile.contains.missedShot = true;
          }
        }
      }
    
    } else {

      // Attack the tile
      const tile = player_board[computer.move.row][computer.move.col];
      if (tile.ship) {
        tile.contains.successfulShot = true;

        // If it hit the aircraft carrier, lower the health by 1
        if (tile.ship.name === ShipName.AIRCRAFT_CARRIER) {
          store.commit(MutationType.SET_GAME_AIRCRAFT_CARRIER_HEALTH, store.state.game.aircraftCarrierHealth - 1);
        } else if (tile.ship.name === ShipName.SUBMARINE) {

          // As the submarine has 1 health, it is destroyed when hit
          store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
        }

      } else {
        tile.contains.missedShot = true;
      }

    }

    // If the aircraft carrier has 0 health, set the ability to used
    if (store.state.game.aircraftCarrierHealth === 0) {
      store.commit(MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
    }

    store.commit(MutationType.SET_PLAYER_BOARD, player_board);

    // Check the player board and calculate if the computer has won
    let computer_won = true;
    for (const row of player_board) {
      for (const tile of row) {
        if (tile.ship && !tile.contains.successfulShot) {
          computer_won = false;
          break;
        }
      }
    }

    // If the computer won, set the won state and return
    if (computer_won) {
      store.commit(MutationType.SET_ENEMY_WON, true);
      return;
    }
  })
  .catch((error) => {
    console.error('Error when making move:', error);
  });

  // Update the GUI
  if (store.state.player.isUsingAircraftCarrierAbility) {
    store.commit(MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
    store.commit(MutationType.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false);
  } else if (store.state.player.isUsingSubmarineAbility) {
    store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
    store.commit(MutationType.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false);
  }
  store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, true);
}

function isInvalidSquare(board: Tile[][], row: number, col: number): boolean {

  // Out of bounds check
  if (row < 0 || row >= board.length) return true;
  if (col < 0 || col >= board[0].length) return true;

  if (board[row][col].background.isLand) return true;
  if (board[row][col].contains.missedShot) return true;
  if (board[row][col].contains.successfulShot) return true;

  return false;
}

function getAircraftCarrierTiles(): { row: number, col: number }[] {
  for (let row = 0; row < store.state.player.board.length; row++) {
    for (let col = 0; col < store.state.player.board[0].length; col++) {
      if (store.state.player.board[row][col].ship?.name === ShipName.AIRCRAFT_CARRIER) {

        // Return hitboxes for the aircraft carrier
        const orientation = store.state.player.board[row][col].ship?.orientation;
        if (orientation === undefined) continue;
        return getShipHitboxes(ShipName.AIRCRAFT_CARRIER, orientation, row, col);
      }
    }
  }

  return [];
}

function getSubmarineTiles(): { row: number, col: number }[] {
  const tiles: { row: number, col: number }[] = [];

  for (let row = 0; row < store.state.player.board.length; row++) {
    for (let col = 0; col < store.state.player.board[0].length; col++) {
      if (store.state.player.board[row][col].ship?.name === ShipName.SUBMARINE) {

        // Return hitboxes for the submarine
        const orientation = store.state.player.board[row][col].ship?.orientation;
        if (orientation === undefined) continue;
        tiles.push(...getShipHitboxes(ShipName.SUBMARINE, orientation, row, col));
      }
    }
  }

  return tiles;
}

function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation, row_origin: number, col_origin: number): { row: number, col: number }[] {
  const shipLength = SHIP_DIMENSIONS[shipName].length;
  const shipHitboxes: { row: number, col: number }[] = [];

  if (shipOrientation === Orientation.HORIZONTAL) {
    for (let col = 0; col < shipLength; col++) {
      shipHitboxes.push({ row: row_origin, col: col_origin + col });

      // If it is an aircraft carrier, add the extra hitbox below
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: row_origin + 1, col: col_origin + col });
      }
    }
  } else {
    for (let row = 0; row < shipLength; row++) {
      shipHitboxes.push({ row: row_origin + row, col: col_origin });

      // If it is an aircraft carrier, add the extra hitbox to the right
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: row_origin + row, col: col_origin + 1 });
      }
    }
  }

  return shipHitboxes;
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
</style>
