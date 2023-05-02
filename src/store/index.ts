import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { RootState, Tile } from '@/store/interfaces';
import { Mutation, MapName } from '@/store/enums';


// This key allows TypeScript to infer the types of the store object
export const key: InjectionKey<Store<RootState>> = Symbol();

/**
 * Provides a typed version of the Vuex store.
 * Make sure to import useStore from '@/store' instead of 'vuex'.
 */
export function useStore() {
    return baseUseStore(key);
}

/**
 * Because we are using vuex-persistedstate, the values given here are for when the key in localStorage is not found.
 */
const state: RootState = {

    game: {
        isInProgress: false,
        mapName: undefined,
    },

    /** Keeps track of the ships left to place in case the page is refreshed */
    gui: {
        submarineCount: 0,
        supplyBoatCount: 0,
        destroyerCount: 0,
        battleshipCount: 0,
        frigateCount: 0,
        aircraftCarrierCount: 0,
    },

    player: {

        // GUI changes during ability usage
        isUsingSubmarineAbility: false,
        isUsingAircraftCarrierAbility: false,
        isUsingBattleshipAbility: false,

        // GUI changes after ability usage
        hasUsedSubmarineAbility: false,
        hasUsedAircraftCarrierAbility: false,
        hasUsedBattleshipAbility: false,

        // If their health is 0, their ability is consumed
        aircraftCarrierHealth: 0,
        battleshipHealth: 0,

        // When the ability is used, this is the number of shots that can be fired
        aircraftCarrierShots: 0,

        hasCurrentTurn: false,
        hasWonTheGame: false,
        board: [[]],
    },

    computer: {

        // GUI changes during ability usage
        isUsingSubmarineAbility: false,
        isUsingAircraftCarrierAbility: false,
        isUsingBattleshipAbility: false,

        // GUI changes after ability usage
        hasUsedSubmarineAbility: false,
        hasUsedAircraftCarrierAbility: false,
        hasUsedBattleshipAbility: false,

        // If their health is 0, their ability is consumed
        aircraftCarrierHealth: 0,
        battleshipHealth: 0,

        // When the ability is used, this is the number of shots that can be fired
        aircraftCarrierShots: 0,

        hasCurrentTurn: false,
        hasWonTheGame: false,
        board: [[]],
    },

};

const mutations = {
    [Mutation.SET_GAME_IS_IN_PROGRESS](state: RootState, isInProgress: boolean) {
        state.game.isInProgress = isInProgress;
    },
    [Mutation.SET_GAME_MAP_NAME](state: RootState, mapName: MapName) {
        state.game.mapName = mapName;
    },

    [Mutation.SET_GUI_SUBMARINE_COUNT](state: RootState, count: number) {
        state.gui.submarineCount = count;
    },
    [Mutation.SET_GUI_SUPPLY_BOAT_COUNT](state: RootState, count: number) {
        state.gui.supplyBoatCount = count;
    },
    [Mutation.SET_GUI_DESTROYER_COUNT](state: RootState, count: number) {
        state.gui.destroyerCount = count;
    },
    [Mutation.SET_GUI_BATTLESHIP_COUNT](state: RootState, count: number) {
        state.gui.battleshipCount = count;
    },
    [Mutation.SET_GUI_FRIGATE_COUNT](state: RootState, count: number) {
        state.gui.frigateCount = count;
    },
    [Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT](state: RootState, count: number) {
        state.gui.aircraftCarrierCount = count;
    },

    [Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY](state: RootState, isUsingSubmarineAbility: boolean) {
        state.player.isUsingSubmarineAbility = isUsingSubmarineAbility;
    },
    [Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY](state: RootState, isUsingAircraftCarrierAbility: boolean) {
        state.player.isUsingAircraftCarrierAbility = isUsingAircraftCarrierAbility;
    },
    [Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY](state: RootState, isUsingBattleShipAbility: boolean) {
        state.player.isUsingBattleshipAbility = isUsingBattleShipAbility;
    },

    [Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY](state: RootState, hasUsedSubmarineAbility: boolean) {
        state.player.hasUsedSubmarineAbility = hasUsedSubmarineAbility;
    },
    [Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY](state: RootState, hasUsedAircraftCarrierAbility: boolean) {
        state.player.hasUsedAircraftCarrierAbility = hasUsedAircraftCarrierAbility;
    },
    [Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY](state: RootState, hasUsedBattleShipAbility: boolean) {
        state.player.hasUsedBattleshipAbility = hasUsedBattleShipAbility;
    },

    [Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH](state: RootState, health: number) {
        state.player.aircraftCarrierHealth = health;
    },
    [Mutation.SET_PLAYER_BATTLESHIP_HEALTH](state: RootState, health: number) {
        state.player.battleshipHealth = health;
    },

    [Mutation.SET_PLAYER_AIRCRAFT_CARRIER_SHOTS](state: RootState, shots: number) {
        state.player.aircraftCarrierShots = shots;
    },

    [Mutation.SET_PLAYER_HAS_CURRENT_TURN](state: RootState, hasCurrentTurn: boolean) {
        state.player.hasCurrentTurn = hasCurrentTurn;
    },
    [Mutation.SET_PLAYER_HAS_WON_THE_GAME](state: RootState, hasWonTheGame: boolean) {
        state.player.hasWonTheGame = hasWonTheGame;
    },

    [Mutation.SET_PLAYER_BOARD](state: RootState, board: Tile[][]) {
        state.player.board = board;
    },
    [Mutation.SET_PLAYER_TILE](state: RootState, { row, col, tile }: { row: number, col: number, tile: Tile }) {
        state.player.board[row][col] = tile;
    },

    [Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY](state: RootState, isUsingSubmarineAbility: boolean) {
        state.computer.isUsingSubmarineAbility = isUsingSubmarineAbility;
    },
    [Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY](state: RootState, isUsingAircraftCarrierAbility: boolean) {
        state.computer.isUsingAircraftCarrierAbility = isUsingAircraftCarrierAbility;
    },
    [Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY](state: RootState, isUsingBattleShipAbility: boolean) {
        state.computer.isUsingBattleshipAbility = isUsingBattleShipAbility;
    },

    [Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY](state: RootState, hasUsedSubmarineAbility: boolean) {
        state.computer.hasUsedSubmarineAbility = hasUsedSubmarineAbility;
    },
    [Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY](state: RootState, hasUsedAircraftCarrierAbility: boolean) {
        state.computer.hasUsedAircraftCarrierAbility = hasUsedAircraftCarrierAbility;
    },
    [Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY](state: RootState, hasUsedBattleShipAbility: boolean) {
        state.computer.hasUsedBattleshipAbility = hasUsedBattleShipAbility;
    },

    [Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH](state: RootState, health: number) {
        state.computer.aircraftCarrierHealth = health;
    },
    [Mutation.SET_COMPUTER_BATTLESHIP_HEALTH](state: RootState, health: number) {
        state.computer.battleshipHealth = health;
    },

    [Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_SHOTS](state: RootState, shots: number) {
        state.computer.aircraftCarrierShots = shots;
    },

    [Mutation.SET_COMPUTER_HAS_CURRENT_TURN](state: RootState, hasCurrentTurn: boolean) {
        state.computer.hasCurrentTurn = hasCurrentTurn;
    },
    [Mutation.SET_COMPUTER_HAS_WON_THE_GAME](state: RootState, hasWonTheGame: boolean) {
        state.computer.hasWonTheGame = hasWonTheGame;
    },

    [Mutation.SET_COMPUTER_BOARD](state: RootState, board: Tile[][]) {
        state.computer.board = board;
    },
    [Mutation.SET_COMPUTER_TILE](state: RootState, { row, col, tile }: { row: number, col: number, tile: Tile }) {
        state.computer.board[row][col] = tile;
    },
};

const store = createStore<RootState>({
    state,
    mutations,

    /**
     * This plugin will automatically save the state to localStorage,
     * as well as automatically load the state from localStorage on page load.
     */
    plugins: [createPersistedState()],
});

export default store;
