export interface RootState {

    // Metadata about the game configuration and state.
    map: MapType;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    hasUsedAircraftCarrierAbility: boolean;
    hasUsedSubmarineAbility: boolean;

    // The boards are a matrix of Tile enums.
    enemyBoard: Board;
    playerBoard: Board;

    ships: Ship[];
    gameInProgress: boolean;
}

export enum MapType {
    DEFAULT = '',
    MAP1 = 'map1',
    MAP2 = 'map2',
    MAP3 = 'map3',
}

export enum Tile {
    WATER = 0,
    LAND = 1,
    MISS = 2,
    HIT = 3,
    UNCOVERED_SHIP = 4,
    SHIP = 5,
}

export type Board = Tile[][];

export enum ShipType {
    SUPPLY_BOAT = 'supplyBoat',
    DESTROYER = 'destroyer',
    BATTLESHIP = 'battleship',
    FRIGATE = 'frigate',
    AIRCRAFT_CARRIER = 'aircraftCarrier',
    SUBMARINE = 'submarine',
}

export enum ShipOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export interface Ship {
    type: ShipType;
    orientation: ShipOrientation;
    x: number;
    y: number;
}