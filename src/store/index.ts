import { defineStore } from 'pinia';
import RootState from '@/types/RootState';
import Ship from '@/types/Ship';
import Tile from '@/types/Tile';


const state = new RootState();

const actions = {
    
    // GUI
    setGuiSubmarineCount(submarineCount: number) {
        state.gui.submarineCount = submarineCount;
    },
    setGuiSupplyBoatCount(supplyBoatCount: number) {
        state.gui.supplyBoatCount = supplyBoatCount;
    },
    setGuiDestroyerCount(destroyerCount: number) {
        state.gui.destroyerCount = destroyerCount;
    },
    setGuiBattleshipCount(battleshipCount: number) {
        state.gui.battleshipCount = battleshipCount;
    },
    setGuiFrigateCount(frigateCount: number) {
        state.gui.frigateCount = frigateCount;
    },
    setGuiAircraftCarrierCount(aircraftCarrierCount: number) {
        state.gui.aircraftCarrierCount = aircraftCarrierCount;
    },

    // Player
    setPlayerSubmarineIsUsingAbility(isUsingAbility: boolean) {
        state.player.submarine.isUsingAbility = isUsingAbility;
    },
    setPlayerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
        state.player.submarine.hasUsedAbility = hasUsedAbility;
    },
    setPlayerBattleshipIsUsingAbility(isUsingAbility: boolean) {
        state.player.battleship.isUsingAbility = isUsingAbility;
    },
    setPlayerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
        state.player.battleship.hasUsedAbility = hasUsedAbility;
    },
    setPlayerBattleshipHealth(health: number) {
        state.player.battleship.health = health;
    },
    setPlayerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
        state.player.aircraftCarrier.isUsingAbility = isUsingAbility;
    },
    setPlayerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
        state.player.aircraftCarrier.hasUsedAbility = hasUsedAbility;
    },
    setPlayerAircraftCarrierHealth(health: number) {
        state.player.aircraftCarrier.health = health;
    },
    setPlayerAircraftCarrierShots(shots: number) {
        state.player.aircraftCarrier.shots = shots;
    },
    setPlayerIsMoveInProgress(isMoveInProgress: boolean) {
        state.player.isMoveInProgress = isMoveInProgress;
    },
    setPlayerHasCurrentTurn(hasCurrentTurn: boolean) {
        state.player.hasCurrentTurn = hasCurrentTurn;
    },
    setPlayerBoard(board: Tile[][]) {
        state.player.board = board;
    },

    // Computer
    setComputerSubmarineIsUsingAbility(isUsingAbility: boolean) {
        state.computer.submarine.isUsingAbility = isUsingAbility;
    },
    setComputerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
        state.computer.submarine.hasUsedAbility = hasUsedAbility;
    },
    setComputerBattleshipIsUsingAbility(isUsingAbility: boolean) {
        state.computer.battleship.isUsingAbility = isUsingAbility;
    },
    setComputerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
        state.computer.battleship.hasUsedAbility = hasUsedAbility;
    },
    setComputerBattleshipHealth(health: number) {
        state.computer.battleship.health = health;
    },
    setComputerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
        state.computer.aircraftCarrier.isUsingAbility = isUsingAbility;
    },
    setComputerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
        state.computer.aircraftCarrier.hasUsedAbility = hasUsedAbility;
    },
    setComputerAircraftCarrierHealth(health: number) {
        state.computer.aircraftCarrier.health = health;
    },
    setComputerIsMoveInProgress(isMoveInProgress: boolean) {
        state.computer.isMoveInProgress = isMoveInProgress;
    },
    setComputerHasCurrentTurn(hasCurrentTurn: boolean) {
        state.computer.hasCurrentTurn = hasCurrentTurn;
    },
    setComputerBoard(board: Tile[][]) {
        state.computer.board = board;
    },

    // Ship Preview
    setShipPreview(ship: Ship) {
        state.shipPreview = ship;
    },
}

export const useStore = defineStore({
  // unique id of the store across your application
  id: 'rootStore',
  state: () => new RootState(),
  actions,
  persist: true,
});