export interface RootState {

    // Metadata about the game configuration and state.
    map: MapType;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    hasUsedAircraftCarrierAbility: boolean;
    hasUsedSubmarineAbility: boolean;
    gameInProgress: boolean;

    // The boards are a matrix of tiles or ships.
    enemyBoard: Board;
    playerBoard: Board;

    // This is to coordinate the state between the count of ships on tne GUI
    // and the event handler on the drop function in the cell
    guiSubmarineCount: number;
    guiSupplyBoatCount: number;
    guiDestroyerCount: number;
    guiBattleshipCount: number;
    guiFrigateCount: number;
    guiAircraftCarrierCount: number;
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
}

export type Board = (Tile | Ship)[][];

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
    type: ShipType;
    orientation: Orientation;
}