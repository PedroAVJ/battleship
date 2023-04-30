export enum MapName {
    MAP1 = "map1",
    MAP2 = "map2",
    MAP3 = "map3",
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

/**
 * A more maintainable way to keep track of mutations.
 * Prevents typos and allows for easy refactoring.
 */
export enum Mutation {
    SET_GAME_IS_IN_PROGRESS = 'setGameIsInProgress',
    SET_GAME_MAP_NAME = 'setGameMapName',

    SET_GUI_SUBMARINE_COUNT = 'setGUISubmarineCount',
    SET_GUI_SUPPLY_BOAT_COUNT = 'setGUISupplyBoatCount',
    SET_GUI_DESTROYER_COUNT = 'setGUIDestroyerCount',
    SET_GUI_BATTLESHIP_COUNT = 'setGUIBattleshipCount',
    SET_GUI_FRIGATE_COUNT = 'setGUIFrigateCount',
    SET_GUI_AIRCRAFT_CARRIER_COUNT = 'setGUIAircraftCarrierCount',

    SET_PLAYER_IS_USING_SUBMARINE_ABILITY = 'setPlayerIsUsingSubmarineAbility',
    SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY = 'setPlayerIsUsingAircraftCarrierAbility',
    SET_PLAYER_IS_USING_BATTLESHIP_ABILITY = 'setPlayerIsUsingBattleShipAbility',

    SET_PLAYER_HAS_USED_SUBMARINE_ABILITY = 'setPlayerHasUsedSubmarineAbility',
    SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY = 'setPlayerHasUsedAircraftCarrierAbility',
    SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY = 'setPlayerHasUsedBattleShipAbility',

    SET_PLAYER_AIRCRAFT_CARRIER_HEALTH = 'setPlayerAircraftCarrierHealth',
    SET_PLAYER_BATTLESHIP_HEALTH = 'setPlayerBattleShipHealth',

    SET_PLAYER_HAS_CURRENT_TURN = 'setPlayerHasCurrentTurn',
    SET_PLAYER_HAS_WON_THE_GAME = 'setPlayerHasWonTheGame',

    SET_PLAYER_BOARD = 'setPlayerBoard',
    SET_PLAYER_TILE = 'setPlayerTile',

    SET_COMPUTER_IS_USING_SUBMARINE_ABILITY = 'setComputerIsUsingSubmarineAbility',
    SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY = 'setComputerIsUsingAircraftCarrierAbility',
    SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY = 'setComputerIsUsingBattleShipAbility',

    SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY = 'setComputerHasUsedSubmarineAbility',
    SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY = 'setComputerHasUsedAircraftCarrierAbility',
    SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY = 'setComputerHasUsedBattleShipAbility',

    SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH = 'setComputerAircraftCarrierHealth',
    SET_COMPUTER_BATTLESHIP_HEALTH = 'setComputerBattleShipHealth',

    SET_COMPUTER_HAS_CURRENT_TURN = 'setComputerHasCurrentTurn',
    SET_COMPUTER_HAS_WON_THE_GAME = 'setComputerHasWonTheGame',

    SET_COMPUTER_BOARD = 'setComputerBoard',
    SET_COMPUTER_TILE = 'setComputerTile',
}