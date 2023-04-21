import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { MAPS, MapName, RootState, Tile } from '@/types/store.interface';


// This key allows TypeScript to infer the type of the store
export const key: InjectionKey<Store<RootState>> = Symbol();

/**
 * So long as useStore is imported from '@/store' and not from 'vuex',
 * the store will have type annotations
 */
export function useStore() {
  return baseUseStore(key);
}

const store = createStore<RootState>({
  state: {
    map: JSON.parse(localStorage.getItem('map') || '[[]]'),
    game: {
      isInProgress: localStorage.getItem('isInProgress') === 'true',
      isPlayersTurn: localStorage.getItem('isPlayersTurn') === 'true',

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

      board: JSON.parse(localStorage.getItem('playerBoard') || '[[]]'),
    },
    enemy: { board: JSON.parse(localStorage.getItem('enemyBoard') || '[[]]'), },
  },
  getters: {
  },
  mutations: {
    setMap(state, map: Tile[][]) {
      state.map = map;
      localStorage.setItem('map', JSON.stringify(map));
    },
    setGameIsInProgress(state, isInProgress: boolean) {
      state.game.isInProgress = isInProgress;
      localStorage.setItem('isInProgress', isInProgress.toString());
    },
    setGameIsPlayersTurn(state, isPlayersTurn: boolean) {
      state.game.isPlayersTurn = isPlayersTurn;
      localStorage.setItem('isPlayersTurn', isPlayersTurn.toString());
    },
    setGameSubmarineCount(state, submarineCount: number) {
      state.game.submarineCount = submarineCount;
      localStorage.setItem('gameSubmarineCount', submarineCount.toString());
    },
    setGameSupplyBoatCount(state, supplyBoatCount: number) {
      state.game.supplyBoatCount = supplyBoatCount;
      localStorage.setItem('gameSupplyBoatCount', supplyBoatCount.toString());
    },
    setGameDestroyerCount(state, destroyerCount: number) {
      state.game.destroyerCount = destroyerCount;
      localStorage.setItem('gameDestroyerCount', destroyerCount.toString());
    },
    setGameBattleshipCount(state, battleshipCount: number) {
      state.game.battleshipCount = battleshipCount;
      localStorage.setItem('gameBattleshipCount', battleshipCount.toString());
    },
    setGameFrigateCount(state, frigateCount: number) {
      state.game.frigateCount = frigateCount;
      localStorage.setItem('gameFrigateCount', frigateCount.toString());
    },
    setGameAircraftCarrierCount(state, aircraftCarrierCount: number) {
      state.game.aircraftCarrierCount = aircraftCarrierCount;
      localStorage.setItem('gameAircraftCarrierCount', aircraftCarrierCount.toString());
    },
    setGuiSubmarineCount(state, submarineCount: number) {
      state.gui.submarineCount = submarineCount;
      localStorage.setItem('guiSubmarineCount', submarineCount.toString());
    },
    setGuiSupplyBoatCount(state, supplyBoatCount: number) {
      state.gui.supplyBoatCount = supplyBoatCount;
      localStorage.setItem('guiSupplyBoatCount', supplyBoatCount.toString());
    },
    setGuiDestroyerCount(state, destroyerCount: number) {
      state.gui.destroyerCount = destroyerCount;
      localStorage.setItem('guiDestroyerCount', destroyerCount.toString());
    },
    setGuiBattleshipCount(state, battleshipCount: number) {
      state.gui.battleshipCount = battleshipCount;
      localStorage.setItem('guiBattleshipCount', battleshipCount.toString());
    },
    setGuiFrigateCount(state, frigateCount: number) {
      state.gui.frigateCount = frigateCount;
      localStorage.setItem('guiFrigateCount', frigateCount.toString());
    },
    setGuiAircraftCarrierCount(state, aircraftCarrierCount: number) {
      state.gui.aircraftCarrierCount = aircraftCarrierCount;
      localStorage.setItem('guiAircraftCarrierCount', aircraftCarrierCount.toString());
    },
    setPlayerBoard(state, board: Tile[][]) {
      state.player.board = board;
      localStorage.setItem('playerBoard', JSON.stringify(board));
    },
    setPlayerIsUsingSubmarineAbility(state, isUsingSubmarineAbility: boolean) {
      state.player.isUsingSubmarineAbility = isUsingSubmarineAbility;
      localStorage.setItem('isUsingSubmarineAbility', isUsingSubmarineAbility.toString());
    },
    setPlayerIsUsingAircraftCarrierAbility(state, isUsingAircraftCarrierAbility: boolean) {
      state.player.isUsingAircraftCarrierAbility = isUsingAircraftCarrierAbility;
      localStorage.setItem('isUsingAircraftCarrierAbility', isUsingAircraftCarrierAbility.toString());
    },
    setPlayerHasUsedSubmarineAbility(state, hasUsedSubmarineAbility: boolean) {
      state.player.hasUsedSubmarineAbility = hasUsedSubmarineAbility;
      localStorage.setItem('hasUsedSubmarineAbility', hasUsedSubmarineAbility.toString());
    },
    setPlayerHasUsedAircraftCarrierAbility(state, hasUsedAircraftCarrierAbility: boolean) {
      state.player.hasUsedAircraftCarrierAbility = hasUsedAircraftCarrierAbility;
      localStorage.setItem('hasUsedAircraftCarrierAbility', hasUsedAircraftCarrierAbility.toString());
    },
    setEnemyBoard(state, board: Tile[][]) {
      state.enemy.board = board;
      localStorage.setItem('enemyBoard', JSON.stringify(board));
    },
  },
  actions: {
    createBoardBasedOnMapName({ commit }, mapName: MapName) {
      const board = MAPS[mapName];
      const enemyBoard = JSON.parse(JSON.stringify(board)) as Tile[][];
      const playerBoard = JSON.parse(JSON.stringify(board)) as Tile[][];
  
      commit('setPlayerBoard', playerBoard);
      commit('setEnemyBoard', enemyBoard);
    },
  },  
  modules: {
  }
});

export default store;
