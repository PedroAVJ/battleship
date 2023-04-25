<template>
  <div :class="['cell', tile.background.isWater ? 'water' : 'land']" @click="click">
    <Sprite :tile="tile" :isPlayerBoard="false" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Tile, Orientation, SHIP_DIMENSIONS, MutationType } from '@/types/store.interface';
import { useStore } from '@/store';
import Sprite from './Sprite.vue';


interface CellProps {
  tile: Tile;
  row: number;
  col: number;
}

const props = defineProps<CellProps>();
const store = useStore();

function click() {
  // If there is no id, then a game isn't in progress
  if (!store.state.game.id) return;

  if (!store.state.game.isPlayersTurn) return;
  if (isInvalidSquare(store.state.enemy.board, props.row, props.col)) return;

  store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, false);

  const buf_player_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][]; // Deep copy of the board
  if (store.state.player.isUsingAircraftCarrierAbility) {
    for (const tile of getAircraftCarrierTiles()) {
      buf_player_board[tile.row][tile.col].contains.uncoveredShip = true;
    }
  } else if (store.state.player.isUsingSubmarineAbility) {
    for (const tile of getSubmarineTiles()) {
      buf_player_board[tile.row][tile.col].contains.uncoveredShip = true;
    }
  }

  store.commit(MutationType.SET_PLAYER_BOARD, buf_player_board);

  const uncovered_tiles = [];
  for (let row = 0; row < store.state.enemy.board.length; row++) {
    for (let col = 0; col < store.state.enemy.board[0].length; col++) {
      if (store.state.enemy.board[row][col].contains.uncoveredShip) {
        uncovered_tiles.push({
          row: row,
          col: col,
        });
      }
    }
  }

  // Create a copy of the player board, without the ship positions
  const player_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][]; // Deep copy of the board
  for (let row = 0; row < player_board.length; row++) {
    for (let col = 0; col < player_board[0].length; col++) {
      delete player_board[row][col].ship;
    }
  }

  fetch('http://localhost:8000/api/make_move/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      game_id: store.state.game.id,
      player_board: JSON.stringify(player_board),
      row: props.row,
      col: props.col,
      move_is_submarine_ability: store.state.player.isUsingSubmarineAbility,
      move_is_aircraft_carrier_ability: store.state.player.isUsingAircraftCarrierAbility,
      uncovered_tiles: uncovered_tiles,
    })
  })
  .then(response => response.json())
  .then(data => {
    const player = {
      results_from_move: data.player.results_from_move,
      won: data.player.won,
    }
    const computer_move = {
      row: data.computer_move.row,
      col: data.computer_move.col,
      is_submarine_ability: data.computer_move.is_submarine_ability,
      is_aircraft_carrier_ability: data.computer_move.is_aircraft_carrier_ability,
      uncovered_tiles: data.computer_move.uncovered_tiles,
    }

    console.log(computer_move);
    if (player.won) console.log('Player won!');

    // Iterate through the results from the move and update the board
    const enemy_board = JSON.parse(JSON.stringify(store.state.enemy.board)) as Tile[][]; // Deep copy of the board
    for (const result of player.results_from_move) {
      const row = result.row;
      const col = result.col;

      if (result.action === 'successfulShot') {
        enemy_board[row][col].contains.successfulShot = true;
      } else if (result.action === 'missedShot') {
        enemy_board[row][col].contains.missedShot = true;
      } else if (result.action === 'uncoveredShip') {
        enemy_board[row][col].contains.uncoveredShip = true;
      }
    }

    // Now deal with the computer's move
    const player_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][]; // Deep copy of the board
    if (computer_move.is_submarine_ability) {
      
        // Check a 3x3 square around the tile, and uncover any ships
        for (let row = computer_move.row - 1; row <= computer_move.row + 1; row++) {
          for (let col = computer_move.col - 1; col <= computer_move.col + 1; col++) {
            if (!isInvalidSquare(player_board, row, col)) {
              // if ship is present, uncover it
              if (player_board[row][col].ship) {
                player_board[row][col].contains.uncoveredShip = true;
              }
            }
          }
        }

    } else if (computer_move.is_aircraft_carrier_ability) {

        // Attack a 3x3 square around the tile
        for (let row = computer_move.row - 1; row <= computer_move.row + 1; row++) {
          for (let col = computer_move.col - 1; col <= computer_move.col + 1; col++) {
            if (!isInvalidSquare(player_board, row, col)) {
              if (player_board[row][col].ship) {
                player_board[row][col].contains.successfulShot = true;
              } else {
                player_board[row][col].contains.missedShot = true;
              }
            }
          }
        }
    
    } else {

      if (player_board[computer_move.row][computer_move.col].ship) {
        player_board[computer_move.row][computer_move.col].contains.successfulShot = true;
      } else {
        player_board[computer_move.row][computer_move.col].contains.missedShot = true;
      }

    }

    // If there are uncovered tiles, update the board
    if (computer_move.uncovered_tiles.length > 0) {
      for (const tile of computer_move.uncovered_tiles) {
        enemy_board[tile.row][tile.col].contains.uncoveredShip = true;
      }
    }

    store.commit(MutationType.SET_PLAYER_BOARD, player_board);
    store.commit(MutationType.SET_ENEMY_BOARD, enemy_board);
    store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, true);

    if (store.state.player.isUsingAircraftCarrierAbility) {
      store.commit(MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true);
      store.commit(MutationType.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false);
    } else if (store.state.player.isUsingSubmarineAbility) {
      store.commit(MutationType.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false);
      store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true);
    }

    // Check the player board and calculate if the computer has won
    let computer_won = true;
    for (let row = 0; row < player_board.length; row++) {
      for (let col = 0; col < player_board[0].length; col++) {
        if (player_board[row][col].ship && !player_board[row][col].contains.successfulShot) {
          computer_won = false;
        }
      }
    }

    if (computer_won) console.log('Computer won!');
  })
  .catch((error) => {
    console.error('Error when making move:', error);
  });
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

        // Since the submarine is 1x1, we can just return the tile
        return [{
          row: row,
          col: col
        }]
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
.cell {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
}

.water {
  background-color: #34495e;
}

.land {
  background-color: #2ecc71;
}

.water.darken {
  background-color: #2c3e50;
}

.land.darken {
  background-color: #27ae60;
}
</style>
