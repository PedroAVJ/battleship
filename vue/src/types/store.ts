export interface RootState {
    difficulty: '' | 'easy' | 'medium' | 'hard';
    map: '' | 'map1' | 'map2' | 'map3';
    supplyBoatCount: number;
    destroyerCount: number;
    battleshipCount: number;
    frigateCount: number;
    hasUsedAircraftCarrierAbility: boolean;
    hasUsedSubmarineAbility: boolean;

    // The board is a matrix consisting of numbers representing the type of tile.
    // 0 = water
    // 1 = land
    // 2 = miss
    // 3 = hit
    // 4 = uncovered ship
    // 5 = ship
    enemyBoard: number[][];
    playerBoard: number[][];

    // The player's ships are represented by an array of objects representing the ship's position and orientation.
    ships: {
        type: 'supplyBoat' | 'destroyer' | 'battleship' | 'frigate' | 'aircraftCarrier' | 'submarine';
        orientation: 'N' | 'E' | 'S' | 'W';
        position: {
            x: number;
            y: number;
        };
    }[];
}
