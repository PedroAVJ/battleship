export interface RootState {
  game: {
    isPlayersTurn: boolean;

    /** Id passed to the backend for recognizing the game */
    id: number;
    
    // Ship counts passed to the backend for ship placement
    submarineCount: number;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    aircraftCarrierCount: number;
  };

  /** Display the number of remaining ships to place */
  gui: {
    submarineCount: number;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    aircraftCarrierCount: number;
  };
  player: {

    // GUI changes during ability usage
    isUsingSubmarineAbility: boolean;
    isUsingAircraftCarrierAbility: boolean;

    // GUI changes after ability usage
    hasUsedSubmarineAbility: boolean;
    hasUsedAircraftCarrierAbility: boolean; 

    /** Sets hasUsedAircraftCarrierAbility to true when 0 */
    aircraftCarrierHealth: number;
    
    /**
     * WARNING: Use JSON.parse(JSON.stringify(board)) to get a deep copy,
     * as the nested Tile[][] can be mutated.
     */
    board: Tile[][];
  },
  enemy: {

    /**
     * WARNING: Use JSON.parse(JSON.stringify(board)) to get a deep copy,
     * as the nested Tile[][] can be mutated.
     */
    board: Tile[][];
  },
}

export interface Tile {
  background: {
    isWater: boolean;
    isLand: boolean;
  };
  contains: {
    missedShot: boolean;
    successfulShot: boolean;
    uncoveredShip: boolean;
  };

  ship?: {

    /** Represents a ship's hitbox when placed on the tile */
    name: ShipName;

    /** 
     * Indicates whether we should start drawing the ship from this tile.
     * If set, the ship will be drawn in the specified orientation
     */
    orientation?: Orientation;
  }
}

export enum ShipName {
  SUBMARINE = "submarine",
  SUPPLY_BOAT = "supplyBoat",
  DESTROYER = "destroyer",
  BATTLESHIP = "battleship",
  FRIGATE = "frigate",
  AIRCRAFT_CARRIER = "aircraftCarrier",
}

export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export const SHIP_DIMENSIONS = {
  [ShipName.SUBMARINE]: {
    length: 1,
    width: 1,
  },
  [ShipName.SUPPLY_BOAT]: {
    length: 2,
    width: 1,
  },
  [ShipName.DESTROYER]: {
    length: 3,
    width: 1,
  },
  [ShipName.BATTLESHIP]: {
    length: 4,
    width: 1,
  },
  [ShipName.FRIGATE]: {
    length: 5,
    width: 1,
  },
  [ShipName.AIRCRAFT_CARRIER]: {
    length: 5,
    width: 2,
  },
} as const;

export enum MapName {
  MAP1 = "map1",
  MAP2 = "map2",
  MAP3 = "map3",
}

export enum GetterType {
  PLAYER_BOARD = "playerBoard",
  ENEMY_BOARD = "enemyBoard",
}

export enum ActionType {
  INITIALIZE_BOARDS_BASED_ON_MAP_NAME = 'initializeBoardsBasedOnMapName',
}

export enum MutationType {
  SET_GAME_IS_PLAYERS_TURN = 'setGameIsPlayersTurn',
  SET_GAME_ID = 'setGameId',
  SET_GAME_SUBMARINE_COUNT = 'setGameSubmarineCount',
  SET_GAME_SUPPLY_BOAT_COUNT = 'setGameSupplyBoatCount',
  SET_GAME_DESTROYER_COUNT = 'setGameDestroyerCount',
  SET_GAME_BATTLESHIP_COUNT = 'setGameBattleshipCount',
  SET_GAME_FRIGATE_COUNT = 'setGameFrigateCount',
  SET_GAME_AIRCRAFT_CARRIER_COUNT = 'setGameAircraftCarrierCount',
  SET_GUI_SUBMARINE_COUNT = 'setGuiSubmarineCount',
  SET_GUI_SUPPLY_BOAT_COUNT = 'setGuiSupplyBoatCount',
  SET_GUI_DESTROYER_COUNT = 'setGuiDestroyerCount',
  SET_GUI_BATTLESHIP_COUNT = 'setGuiBattleshipCount',
  SET_GUI_FRIGATE_COUNT = 'setGuiFrigateCount',
  SET_GUI_AIRCRAFT_CARRIER_COUNT = 'setGuiAircraftCarrierCount',
  SET_PLAYER_IS_USING_SUBMARINE_ABILITY = 'setPlayerIsUsingSubmarineAbility',
  SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY = 'setPlayerIsUsingAircraftCarrierAbility',
  SET_PLAYER_HAS_USED_SUBMARINE_ABILITY = 'setPlayerHasUsedSubmarineAbility',
  SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY = 'setPlayerHasUsedAircraftCarrierAbility',
  SET_AIRCRAFT_CARRIER_HEALTH = 'setAircraftCarrierHealth',
  SET_PLAYER_BOARD = 'setPlayerBoard',
  SET_ENEMY_BOARD = 'setEnemyBoard',
}

// Water Tile (_): see MAPS for context
const _: Tile = {
  background: {
    isWater: true,
    isLand: false,
  },
  contains: {
    missedShot: false,
    successfulShot: false,
    uncoveredShip: false,
  },
};

// Land Tile (M): see MAPS for context
const M: Tile = {
  background: {
    isWater: false,
    isLand: true,
  },
  contains: {
    missedShot: false,
    successfulShot: false,
    uncoveredShip: false,
  },
};

// Map design:
// M represents land, _ represents water.
// This format achieves an optimal height-to-width ratio on the screen.
// Using '.' for water and '#' for land in nested lists was too wide.
// Using strings like '..#..#..#.' for each row was too tall.
/**
 * WARNING: Use JSON.parse(JSON.stringify(board)) to get a deep copy,
 * as the nested Tile[][] can be mutated.
 */
export const MAPS = {
  [MapName.MAP1]: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
  [MapName.MAP2]: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
  [MapName.MAP3]: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
} as const;