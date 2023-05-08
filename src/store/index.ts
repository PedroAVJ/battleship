import { defineStore } from 'pinia';
import RootState from '@/types/RootState';
import Orientation from '@/types/Orientation';
import SHIPS from '@/constants/Ships';
import ShipName from '@/types/ShipName';
import Tile from '@/types/Tile';
import User from '@/types/User';
import Board from '@/types/Board';


export const useStore = defineStore({

    // This saves the store in the localStorage automatically
    persist: true,

    id: 'rootStore',
    state: (): RootState => ({
        player: new User(),
        computer: new User(),
    }),
    actions: {

        setCurrentlyDraggedShip(shipName: ShipName, shipOrientation: Orientation) {
            this.currentlyDraggedShip = {
                name: shipName,
                orientation: shipOrientation,
            }
        },

        // Player
        setPlayerShipGUICount(shipName: ShipName, guiCount: number) {
            this.player[shipName].guiCount = guiCount;
        },
        setPlayerShipIsUsingAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, isUsingAbility: boolean) {
            this.player[shipName].isUsingAbility = isUsingAbility;
        },
        setPlayerShipHasUsedAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, hasUsedAbility: boolean) {
            this.player[shipName].hasUsedAbility = hasUsedAbility;
        },
        setPlayerShipHealth(shipName: ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, health: number) {
            this.player[shipName].health = health;
        },
        setPlayerAircraftCarrierShots(shots: number) {
            this.player[ShipName.AIRCRAFT_CARRIER].shots = shots;
        },
        setPlayerIsMakingMove(isMakingMove: boolean) {
            this.player.isMakingMove = isMakingMove;
        },
        setPlayerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.player.hasCurrentTurn = hasCurrentTurn;
        },
        setPlayerBoardTiles(tiles: Tile[][]) {
            let board = []
            for (let row of tiles) {
                let boardRow = []
                for (let tile of row) {
                    let boardTile = new Tile(tile.background, tile.contains)
                    boardRow.push(boardTile)
                }
                board.push(boardRow)
            }
            this.player.board = new Board(board);
        },

        // Computer
        setComputerShipGUICount(shipName: ShipName, guiCount: number) {
            this.computer[shipName].guiCount = guiCount;
        },
        setComputerShipIsUsingAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, isUsingAbility: boolean) {
            this.computer[shipName].isUsingAbility = isUsingAbility;
        },
        setComputerShipHasUsedAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, hasUsedAbility: boolean) {
            this.computer[shipName].hasUsedAbility = hasUsedAbility;
        },
        setComputerShipHealth(shipName: ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, health: number) {
            this.computer[shipName].health = health;
        },
        setComputerAircraftCarrierShots(shots: number) {
            this.computer[ShipName.AIRCRAFT_CARRIER].shots = shots;
        },
        setComputerIsMakingMove(isMakingMove: boolean) {
            this.computer.isMakingMove = isMakingMove;
        },
        setComputerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.computer.hasCurrentTurn = hasCurrentTurn;
        },
        setComputerBoardTiles(tiles: Tile[][]) {
            let board = []
            for (let row of tiles) {
                let boardRow = []
                for (let tile of row) {
                    let boardTile = new Tile(tile.background, tile.contains)
                    boardRow.push(boardTile)
                }
                board.push(boardRow)
            }
            this.computer.board = new Board(board);
        },

        recalculateShipsHealth() {

            // Set all ships health to default, as we are going to recalculate it
            this.setPlayerShipHealth(ShipName.BATTLESHIP, SHIPS[ShipName.BATTLESHIP].health);
            this.setPlayerShipHealth(ShipName.AIRCRAFT_CARRIER, SHIPS[ShipName.AIRCRAFT_CARRIER].health);
            this.setComputerShipHealth(ShipName.BATTLESHIP, SHIPS[ShipName.BATTLESHIP].health);
            this.setComputerShipHealth(ShipName.AIRCRAFT_CARRIER, SHIPS[ShipName.AIRCRAFT_CARRIER].health);

            // Player Board
            for (const row of this.player.board.tiles) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot) {
                        if (tile.shipHitbox === ShipName.BATTLESHIP) {
                            this.setPlayerShipHealth(ShipName.BATTLESHIP, this.player[ShipName.BATTLESHIP].health - 1);
                        } else if (tile.shipHitbox === ShipName.AIRCRAFT_CARRIER) {
                            this.setPlayerShipHealth(ShipName.AIRCRAFT_CARRIER, this.player[ShipName.AIRCRAFT_CARRIER].health - 1);
                        }
                    }
                }
            }

            // Computer Board
            for (const row of this.computer.board.tiles) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot) {
                        if (tile.shipHitbox === ShipName.BATTLESHIP) {
                            this.setComputerShipHealth(ShipName.BATTLESHIP, this.computer[ShipName.BATTLESHIP].health - 1);
                        } else if (tile.shipHitbox === ShipName.AIRCRAFT_CARRIER) {
                            this.setComputerShipHealth(ShipName.AIRCRAFT_CARRIER, this.computer[ShipName.AIRCRAFT_CARRIER].health - 1);
                        }
                    }
                }
            }

            this.useAbilitiesIfShipsAreSunk();
        },

        useAbilitiesIfShipsAreSunk() {
            if (this.player[ShipName.BATTLESHIP].health === 0) {
                this.setPlayerShipHasUsedAbility(ShipName.BATTLESHIP, true);
            } else if (this.player[ShipName.AIRCRAFT_CARRIER].health === 0) {
                this.setPlayerShipHasUsedAbility(ShipName.AIRCRAFT_CARRIER, true);
            }

            // Manually check if the submarine has been hit, as it has a health of 1

            // Player Board
            for (const row of this.player.board.tiles) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot && tile.shipHitbox === ShipName.SUBMARINE) {
                        this.setPlayerShipHasUsedAbility(ShipName.SUBMARINE, true);
                    }
                }
            }

            // Computer Board
            for (const row of this.computer.board.tiles) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot && tile.shipHitbox === ShipName.SUBMARINE) {
                        this.setComputerShipHasUsedAbility(ShipName.SUBMARINE, true);
                    }
                }
            }

        },

    },
});