import { defineStore } from 'pinia';
import { RootState, Tile } from '@/utils/Interfaces';
import { ShipName, Orientation } from '@/utils/Enums';
import { SHIPS } from '@/utils/Constants';

export const useStore = defineStore({
    id: 'rootStore',
    persist: {
        debug: true,
    },
    state: (): RootState => ({
        player: {
            [ShipName.SUBMARINE]: {
                guiCount: SHIPS[ShipName.SUBMARINE].count,
                isUsingAbility: false,
                hasUsedAbility: false,
            },
            [ShipName.SUPPLY_BOAT]: {
                guiCount: SHIPS[ShipName.SUPPLY_BOAT].count,
            },
            [ShipName.DESTROYER]: {
                guiCount: SHIPS[ShipName.DESTROYER].count,
            },
            [ShipName.BATTLESHIP]: {
                guiCount: SHIPS[ShipName.BATTLESHIP].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.BATTLESHIP].health,
            },
            [ShipName.FRIGATE]: {
                guiCount: SHIPS[ShipName.FRIGATE].count,
            },
            [ShipName.AIRCRAFT_CARRIER]: {
                guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.AIRCRAFT_CARRIER].health,
                shots: SHIPS[ShipName.AIRCRAFT_CARRIER].shots,
            },
            isMakingMove: false,
            hasCurrentTurn: false,
            board: [[]],
        },
        computer: {
            [ShipName.SUBMARINE]: {
                guiCount: SHIPS[ShipName.SUBMARINE].count,
                isUsingAbility: false,
                hasUsedAbility: false,
            },
            [ShipName.SUPPLY_BOAT]: {
                guiCount: SHIPS[ShipName.SUPPLY_BOAT].count,
            },
            [ShipName.DESTROYER]: {
                guiCount: SHIPS[ShipName.DESTROYER].count,
            },
            [ShipName.BATTLESHIP]: {
                guiCount: SHIPS[ShipName.BATTLESHIP].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.BATTLESHIP].health,
            },
            [ShipName.FRIGATE]: {
                guiCount: SHIPS[ShipName.FRIGATE].count,
            },
            [ShipName.AIRCRAFT_CARRIER]: {
                guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.AIRCRAFT_CARRIER].health,
                shots: SHIPS[ShipName.AIRCRAFT_CARRIER].shots,
            },
            isMakingMove: false,
            hasCurrentTurn: false,
            board: [[]],
        },
        currentlyDraggedShip: undefined,
    }),
    actions: {

        setCurrentlyDraggedShip(shipName: ShipName, shipOrientation: Orientation) {
            this.$patch({
                currentlyDraggedShip: {
                    name: shipName,
                    orientation: shipOrientation,
                },
            });
        },

        // Player
        setPlayerShipGUICount(shipName: ShipName, guiCount: number) {
            this.$patch({ player: { [shipName]: { guiCount: guiCount } } });
        },
        setPlayerShipIsUsingAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, isUsingAbility: boolean) {
            this.$patch({ player: { [shipName]: { isUsingAbility: isUsingAbility } } });
        },
        setPlayerShipHasUsedAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, hasUsedAbility: boolean) {
            this.$patch({ player: { [shipName]: { hasUsedAbility: hasUsedAbility } } });
        },
        setPlayerShipHealth(shipName: ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, health: number) {
            this.$patch({ player: { [shipName]: { health: health } } });
        },
        setPlayerAircraftCarrierShots(shots: number) {
            this.$patch({ player: { [ShipName.AIRCRAFT_CARRIER]: { shots: shots } } });
        },
        setPlayerIsMakingMove(isMakingMove: boolean) {
            this.$patch({ player: { isMakingMove: isMakingMove } });
        },
        setPlayerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.$patch({ player: { hasCurrentTurn: hasCurrentTurn } });
        },
        setPlayerBoard(board: ReadonlyArray<ReadonlyArray<Tile>>) {
            const newBoard = JSON.parse(JSON.stringify(board));
            this.$patch({ player: { board: newBoard } });
        },

        // Computer
        setComputerShipGUICount(shipName: ShipName, guiCount: number) {
            this.$patch({ computer: { [shipName]: { guiCount: guiCount } } });
        },
        setComputerShipIsUsingAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, isUsingAbility: boolean) {
            this.$patch({ computer: { [shipName]: { isUsingAbility: isUsingAbility } } });
        },
        setComputerShipHasUsedAbility(shipName: ShipName.SUBMARINE | ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, hasUsedAbility: boolean) {
            this.$patch({ computer: { [shipName]: { hasUsedAbility: hasUsedAbility } } });
        },
        setComputerShipHealth(shipName: ShipName.BATTLESHIP | ShipName.AIRCRAFT_CARRIER, health: number) {
            this.$patch({ computer: { [shipName]: { health: health } } });
        },
        setComputerAircraftCarrierShots(shots: number) {
            this.$patch({ computer: { [ShipName.AIRCRAFT_CARRIER]: { shots: shots } } });
        },
        setComputerIsMakingMove(isMakingMove: boolean) {
            this.$patch({ computer: { isMakingMove: isMakingMove } });
        },
        setComputerHasCurrentTurn(hasCurrentTurn: boolean) {
            this.$patch({ computer: { hasCurrentTurn: hasCurrentTurn } });
        },
        setComputerBoard(board: ReadonlyArray<ReadonlyArray<Tile>>) {
            const newBoard = JSON.parse(JSON.stringify(board));
            this.$patch({ computer: { board: newBoard } });
        },

        recalculateShipsHealth() {

            // Set all ships health to default, as we are going to recalculate it
            this.setPlayerShipHealth(ShipName.BATTLESHIP, SHIPS[ShipName.BATTLESHIP].health);
            this.setPlayerShipHealth(ShipName.AIRCRAFT_CARRIER, SHIPS[ShipName.AIRCRAFT_CARRIER].health);
            this.setComputerShipHealth(ShipName.BATTLESHIP, SHIPS[ShipName.BATTLESHIP].health);
            this.setComputerShipHealth(ShipName.AIRCRAFT_CARRIER, SHIPS[ShipName.AIRCRAFT_CARRIER].health);

            // Player Board
            for (const row of this.player.board) {
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
            for (const row of this.computer.board) {
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
            for (const row of this.player.board) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot && tile.shipHitbox === ShipName.SUBMARINE) {
                        this.setPlayerShipHasUsedAbility(ShipName.SUBMARINE, true);
                    }
                }
            }

            // Computer Board
            for (const row of this.computer.board) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot && tile.shipHitbox === ShipName.SUBMARINE) {
                        this.setComputerShipHasUsedAbility(ShipName.SUBMARINE, true);
                    }
                }
            }

        },

    },
});