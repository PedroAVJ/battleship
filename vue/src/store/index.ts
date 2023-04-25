import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { MAPS, MapName, RootState, Tile, ActionType, MutationType } from '@/types/store.interface';


// This key allows TypeScript to infer the type of the store
export const key: InjectionKey<Store<RootState>> = Symbol();

/**
 * Provides a typed version of the Vuex store.
 * Make sure to import useStore from '@/store' instead of 'vuex'.
 */
export function useStore() {
  return baseUseStore(key);
}

const store = createStore<RootState>({

  state: {
    game: {
      isPlayersTurn: localStorage.getItem('isPlayersTurn') === 'true',
      id: parseInt(localStorage.getItem('gameId') || '0'),

      submarineCount: parseInt(localStorage.getItem('gameSubmarineCount') || '0'),
      supplyBoatCount: parseInt(localStorage.getItem('gameSupplyBoatCount') || '0'),
      destroyerCount: parseInt(localStorage.getItem('gameDestroyerCount') || '0'),
      battleshipCount: parseInt(localStorage.getItem('gameBattleshipCount') || '0'),
      frigateCount: parseInt(localStorage.getItem('gameFrigateCount') || '0'),
      aircraftCarrierCount: parseInt(localStorage.getItem('gameAircraftCarrierCount') || '0'),
    },
    gui: {
      submarineCount: parseInt(localStorage.getItem('guiSubmarineCount') || '0'),
      supplyBoatCount: parseInt(localStorage.getItem('guiSupplyBoatCount') || '0'),
      destroyerCount: parseInt(localStorage.getItem('guiDestroyerCount') || '0'),
      battleshipCount: parseInt(localStorage.getItem('guiBattleshipCount') || '0'),
      frigateCount: parseInt(localStorage.getItem('guiFrigateCount') || '0'),
      aircraftCarrierCount: parseInt(localStorage.getItem('guiAircraftCarrierCount') || '0'),
    },
    player: {
      isUsingSubmarineAbility: localStorage.getItem('isUsingSubmarineAbility') === 'true',
      isUsingAircraftCarrierAbility: localStorage.getItem('isUsingAircraftCarrierAbility') === 'true',

      hasUsedSubmarineAbility: localStorage.getItem('hasUsedSubmarineAbility') === 'true',
      hasUsedAircraftCarrierAbility: localStorage.getItem('hasUsedAircraftCarrierAbility') === 'true',

      aircraftCarrierHealth: parseInt(localStorage.getItem('aircraftCarrierHealth') || '0'),

      board: JSON.parse(localStorage.getItem('playerBoard') || '[[]]'),
    },
    enemy: { board: JSON.parse(localStorage.getItem('enemyBoard') || '[[]]'), },
  },

  mutations: {
    [MutationType.SET_GAME_IS_PLAYERS_TURN](state, isPlayersTurn: boolean) {
      state.game.isPlayersTurn = isPlayersTurn;
      localStorage.setItem('isPlayersTurn', isPlayersTurn.toString());
    },
    [MutationType.SET_GAME_ID](state, id: number) {
      state.game.id = id;
      localStorage.setItem('gameId', id.toString());
    },

    [MutationType.SET_GAME_SUBMARINE_COUNT](state, submarineCount: number) {
      state.game.submarineCount = submarineCount;
      localStorage.setItem('gameSubmarineCount', submarineCount.toString());
    },
    [MutationType.SET_GAME_SUPPLY_BOAT_COUNT](state, supplyBoatCount: number) {
      state.game.supplyBoatCount = supplyBoatCount;
      localStorage.setItem('gameSupplyBoatCount', supplyBoatCount.toString());
    },
    [MutationType.SET_GAME_DESTROYER_COUNT](state, destroyerCount: number) {
      state.game.destroyerCount = destroyerCount;
      localStorage.setItem('gameDestroyerCount', destroyerCount.toString());
    },
    [MutationType.SET_GAME_BATTLESHIP_COUNT](state, battleshipCount: number) {
      state.game.battleshipCount = battleshipCount;
      localStorage.setItem('gameBattleshipCount', battleshipCount.toString());
    },
    [MutationType.SET_GAME_FRIGATE_COUNT](state, frigateCount: number) {
      state.game.frigateCount = frigateCount;
      localStorage.setItem('gameFrigateCount', frigateCount.toString());
    },
    [MutationType.SET_GAME_AIRCRAFT_CARRIER_COUNT](state, aircraftCarrierCount: number) {
      state.game.aircraftCarrierCount = aircraftCarrierCount;
      localStorage.setItem('gameAircraftCarrierCount', aircraftCarrierCount.toString());
    },

    [MutationType.SET_GUI_SUBMARINE_COUNT](state, submarineCount: number) {
      state.gui.submarineCount = submarineCount;
      localStorage.setItem('guiSubmarineCount', submarineCount.toString());
    },
    [MutationType.SET_GUI_SUPPLY_BOAT_COUNT](state, supplyBoatCount: number) {
      state.gui.supplyBoatCount = supplyBoatCount;
      localStorage.setItem('guiSupplyBoatCount', supplyBoatCount.toString());
    },
    [MutationType.SET_GUI_DESTROYER_COUNT](state, destroyerCount: number) {
      state.gui.destroyerCount = destroyerCount;
      localStorage.setItem('guiDestroyerCount', destroyerCount.toString());
    },
    [MutationType.SET_GUI_BATTLESHIP_COUNT](state, battleshipCount: number) {
      state.gui.battleshipCount = battleshipCount;
      localStorage.setItem('guiBattleshipCount', battleshipCount.toString());
    },
    [MutationType.SET_GUI_FRIGATE_COUNT](state, frigateCount: number) {
      state.gui.frigateCount = frigateCount;
      localStorage.setItem('guiFrigateCount', frigateCount.toString());
    },
    [MutationType.SET_GUI_AIRCRAFT_CARRIER_COUNT](state, aircraftCarrierCount: number) {
      state.gui.aircraftCarrierCount = aircraftCarrierCount;
      localStorage.setItem('guiAircraftCarrierCount', aircraftCarrierCount.toString());
    },

    [MutationType.SET_PLAYER_IS_USING_SUBMARINE_ABILITY](state, isUsingSubmarineAbility: boolean) {
      state.player.isUsingSubmarineAbility = isUsingSubmarineAbility;
      localStorage.setItem('isUsingSubmarineAbility', isUsingSubmarineAbility.toString());
    },
    [MutationType.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY](state, isUsingAircraftCarrierAbility: boolean) {
      state.player.isUsingAircraftCarrierAbility = isUsingAircraftCarrierAbility;
      localStorage.setItem('isUsingAircraftCarrierAbility', isUsingAircraftCarrierAbility.toString());
    },

    [MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY](state, hasUsedSubmarineAbility: boolean) {
      state.player.hasUsedSubmarineAbility = hasUsedSubmarineAbility;
      localStorage.setItem('hasUsedSubmarineAbility', hasUsedSubmarineAbility.toString());
    },
    [MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY](state, hasUsedAircraftCarrierAbility: boolean) {
      state.player.hasUsedAircraftCarrierAbility = hasUsedAircraftCarrierAbility;
      localStorage.setItem('hasUsedAircraftCarrierAbility', hasUsedAircraftCarrierAbility.toString());
    },

    [MutationType.SET_AIRCRAFT_CARRIER_HEALTH](state, aircraftCarrierHealth: number) {
      state.player.aircraftCarrierHealth = aircraftCarrierHealth;
      localStorage.setItem('aircraftCarrierHealth', aircraftCarrierHealth.toString());
    },

    [MutationType.SET_PLAYER_BOARD](state, board: Tile[][]) {
      state.player.board = JSON.parse(JSON.stringify(board)) as Tile[][];
      localStorage.setItem('playerBoard', JSON.stringify(board));
    },
    [MutationType.SET_ENEMY_BOARD](state, board: Tile[][]) {
      state.enemy.board = JSON.parse(JSON.stringify(board)) as Tile[][];
      localStorage.setItem('enemyBoard', JSON.stringify(board));
    },
  },

  actions: {
    [ActionType.INITIALIZE_BOARDS_BASED_ON_MAP_NAME]({ commit }, mapName: MapName) {
      const map = MAPS[mapName];
      const enemyBoard = JSON.parse(JSON.stringify(map)) as Tile[][];
      const playerBoard = JSON.parse(JSON.stringify(map)) as Tile[][];
  
      commit(MutationType.SET_PLAYER_BOARD, playerBoard);
      commit(MutationType.SET_ENEMY_BOARD, enemyBoard);
    },
  },

  modules: {
  },
  getters: {
  },  
});

export default store;
