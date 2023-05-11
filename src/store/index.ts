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
                health: SHIPS[ShipName.SUBMARINE].length * SHIPS[ShipName.SUBMARINE].width,
                isUsingAbility: false,
                hasUsedAbility: false,
            },
            [ShipName.SUPPLY_BOAT]: {
                guiCount: SHIPS[ShipName.SUPPLY_BOAT].count,
                health: SHIPS[ShipName.SUPPLY_BOAT].length * SHIPS[ShipName.SUPPLY_BOAT].width,
            },
            [ShipName.DESTROYER]: {
                guiCount: SHIPS[ShipName.DESTROYER].count,
                health: SHIPS[ShipName.DESTROYER].length * SHIPS[ShipName.DESTROYER].width,
            },
            [ShipName.BATTLESHIP]: {
                guiCount: SHIPS[ShipName.BATTLESHIP].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.BATTLESHIP].length * SHIPS[ShipName.BATTLESHIP].width,
            },
            [ShipName.FRIGATE]: {
                guiCount: SHIPS[ShipName.FRIGATE].count,
                health: SHIPS[ShipName.FRIGATE].length * SHIPS[ShipName.FRIGATE].width,
            },
            [ShipName.AIRCRAFT_CARRIER]: {
                guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.AIRCRAFT_CARRIER].length * SHIPS[ShipName.AIRCRAFT_CARRIER].width,
                shots: SHIPS[ShipName.AIRCRAFT_CARRIER].shots,
            },
            isMakingMove: false,
            hasCurrentTurn: false,
            board: [[]],
        },
        computer: {
            [ShipName.SUBMARINE]: {
                guiCount: SHIPS[ShipName.SUBMARINE].count,
                health: SHIPS[ShipName.SUBMARINE].length * SHIPS[ShipName.SUBMARINE].width,
                isUsingAbility: false,
                hasUsedAbility: false,
            },
            [ShipName.SUPPLY_BOAT]: {
                guiCount: SHIPS[ShipName.SUPPLY_BOAT].count,
                health: SHIPS[ShipName.SUPPLY_BOAT].length * SHIPS[ShipName.SUPPLY_BOAT].width,
            },
            [ShipName.DESTROYER]: {
                guiCount: SHIPS[ShipName.DESTROYER].count,
                health: SHIPS[ShipName.DESTROYER].length * SHIPS[ShipName.DESTROYER].width,
            },
            [ShipName.BATTLESHIP]: {
                guiCount: SHIPS[ShipName.BATTLESHIP].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.BATTLESHIP].length * SHIPS[ShipName.BATTLESHIP].width,
            },
            [ShipName.FRIGATE]: {
                guiCount: SHIPS[ShipName.FRIGATE].count,
                health: SHIPS[ShipName.FRIGATE].length * SHIPS[ShipName.FRIGATE].width,
            },
            [ShipName.AIRCRAFT_CARRIER]: {
                guiCount: SHIPS[ShipName.AIRCRAFT_CARRIER].count,
                isUsingAbility: false,
                hasUsedAbility: false,
                health: SHIPS[ShipName.AIRCRAFT_CARRIER].length * SHIPS[ShipName.AIRCRAFT_CARRIER].width,
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
        setPlayerShipHealth(shipName: ShipName, health: number) {
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
        setComputerShipHealth(shipName: ShipName, health: number) {
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
            const shipNames = Object.values(ShipName);
            for (const shipName of shipNames) {
                this.setPlayerShipHealth(shipName, SHIPS[shipName].length * SHIPS[shipName].width);
                this.setComputerShipHealth(shipName, SHIPS[shipName].length * SHIPS[shipName].width);
            }

            // Player Board
            for (const row of this.player.board) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot) {
                        this.setPlayerShipHealth(tile.shipHitbox, this.player[tile.shipHitbox].health - 1);
                    }
                }
            }

            // Computer Board
            for (const row of this.computer.board) {
                for (const tile of row) {
                    if (tile.shipHitbox && tile.contains.successfulShot) {
                        this.setComputerShipHealth(tile.shipHitbox, this.computer[tile.shipHitbox].health - 1);
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
            } else if (this.player[ShipName.SUBMARINE].health === 0) {
                this.setPlayerShipHasUsedAbility(ShipName.SUBMARINE, true);
            }
        },

    },
});