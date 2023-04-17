import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { RootState } from '@/types/store';


// Define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// Create a typed store
const store = createStore<RootState>({
  state: {
    difficulty: (localStorage.getItem('difficulty') as RootState['difficulty']) || '',
    map: (localStorage.getItem('map') as RootState['map']) || '',
    supplyBoatCount: parseInt(localStorage.getItem('supplyBoatCount') || '0', 0),
    destroyerCount: parseInt(localStorage.getItem('destroyerCount') || '0', 0),
    battleshipCount: parseInt(localStorage.getItem('battleshipCount') || '0', 0),
    frigateCount: parseInt(localStorage.getItem('frigateCount') || '0', 0),
    hasUsedAircraftCarrierAbility: localStorage.getItem('hasUsedAircraftCarrierAbility') === 'true',
    hasUsedSubmarineAbility: localStorage.getItem('hasUsedSubmarineAbility') === 'true',
    enemyBoard: JSON.parse(localStorage.getItem('enemyBoard') || '[]'),
    playerBoard: JSON.parse(localStorage.getItem('playerBoard') || '[]'),
    ships: JSON.parse(localStorage.getItem('ships') || '[]'),
  },
  getters: {
  },
  mutations: {
    setDifficulty(state, difficulty: RootState['difficulty']) {
      state.difficulty = difficulty;
      localStorage.setItem('difficulty', difficulty);
    },
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
    setShips(state, ships: RootState['ships']) {
      state.ships = ships;
      localStorage.setItem('ships', JSON.stringify(ships));
    },
  },
  actions: {
  },
  modules: {
  }
});

// Define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}

export default store;
