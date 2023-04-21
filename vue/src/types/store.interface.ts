export interface RootState {
  map: Tile[][];
  game: {
    isInProgress: boolean;
    isPlayersTurn: boolean;
    
    submarineCount: number;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    aircraftCarrierCount: number;
  };
  gui: {
    submarineCount: number;
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    aircraftCarrierCount: number;
  };
  player: {
    isUsingSubmarineAbility: boolean;
    isUsingAircraftCarrierAbility: boolean;

    hasUsedSubmarineAbility: boolean;
    hasUsedAircraftCarrierAbility: boolean;

    board: Tile[][];
  },
  enemy: { board: Tile[][]; },
}

export interface Tile {
  background: {
    isWater: boolean;
    isLand: boolean;
  };
  contains: {
    shipHitbox: boolean;
    missedShot: boolean;
    successfulShot: boolean;
    uncoveredShip: boolean;
  };

  /**
   * We use this to determine where to start drawing the ship sprite
   */
  ship?: {
    name: ShipName;
    length: number;
    orientation: Orientation;
  };
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

export const SHIP_LENGTHS = {
  submarine: 1,
  supplyBoat: 2,
  destroyer: 3,
  battleship: 4,
  frigate: 5,
  aircraftCarrier: 5,
} as const;

export enum MapName {
  MAP1 = "map1",
  MAP2 = "map2",
  MAP3 = "map3",
}


// Water Tile: Look at MAPS below for context on why this variable is named _
const _: Tile = {
  background: {
    isWater: true,
    isLand: false,
  },
  contains: {
    shipHitbox: false,
    missedShot: false,
    successfulShot: false,
    uncoveredShip: false,
  },
};

// Land Tile: Look at MAPS below for context on why this variable is named M
const M: Tile = {
  background: {
    isWater: false,
    isLand: true,
  },
  contains: {
    shipHitbox: false,
    missedShot: false,
    successfulShot: false,
    uncoveredShip: false,
  },
};


/**
 * WARNING: Stringify, parse and cast to Tile[][] before using,
 * as the nested Tile[][] can still be mutated.
 */
// This is were I draw and sketch out the maps
// M is land and _ is water
// This gave me the best ratio of height to width on my screen
// Using '.' for water and '#' for land inside nested lists was too wide
// Using strings on each line like this '..#..#..#.' was too tall
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
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
} as const;