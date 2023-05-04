import { defineStore } from 'pinia';
import RootState from '@/types/RootState';
import Ship from '@/types/Ship';
import Tile from '@/types/Tile';


export const useStore = defineStore({
    id: 'rootStore',
    state: () => new RootState(),
    actions: {

        // GUI
        setGuiSubmarineCount(submarineCount: number) {
            this.gui.submarineCount = submarineCount;
        },
        setGuiSupplyBoatCount(supplyBoatCount: number) {
            this.gui.supplyBoatCount = supplyBoatCount;
        },
        setGuiDestroyerCount(destroyerCount: number) {
            this.gui.destroyerCount = destroyerCount;
        },
        setGuiBattleshipCount(battleshipCount: number) {
            this.gui.battleshipCount = battleshipCount;
        },
        setGuiFrigateCount(frigateCount: number) {
            this.gui.frigateCount = frigateCount;
        },
        setGuiAircraftCarrierCount(aircraftCarrierCount: number) {
            this.gui.aircraftCarrierCount = aircraftCarrierCount;
        },

        // Player
        setPlayerSubmarineIsUsingAbility(isUsingAbility: boolean) {
            this.player.submarine.isUsingAbility = isUsingAbility;
        },
        setPlayerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
            this.player.submarine.hasUsedAbility = hasUsedAbility;
        },
        setPlayerBattleshipIsUsingAbility(isUsingAbility: boolean) {
            this.player.battleship.isUsingAbility = isUsingAbility;
        },
        setPlayerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
            this.player.battleship.hasUsedAbility = hasUsedAbility;
        },
        setPlayerBattleshipHealth(health: number) {
            this.player.battleship.health = health;
        },
        setPlayerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
            this.player.aircraftCarrier.isUsingAbility = isUsingAbility;
        },
        setPlayerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
            this.player.aircraftCarrier.hasUsedAbility = hasUsedAbility;
        },
        setPlayerAircraftCarrierHealth(health: number) {
            this.player.aircraftCarrier.health = health;
        },
        setPlayerAircraftCarrierShots(shots: number) {
            this.player.aircraftCarrier.shots = shots;
        },
        setPlayerIsMoveInProgress(isMoveInProgress: boolean) {
            this.player.isMoveInProgress = isMoveInProgress;
        },
        setPlayerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.player.hasCurrentTurn = hasCurrentTurn;
        },
        setPlayerBoard(board: Tile[][]) {
            this.player.board = board;
        },

        // Computer
        setComputerSubmarineIsUsingAbility(isUsingAbility: boolean) {
            this.computer.submarine.isUsingAbility = isUsingAbility;
        },
        setComputerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
            this.computer.submarine.hasUsedAbility = hasUsedAbility;
        },
        setComputerBattleshipIsUsingAbility(isUsingAbility: boolean) {
            this.computer.battleship.isUsingAbility = isUsingAbility;
        },
        setComputerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
            this.computer.battleship.hasUsedAbility = hasUsedAbility;
        },
        setComputerBattleshipHealth(health: number) {
            this.computer.battleship.health = health;
        },
        setComputerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
            this.computer.aircraftCarrier.isUsingAbility = isUsingAbility;
        },
        setComputerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
            this.computer.aircraftCarrier.hasUsedAbility = hasUsedAbility;
        },
        setComputerAircraftCarrierHealth(health: number) {
            this.computer.aircraftCarrier.health = health;
        },
        setComputerIsMoveInProgress(isMoveInProgress: boolean) {
            this.computer.isMoveInProgress = isMoveInProgress;
        },
        setComputerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.computer.hasCurrentTurn = hasCurrentTurn;
        },
        setComputerBoard(board: Tile[][]) {
            this.computer.board = board;
        },

        // Ship Preview
        setShipPreview(ship: Ship) {
            this.shipPreview = ship;
        },

    },
    persist: true,
});