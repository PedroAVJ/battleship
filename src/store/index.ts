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
        setPlayerSubmarineGUICount(submarineGUICount: number) {
            this.player[ShipName.SUBMARINE].guiCount = submarineCount;
        },
        setGuiSupplyBoatCount(supplyBoatCount: number) {
            this.gui[ShipName.SUPPLY_BOAT].count = supplyBoatCount;
        },
        setGuiDestroyerCount(destroyerCount: number) {
            this.gui[ShipName.DESTROYER].count = destroyerCount;
        },
        setGuiBattleshipCount(battleshipCount: number) {
            this.gui[ShipName.BATTLESHIP].count = battleshipCount;
        },
        setGuiFrigateCount(frigateCount: number) {
            this.gui[ShipName.FRIGATE].count = frigateCount;
        },
        setGuiAircraftCarrierCount(aircraftCarrierCount: number) {
            this.gui[ShipName.AIRCRAFT_CARRIER].count = aircraftCarrierCount;
        },

        // Player
        setPlayerSubmarineIsUsingAbility(isUsingAbility: boolean) {
            this.player[ShipName.SUBMARINE].isUsingAbility = isUsingAbility;
        },
        setPlayerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
            this.player[ShipName.SUBMARINE].hasUsedAbility = hasUsedAbility;
        },
        setPlayerBattleshipIsUsingAbility(isUsingAbility: boolean) {
            this.player[ShipName.BATTLESHIP].isUsingAbility = isUsingAbility;
        },
        setPlayerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
            this.player[ShipName.BATTLESHIP].hasUsedAbility = hasUsedAbility;
        },
        setPlayerBattleshipHealth(health: number) {
            this.player[ShipName.BATTLESHIP].health = health;
        },
        setPlayerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
            this.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility = isUsingAbility;
        },
        setPlayerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
            this.player[ShipName.AIRCRAFT_CARRIER].hasUsedAbility = hasUsedAbility;
        },
        setPlayerAircraftCarrierHealth(health: number) {
            this.player[ShipName.AIRCRAFT_CARRIER].health = health;
        },
        setPlayerAircraftCarrierShots(shots: number) {
            this.player[ShipName.AIRCRAFT_CARRIER].shots = shots;
        },
        setPlayerIsMoveInProgress(isMoveInProgress: boolean) {
            this.player.isMoveInProgress = isMoveInProgress;
        },
        setPlayerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.player.hasCurrentTurn = hasCurrentTurn;
        },
        setPlayerBoardTiles(board: Tile[][]) {
            this.player.board.tiles = board;
        },

        // Computer
        setComputerSubmarineIsUsingAbility(isUsingAbility: boolean) {
            this.computer[ShipName.SUBMARINE].isUsingAbility = isUsingAbility;
        },
        setComputerSubmarineHasUsedAbility(hasUsedAbility: boolean) {
            this.computer[ShipName.SUBMARINE].hasUsedAbility = hasUsedAbility;
        },
        setComputerBattleshipIsUsingAbility(isUsingAbility: boolean) {
            this.computer[ShipName.BATTLESHIP].isUsingAbility = isUsingAbility;
        },
        setComputerBattleshipHasUsedAbility(hasUsedAbility: boolean) {
            this.computer[ShipName.BATTLESHIP].hasUsedAbility = hasUsedAbility;
        },
        setComputerBattleshipHealth(health: number) {
            this.computer[ShipName.BATTLESHIP].health = health;
        },
        setComputerAircraftCarrierIsUsingAbility(isUsingAbility: boolean) {
            this.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility = isUsingAbility;
        },
        setComputerAircraftCarrierHasUsedAbility(hasUsedAbility: boolean) {
            this.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility = hasUsedAbility;
        },
        setComputerAircraftCarrierHealth(health: number) {
            this.computer[ShipName.AIRCRAFT_CARRIER].health = health;
        },
        setComputerAircraftCarrierShots(shots: number) {
            this.computer[ShipName.AIRCRAFT_CARRIER].shots = shots;
        },
        setComputerIsMoveInProgress(isMoveInProgress: boolean) {
            this.computer.isMoveInProgress = isMoveInProgress;
        },
        setComputerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.computer.hasCurrentTurn = hasCurrentTurn;
        },
        setComputerBoardTiles(board: Tile[][]) {
            this.computer.board.tiles = board;
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
        },

        substractPlayerShipsHealth() {
            this.setPlayerBattleshipHealth(4);
            this.setPlayerAircraftCarrierHealth(10);

            for (const row of this.player.board.tiles) {
                for (const tile of row) {
                    if (tile.ship && tile.contains.successfulShot) {
                        if (tile.ship.name === ShipName.BATTLESHIP) {
                            this.setPlayerBattleshipHealth(this.player.[ShipName.BATTLESHIP].health - 1);
                        } else if (tile.ship.name === ShipName.AIRCRAFT_CARRIER) {
                            this.setPlayerAircraftCarrierHealth(this.player.[ShipName.AIRCRAFT_CARRIER].health - 1);
                        } else if (tile.ship.name === ShipName.SUBMARINE) {
                            this.setPlayerSubmarineHasUsedAbility(true);
                        }
                    }
                }
            }

            if (this.player.[ShipName.BATTLESHIP].health === 0) {
                this.setPlayerBattleshipHasUsedAbility(true);
            } else if (this.player.[ShipName.AIRCRAFT_CARRIER].health === 0) {
                this.setPlayerAircraftCarrierHasUsedAbility(true);
            }
        },

        substractComputerShipsHealth() {
            this.setComputerBattleshipHealth(4);
            this.setComputerAircraftCarrierHealth(10);

            for (const row of this.computer.board.tiles) {
                for (const tile of row) {
                    if (tile.ship && tile.contains.successfulShot) {
                        if (tile.ship.name === ShipName.BATTLESHIP) {
                            this.setComputerBattleshipHealth(this.computer.[ShipName.BATTLESHIP].health - 1);
                        } else if (tile.ship.name === ShipName.AIRCRAFT_CARRIER) {
                            this.setComputerAircraftCarrierHealth(this.computer.[ShipName.AIRCRAFT_CARRIER].health - 1);
                        } else if (tile.ship.name === ShipName.SUBMARINE) {
                            this.setComputerSubmarineHasUsedAbility(true);
                        }
                    }
                }
            }

            if (this.computer.[ShipName.BATTLESHIP].health === 0) {
                this.setComputerBattleshipHasUsedAbility(true);
            } else if (this.computer.[ShipName.AIRCRAFT_CARRIER].health === 0) {
                this.setComputerAircraftCarrierHasUsedAbility(true);
            }
        }
    },
    persist: true,
});