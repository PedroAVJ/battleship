import { defineStore } from 'pinia';
import RootState from '@/types/RootState';
import Ship from '@/types/Ship';
import Tile from '@/types/Tile';
import SHIPS from '@/constants/Ships';
import ShipName from '@/types/ShipName';


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
        setComputerAircraftCarrierShots(shots: number) {
            this.computer.aircraftCarrier.shots = shots;
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

        // Currently dragged ship
        setCurrentlyDraggedShip(ship: Ship) {
            this.currentlyDraggedShip = ship;
        },

        // Reset
        resetState() {
            this.$state = new RootState();
        },

        // Initialize GUI counts
        initializeGuiCounts() {
            this.gui.submarineCount = SHIPS[ShipName.SUBMARINE].count;
            this.gui.supplyBoatCount = SHIPS[ShipName.SUPPLY_BOAT].count;
            this.gui.destroyerCount = SHIPS[ShipName.DESTROYER].count;
            this.gui.battleshipCount = SHIPS[ShipName.BATTLESHIP].count;
            this.gui.frigateCount = SHIPS[ShipName.FRIGATE].count;
            this.gui.aircraftCarrierCount = SHIPS[ShipName.AIRCRAFT_CARRIER].count;
        },

        // Start game
        startGame() {

            // Player abilities
            this.setPlayerSubmarineIsUsingAbility(false);
            this.setPlayerSubmarineHasUsedAbility(false);
            this.setPlayerBattleshipIsUsingAbility(false);
            this.setPlayerBattleshipHasUsedAbility(false);
            this.setPlayerBattleshipHealth(4);
            this.setPlayerAircraftCarrierIsUsingAbility(false);
            this.setPlayerAircraftCarrierHasUsedAbility(false);
            this.setPlayerAircraftCarrierHealth(10);
            this.setPlayerAircraftCarrierShots(3);

            // Computer abilities
            this.setComputerSubmarineIsUsingAbility(false);
            this.setComputerSubmarineHasUsedAbility(false);
            this.setComputerBattleshipIsUsingAbility(false);
            this.setComputerBattleshipHasUsedAbility(false);
            this.setComputerBattleshipHealth(4);
            this.setComputerAircraftCarrierIsUsingAbility(false);
            this.setComputerAircraftCarrierHasUsedAbility(false);
            this.setComputerAircraftCarrierHealth(10);
            this.setComputerAircraftCarrierShots(3);

            this.setPlayerIsMoveInProgress(false);
            this.setComputerIsMoveInProgress(false);

            // The player makes the first move
            this.setPlayerHasCurrentTurn(true);
            this.setComputerHasCurrentTurn(false);
        }
    },
    persist: true,
});