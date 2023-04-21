import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { RootState, MapType, Board } from '@/types/store.interface';


// Define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// Create a typed store
const store = createStore<RootState>({
  state: {
    map: localStorage.getItem('map') as MapType || MapType.DEFAULT,
    is_game_in_progress: localStorage.getItem('is_game_in_progress') === 'true',
    game_ship_counts: {
      submarine_count: parseInt(localStorage.getItem('submarine_count') || '0', 0),
      supply_boat_count: parseInt(localStorage.getItem('supply_boat_count') || '0', 0),
      destroyer_count: parseInt(localStorage.getItem('destroyer_count') || '0', 0),
      battleship_count: parseInt(localStorage.getItem('battleship_count') || '0', 0),
      frigate_count: parseInt(localStorage.getItem('frigate_count') || '0', 0),
      aircraft_carrier_count: parseInt(localStorage.getItem('aircraft_carrier_count') || '0', 0),
    },
    gui_ship_counts: {
      submarine_count: parseInt(localStorage.getItem('gui_submarine_count') || '0', 0),
      supply_boat_count: parseInt(localStorage.getItem('gui_supply_boat_count') || '0', 0),
      destroyer_count: parseInt(localStorage.getItem('gui_destroyer_count') || '0', 0),
      battleship_count: parseInt(localStorage.getItem('gui_battleship_count') || '0', 0),
      frigate_count: parseInt(localStorage.getItem('gui_frigate_count') || '0', 0),
      aircraft_carrier_count: parseInt(localStorage.getItem('gui_aircraft_carrier_count') || '0', 0),
    },
    has_used_aircraft_carrier_ability: localStorage.getItem('has_used_aircraft_carrier_ability') === 'true',
    has_used_submarine_ability: localStorage.getItem('has_used_submarine_ability') === 'true',
    enemy_board: JSON.parse(localStorage.getItem('enemy_board') || '[[]]'),
    player_board: JSON.parse(localStorage.getItem('player_board') || '[[]]'),
  },
  getters: {
  },
  mutations: {
    set_map(state, map: RootState['map']) {
      state.map = map;
      localStorage.setItem('map', map);
    },
    set_is_game_in_progress(state, value: boolean) {
      state.is_game_in_progress = value;
      localStorage.setItem('is_game_in_progress', value.toString());
    },
    set_game_ship_counts(state, ship_counts: RootState['game_ship_counts']) {
      state.game_ship_counts = ship_counts;
      localStorage.setItem('submarine_count', ship_counts.submarine_count.toString());
      localStorage.setItem('supply_boat_count', ship_counts.supply_boat_count.toString());
      localStorage.setItem('destroyer_count', ship_counts.destroyer_count.toString());
      localStorage.setItem('battleship_count', ship_counts.battleship_count.toString());
      localStorage.setItem('frigate_count', ship_counts.frigate_count.toString());
      localStorage.setItem('aircraft_carrier_count', ship_counts.aircraft_carrier_count.toString());
    },
    set_gui_ship_counts(state, ship_counts: RootState['gui_ship_counts']) {
      state.gui_ship_counts = ship_counts;
      localStorage.setItem('gui_submarine_count', ship_counts.submarine_count.toString());
      localStorage.setItem('gui_supply_boat_count', ship_counts.supply_boat_count.toString());
      localStorage.setItem('gui_destroyer_count', ship_counts.destroyer_count.toString());
      localStorage.setItem('gui_battleship_count', ship_counts.battleship_count.toString());
      localStorage.setItem('gui_frigate_count', ship_counts.frigate_count.toString());
      localStorage.setItem('gui_aircraft_carrier_count', ship_counts.aircraft_carrier_count.toString());
    },
    set_has_used_aircraft_carrier_ability(state, value: boolean) {
      state.has_used_aircraft_carrier_ability = value;
      localStorage.setItem('has_used_aircraft_carrier_ability', value.toString());
    },
    set_has_used_submarine_ability(state, value: boolean) {
      state.has_used_submarine_ability = value;
      localStorage.setItem('has_used_submarine_ability', value.toString());
    },
    set_enemy_board(state, board: RootState['enemy_board']) {
      state.enemy_board = board;
      localStorage.setItem('enemy_board', JSON.stringify(board));
    },
    set_player_board(state, board: RootState['player_board']) {
      state.player_board = board;
      localStorage.setItem('player_board', JSON.stringify(board));
    },
  },
  actions: {
    // Initialize the boards, based on the map
    initialize_boards({ commit, state }) {
      const enemy_board: RootState['enemy_board'] = [];
      const player_board: RootState['player_board'] = [];
      for (let i = 0; i < 10; i++) {
        enemy_board.push([]);
        player_board.push([]);
        for (let j = 0; j < 10; j++) {
          enemy_board[i].push({
            water: true,
            land: false,
            miss: false,
            hit: false,
            uncovered_ship: false,
            ship: false,
            ship_sprite: undefined,
          });
          player_board[i].push({
            water: true,
            land: false,
            miss: false,
            hit: false,
            uncovered_ship: false,
            ship: false,
            ship_sprite: undefined,
          });
        }
      }

      const set_land = (board: Board, row: number, col: number) => {
        board[row][col].land = true;
        board[row][col].water = false;
      };

      if (state.map === MapType.MAP1) {
        set_land(enemy_board, 0, 0);
        set_land(enemy_board, 0, 9);
        set_land(enemy_board, 9, 0);
        set_land(enemy_board, 9, 9);
        set_land(player_board, 0, 0);
        set_land(player_board, 0, 9);
        set_land(player_board, 9, 0);
        set_land(player_board, 9, 9);
      } else if (state.map === MapType.MAP2) {
        set_land(enemy_board, 0, 0);
        set_land(enemy_board, 0, 9);
        set_land(enemy_board, 9, 0);
        set_land(enemy_board, 9, 9);
        set_land(enemy_board, 4, 4);
        set_land(enemy_board, 4, 5);
        set_land(enemy_board, 5, 4);
        set_land(enemy_board, 5, 5);
        set_land(player_board, 0, 0);
        set_land(player_board, 0, 9);
        set_land(player_board, 9, 0);
        set_land(player_board, 9, 9);
        set_land(player_board, 4, 4);
        set_land(player_board, 4, 5);
        set_land(player_board, 5, 4);
        set_land(player_board, 5, 5);
      } else if (state.map === MapType.MAP3) {
        set_land(enemy_board, 0, 0);
        set_land(enemy_board, 0, 9);
        set_land(enemy_board, 9, 0);
        set_land(enemy_board, 9, 9);
        set_land(enemy_board, 4, 4);
        set_land(enemy_board, 4, 5);
        set_land(enemy_board, 5, 4);
        set_land(enemy_board, 5, 5);
        set_land(enemy_board, 0, 4);
        set_land(enemy_board, 0, 5);
        set_land(enemy_board, 9, 4);
        set_land(enemy_board, 9, 5);
        set_land(enemy_board, 4, 0);
        set_land(enemy_board, 4, 9);
        set_land(enemy_board, 5, 0);
        set_land(enemy_board, 5, 9);
        set_land(player_board, 0, 0);
        set_land(player_board, 0, 9);
        set_land(player_board, 9, 0);
        set_land(player_board, 9, 9);
        set_land(player_board, 4, 4);
        set_land(player_board, 4, 5);
        set_land(player_board, 5, 4);
        set_land(player_board, 5, 5);
        set_land(player_board, 0, 4);
        set_land(player_board, 0, 5);
        set_land(player_board, 9, 4);
        set_land(player_board, 9, 5);
        set_land(player_board, 4, 0);
        set_land(player_board, 4, 9);
        set_land(player_board, 5, 0);
        set_land(player_board, 5, 9);
      }

      commit('setEnemyBoard', enemy_board);
      commit('setPlayerBoard', player_board);
    },
  },
  modules: {
  }
});

// Define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}

export default store;
