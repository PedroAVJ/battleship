import json
import random
from enum import Enum
from typing import Any, Dict, List

from rest_framework.generics import CreateAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer

from . import models
from .serializers import *


class ShipName(Enum):
    SUBMARINE = 'submarine'
    SUPPLY_BOAT = 'supplyBoat'
    DESTROYER = 'destroyer'
    BATTLESHIP = 'battleship'
    FRIGATE = 'frigate'
    AIRCRAFT_CARRIER = 'aircraftCarrier'


class Orientation(Enum):
    HORIZONTAL = 'horizontal'
    VERTICAL = 'vertical'


SHIP_DIMENSIONS = {
    ShipName.SUBMARINE: {
        'length': 1,
        'width': 1,
    },
    ShipName.SUPPLY_BOAT: {
        'length': 2,
        'width': 1,
    },
    ShipName.DESTROYER: {
        'length': 3,
        'width': 1,
    },
    ShipName.BATTLESHIP: {
        'length': 4,
        'width': 1,
    },
    ShipName.FRIGATE: {
        'length': 5,
        'width': 1,
    },
    ShipName.AIRCRAFT_CARRIER: {
        'length': 5,
        'width': 2,
    },
}


class StartGameView(CreateAPIView):
    queryset = models.Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        response = super().create(request, *args, **kwargs)

        # If the game was created, just return the game id, as to not expose the computer board
        if response.status_code == HTTP_201_CREATED:
            response.data = {'id': response.data.get('id')}

        return response

    def perform_create(self, serializer: BaseSerializer) -> None:
        game = serializer.save()

        # After creating the game, we randomly place the ships on the board
        place_ships_on_board(game)
        game.save()


def place_ships_on_board(game: models.Game) -> None:

    # We order the ships by length so that we can place the longer ships first
    ships = (
        (ShipName.AIRCRAFT_CARRIER, game.aircraft_carrier_count),
        (ShipName.FRIGATE, game.frigate_count),
        (ShipName.BATTLESHIP, game.battleship_count),
        (ShipName.DESTROYER, game.destroyer_count),
        (ShipName.SUPPLY_BOAT, game.supply_boat_count),
        (ShipName.SUBMARINE, game.submarine_count),
    )

    # Parse the computer board from JSON to a matrix of tiles
    computer_board: List[List[Dict[str, Any]]] = json.loads(game.computer_board)

    for ship_name, ship_count in ships:
        for _ in range(ship_count):
            while True:

                # We randomly select a tile on the board and check if it is a valid placement, if not, we try again
                if shipPlacementSuccessful(computer_board, ship_name):
                    break
    
    game.computer_board = json.dumps(computer_board)

def shipPlacementSuccessful(computer_board: List[List[Dict[str, Any]]], ship_name: ShipName) -> bool:

    row_origin = random.randint(0, len(computer_board) - 1)
    col_origin = random.randint(0, len(computer_board[0]) - 1)
    orientation = random.choice([Orientation.HORIZONTAL, Orientation.VERTICAL])

    ship_hit_boxes = []
    length = SHIP_DIMENSIONS[ship_name]['length']
    width = SHIP_DIMENSIONS[ship_name]['width']

    for i in range(length):
        for j in range(width):

            # You can think of row and col as the origin of the ship
            # Traverse the ship in the direction of the orientation
            if orientation == Orientation.HORIZONTAL:
                ship_hit_boxes.append((row_origin + i, col_origin + j))
            else:
                ship_hit_boxes.append((row_origin + j, col_origin + i))

    # If the placement is invalid, we try again
    for row, col in ship_hit_boxes:

        # Out of bounds check
        if row < 0 or row >= len(computer_board):
            return False
        if col < 0 or col >= len(computer_board[0]):
            return False

        # Ship hitbox check
        if 'ship' in computer_board[row][col]:
            return False

        if computer_board[row][col]['background']['isLand']:
            return False
    
    # Placement is valid, we place the ship
    for row, col in ship_hit_boxes:
        computer_board[row][col]['ship'] = {
            'name': ship_name,
        }
        if row_origin == row and col == col_origin:
            computer_board[row][col]['ship']['orientation'] = orientation

    return True


class MakeMoveView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # Request
        game = request.data.get('game')
        player = request.data.get('player')

        """ game_id = request.data.get('game_id')
        player_board = request.data.get('player_board')
        row = request.data.get('row')
        col = request.data.get('col')
        move_is_submarine_ability = request.data.get('move_is_submarine_ability')
        move_is_aircraft_carrier_ability = request.data.get('move_is_aircraft_carrier_ability') """

        # Response
        response = {
            'player': {
                'won': False,
            },
            'computer': {
                'board': None,
                'move': {
                    'row': None,
                    'col': None,
                    'isSubmarineAbility': False,
                    'isAircraftCarrierAbility': False,
                }
            },
        }

        make_player_move(game, player, response)
        make_computer_move(response)

        # Make random move
        player_board = json.loads(player_board)
        while True:
            row = random.randint(0, len(player_board) - 1)
            col = random.randint(0, len(player_board[0]) - 1)
            print(row, col)
            move = player_board[row][col]

            # If random move isn't valid, try again
            if move['background']['isLand'] or move['contains']['successfulShot'] or move['contains']['missedShot']:
                continue
            computer_move = (row, col)
            break

        # Mark uncovered tiles
        print(tiles_uncovered_by_player)
        for tile in tiles_uncovered_by_player:
            player_board[tile['row']][tile['col']]['contains']['uncoveredShip'] = True
        
        # Uncovered tiles take priority
        for row in range(len(player_board)):
            for col in range(len(player_board[0])):
                tile = player_board[row][col]
                if tile['contains']['uncoveredShip'] and not tile['contains']['successfulShot']:
                    computer_move = (row, col)
                    break

        # If the computer hasn't used the aircraft carrier ability yet, use it
        uncovered_tiles = []
        computer_move_is_aircraft_carrier_ability = False
        computer_move_is_submarine_ability = False
        if not game.computer_has_used_aircraft_carrier_ability:
            computer_move_is_aircraft_carrier_ability = True
            game.computer_has_used_aircraft_carrier_ability = True

            # Uncover aircraft carrier tiles
            for row in range(len(computer_board)):
                for col in range(len(computer_board[0])):
                    tile = computer_board[row][col]
                    if 'ship' in tile and tile['ship']['name'] == 'aircraft_carrier':
                        uncovered_tiles.append({
                            'row': row,
                            'col': col,
                        })

        elif not game.computer_has_used_submarine_ability:
            computer_move_is_submarine_ability = True
            game.computer_has_used_submarine_ability = True

            # Uncover submarine tiles
            for row in range(len(computer_board)):
                for col in range(len(computer_board[0])):
                    tile = computer_board[row][col]
                    if 'ship' in tile and tile['ship']['name'] == 'submarine':
                        uncovered_tiles.append({
                            'row': row,
                            'col': col,
                        })

        game.save()
        return Response(response, status=HTTP_200_OK)

def make_player_move(game: Dict[str, Any], player: Dict[str, Any], response: Dict[str, Any]):

    game_id = game['id']
    game_instance = models.Game.objects.get(id=game_id)
    computer_board: List[List[Dict[str, Any]]] = json.loads(game_instance.computer_board)

    row_origin = player['move']['row']
    col_origin = player['move']['col']

    if player['move']['isSubmarineAbility']:
        game_instance.player_has_used_aircraft_carrier_ability = True

        # Create a tuple of all the tiles that the submarine will hit
        tiles = [
            (row, col) for row in range(-1, 2) for col in range(-1, 2)

            # Out of bounds check
            if row + row_origin >= 0 and row + row_origin < len(computer_board) and col + col_origin >= 0 and col + col_origin < len(computer_board[0])
        ]

        # Aircraft Carrier ability: Destroy all ships in a 3x3 area around the tile
        for row in range(-1, 2):
            for col in range(-1, 2):

                # Out of bounds check
                if row + row_origin < 0 or row + row_origin >= len(computer_board) or col + col_origin < 0 or col + col_origin >= len(computer_board[0]):
                    continue

                tile = computer_board[row + row_origin][col + col_origin]

                if tile['background']['isLand']:
                    continue

                if 'ship' in tile:
                    tile['contains']['successfulShot'] = True

                    # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
                    if tile['ship']['name'] == 'submarine':

                        # Since the submarine only has 1 health, it is destroyed when it is hit
                        game_instance.computer_has_used_aircraft_carrier_ability = True

                    elif tile['ship']['name'] == 'aircraftCarrier':
                        game_instance.aircraft_carrier_health -= 1

                else:
                    tile['contains']['missedShot'] = True
        
        # Check if the aircraft carrier was destroyed
        if game_instance.aircraft_carrier_health == 0:
            game_instance.computer_has_used_aircraft_carrier_ability = True

    elif player['move']['isAircraftCarrierAbility']:
        game_instance.player_has_used_submarine_ability = True

        # Submarine ability: Uncovers ships in a 3x3 area around the tile
        for row in range(-1, 2):
            for col in range(-1, 2):

                # Out of bounds check
                if row + row_origin < 0 or row + row_origin >= len(computer_board) or col + col_origin < 0 or col + col_origin >= len(computer_board[0]):
                    continue

                tile = computer_board[row + row_origin][col + col_origin]
                if 'ship' in tile:
                    tile['contains']['uncovered'] = True

    else:

        tile = computer_board[row_origin][col_origin]
        if 'ship' in tile:
            tile['contains']['successfulShot'] = True

            # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
            if tile['ship']['name'] == 'submarine':

                # Since the submarine only has 1 health, it is destroyed when it is hit
                game_instance.computer_has_used_aircraft_carrier_ability = True

            elif tile['ship']['name'] == 'aircraftCarrier':
                game_instance.aircraft_carrier_health -= 1
                if game_instance.aircraft_carrier_health == 0:
                    game_instance.computer_has_used_aircraft_carrier_ability = True

        else:
            tile['contains']['missedShot'] = True

    # Check if the player won
    for row in range(len(computer_board)):
        for col in range(len(computer_board[0])):
            tile = computer_board[row][col]
            if 'ship' in tile and not tile['contains']['successfulShot']:
                response['player']['won'] = False
                break