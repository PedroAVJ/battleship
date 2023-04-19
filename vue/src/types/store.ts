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
    SUBMARINE = 'submarine',
    SUPPLY_BOAT = 'supplyBoat',
    DESTROYER = 'destroyer',
    BATTLESHIP = 'battleship',
    FRIGATE = 'frigate',
    AIRCRAFT_CARRIER = 'aircraftCarrier',
}

export enum Orientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export interface Ship {
    
    // Orientation, x, and y are optional because they are set in the game view
    type: ShipType;
    orientation?: Orientation;

    // The coordinates of the top-left corner of the ship.
    x?: number;
    y?: number;
}