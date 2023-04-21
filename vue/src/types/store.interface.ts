export interface RootState {
  map: Map;
  is_game_in_progress: boolean;
  game_ship_counts: ShipCounts;
  gui_ship_counts: ShipCounts;
  has_used_aircraft_carrier_ability: boolean;
  has_used_submarine_ability: boolean;
  enemy_board: Board;
  player_board: Board;
}

export interface ShipCounts {
  submarine_count: number;
  supply_boat_count: number;
  destroyer_count: number;
  battleship_count: number;
  frigate_count: number;
  aircraft_carrier_count: number;
}

export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export const SHIPS = {
  submarine: { name: "submarine", length: 1 },
  supply_boat: { name: "supply_boat", length: 2 },
  destroyer: { name: "destroyer", length: 3 },
  battleship: { name: "battleship", length: 4 },
  frigate: { name: "frigate", length: 5 },
  aircraft_carrier: { name: "aircraft_carrier", length: 6 },
} as const;

export type Ship = typeof SHIPS[keyof typeof SHIPS];

export interface Cell {
  is_water: boolean;
  is_land: boolean;
  was_missed: boolean;
  was_hit: boolean;
  has_uncovered_ship: boolean;
  has_ship_hitbox: boolean;

  /**
   * We use this to determine where to start drawing the ship sprite
   */
  ship?: Ship;
  ship_orientation?: Orientation;
}

export type Board = Cell[][];


// 
export type Map = typeof MAPS[keyof typeof MAPS];

const _: Cell = {
  is_water: true,

  is_land: false,
  was_missed: false,
  was_hit: false,
  has_uncovered_ship: false,
  has_ship_hitbox: false,
};

const M: Cell = {
  is_land: true,

  is_water: false,
  was_missed: false,
  was_hit: false,
  has_uncovered_ship: false,
  has_ship_hitbox: false,
};

/**
 * Stringify and parse the map to make a deep copy
 */
export const MAPS = {
  MAP1: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
  MAP2: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
  MAP3: [
    [_, _, _, _, _, _, _, _, _, _],
    [_, M, M, M, M, M, M, M, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, _, _, M, _, M, _],
    [_, M, _, M, M, M, M, _, M, _],
    [_, M, _, _, _, _, _, _, M, _],
    [_, M, M, M, M, M, M, M, M, _],
  ],
} as const;