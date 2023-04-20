import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { RootState, MapType } from '@/types/store';


// Define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// Create a typed store
const store = createStore<RootState>({
  state: {

    // Metadata about the game configuration and state.
    map: localStorage.getItem('map') as MapType || MapType.DEFAULT,
    supplyBoatCount: parseInt(localStorage.getItem('supplyBoatCount') || '0', 0),
    destroyerCount: parseInt(localStorage.getItem('destroyerCount') || '0', 0),
    battleshipCount: parseInt(localStorage.getItem('battleshipCount') || '0', 0),
    frigateCount: parseInt(localStorage.getItem('frigateCount') || '0', 0),
    hasUsedAircraftCarrierAbility: localStorage.getItem('hasUsedAircraftCarrierAbility') === 'true',
    hasUsedSubmarineAbility: localStorage.getItem('hasUsedSubmarineAbility') === 'true',
    gameInProgress: localStorage.getItem('gameInProgress') === 'true',

    // The boards are a matrix of tiles or ships.
    enemyBoard: JSON.parse(localStorage.getItem('enemyBoard') || '[[]]'),
    playerBoard: JSON.parse(localStorage.getItem('playerBoard') || '[[]]'),

    // This is to coordinate the state between the count of ships on tne GUI
    // and the event handler on the drop function in the cell
    guiSubmarineCount: parseInt(localStorage.getItem('guiSubmarineCount') || '0', 0),
    guiSupplyBoatCount: parseInt(localStorage.getItem('guiSupplyBoatCount') || '0', 0),
    guiDestroyerCount: parseInt(localStorage.getItem('guiDestroyerCount') || '0', 0),
    guiBattleshipCount: parseInt(localStorage.getItem('guiBattleshipCount') || '0', 0),
    guiFrigateCount: parseInt(localStorage.getItem('guiFrigateCount') || '0', 0),
    guiAircraftCarrierCount: parseInt(localStorage.getItem('guiAircraftCarrierCount') || '0', 0),
  },
  getters: {
  },
  mutations: {
    setMap(state, map: RootState['map']) {
      state.map = map;
      localStorage.setItem('map', map);
    },
    setSupplyBoatCount(state, count: number) {
      state.supplyBoatCount = count;
      localStorage.setItem('supplyBoatCount', count.toString());
    },
    setDestroyerCount(state, count: number) {
      state.destroyerCount = count;
      localStorage.setItem('destroyerCount', count.toString());
    },
    setBattleshipCount(state, count: number) {
      state.battleshipCount = count;
      localStorage.setItem('battleshipCount', count.toString());
    },
    setFrigateCount(state, count: number) {
      state.frigateCount = count;
      localStorage.setItem('frigateCount', count.toString());
    },
    setHasUsedAircraftCarrierAbility(state, value: boolean) {
      state.hasUsedAircraftCarrierAbility = value;
      localStorage.setItem('hasUsedAircraftCarrierAbility', value.toString());
    },
    setHasUsedSubmarineAbility(state, value: boolean) {
      state.hasUsedSubmarineAbility = value;
      localStorage.setItem('hasUsedSubmarineAbility', value.toString());
    },
    setEnemyBoard(state, board: RootState['enemyBoard']) {
      state.enemyBoard = board;
      localStorage.setItem('enemyBoard', JSON.stringify(board));
    },
    setPlayerBoard(state, board: RootState['playerBoard']) {
      state.playerBoard = board;
      localStorage.setItem('playerBoard', JSON.stringify(board));
    },
    setGameInProgress(state, value: boolean) {
      state.gameInProgress = value;
      localStorage.setItem('gameInProgress', value.toString());
    },
    setGuiSubmarineCount(state, count: number) {
      state.guiSubmarineCount = count;
      localStorage.setItem('guiSubmarineCount', count.toString());
    },
    setGuiSupplyBoatCount(state, count: number) {
      state.guiSupplyBoatCount = count;
      localStorage.setItem('guiSupplyBoatCount', count.toString());
    },
    setGuiDestroyerCount(state, count: number) {
      state.guiDestroyerCount = count;
      localStorage.setItem('guiDestroyerCount', count.toString());
    },
    setGuiBattleshipCount(state, count: number) {
      state.guiBattleshipCount = count;
      localStorage.setItem('guiBattleshipCount', count.toString());
    },
    setGuiFrigateCount(state, count: number) {
      state.guiFrigateCount = count;
      localStorage.setItem('guiFrigateCount', count.toString());
    },
    setGuiAircraftCarrierCount(state, count: number) {
      state.guiAircraftCarrierCount = count;
      localStorage.setItem('guiAircraftCarrierCount', count.toString());
    },
  },
  actions: {
    // Initialize the boards, based on the map
    initializeBoards({ commit, state }) {
      const enemyBoard: RootState['enemyBoard'] = [];
      const playerBoard: RootState['playerBoard'] = [];
      for (let i = 0; i < 10; i++) {
        enemyBoard.push([]);
        playerBoard.push([]);
        for (let j = 0; j < 10; j++) {
          enemyBoard[i].push(0);
          playerBoard[i].push(0);
        }
      }
      if (state.map === MapType.MAP1) {
        enemyBoard[0][0] = 1;
        enemyBoard[0][9] = 1;
        enemyBoard[9][0] = 1;
        enemyBoard[9][9] = 1;
        playerBoard[0][0] = 1;
        playerBoard[0][9] = 1;
        playerBoard[9][0] = 1;
        playerBoard[9][9] = 1;
      } else if (state.map === MapType.MAP2) {
        enemyBoard[0][0] = 1;
        enemyBoard[0][9] = 1;
        enemyBoard[9][0] = 1;
        enemyBoard[9][9] = 1;
        enemyBoard[4][4] = 1;
        enemyBoard[4][5] = 1;
        enemyBoard[5][4] = 1;
        enemyBoard[5][5] = 1;
        playerBoard[0][0] = 1;
        playerBoard[0][9] = 1;
        playerBoard[9][0] = 1;
        playerBoard[9][9] = 1;
        playerBoard[4][4] = 1;
        playerBoard[4][5] = 1;
        playerBoard[5][4] = 1;
        playerBoard[5][5] = 1;
      } else if (state.map === MapType.MAP3) {
        enemyBoard[0][0] = 1;
        enemyBoard[0][9] = 1;
        enemyBoard[9][0] = 1;
        enemyBoard[9][9] = 1;
        enemyBoard[4][4] = 1;
        enemyBoard[4][5] = 1;
        enemyBoard[5][4] = 1;
        enemyBoard[5][5] = 1;
        enemyBoard[0][4] = 1;
        enemyBoard[0][5] = 1;
        enemyBoard[9][4] = 1;
        enemyBoard[9][5] = 1;
        enemyBoard[4][0] = 1;
        enemyBoard[4][9] = 1;
        enemyBoard[5][0] = 1;
        enemyBoard[5][9] = 1;
        playerBoard[0][0] = 1;
        playerBoard[0][9] = 1;
        playerBoard[9][0] = 1;
        playerBoard[9][9] = 1;
        playerBoard[4][4] = 1;
        playerBoard[4][5] = 1;
        playerBoard[5][4] = 1;
        playerBoard[5][5] = 1;
        playerBoard[0][4] = 1;
        playerBoard[0][5] = 1;
        playerBoard[9][4] = 1;
        playerBoard[9][5] = 1;
        playerBoard[4][0] = 1;
        playerBoard[4][9] = 1;
        playerBoard[5][0] = 1;
        playerBoard[5][9] = 1;
      }
      commit('setEnemyBoard', enemyBoard);
      commit('setPlayerBoard', playerBoard);
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
