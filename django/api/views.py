import json
import random
from typing import Any, Dict

from rest_framework.generics import CreateAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer

from . import models
from .serializers import *
from .types import SHIP_DIMENSIONS, ShipName, Orientation


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

def place_ships_on_board(game: models.Game) -> None:
    computer_board = json.loads(game.computer_board)

    # We order the ships by length so that we can place the longer ships first
    ships = (
        (ShipName.AIRCRAFT_CARRIER, game.aircraft_carrier_count),
        (ShipName.FRIGATE, game.frigate_count),
        (ShipName.BATTLESHIP, game.battleship_count),
        (ShipName.DESTROYER, game.destroyer_count),
        (ShipName.SUPPLY_BOAT, game.supply_boat_count),
        (ShipName.SUBMARINE, game.submarine_count),
    )

    for ship_name, ship_count in ships:
        for _ in range(ship_count):
            while True:

                # We randomly select a tile on the board and check if it is a valid placement, if not, we try again
                if shipPlacementSuccessful(computer_board, ship_name):
                    break
    
    # We save the board back to the database
    game.computer_board = json.dumps(computer_board)
    game.save()

def shipPlacementSuccessful(computer_board, ship_name: ShipName) -> bool:

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
            'name': ship_name.value,
        }
        if row_origin == row and col == col_origin:
            computer_board[row][col]['ship']['orientation'] = orientation.value

    return True


class MakeMoveView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # Request
        game = request.data.get('game')
        player = request.data.get('player')

        """
        request = {
            'game': {
                'id': bool,
            },
            'player': {
                'board': Tile[][],
                'move': {
                    'row': number,
                    'col': number,
                    'isSubmarineAbility': bool,
                    'isAircraftCarrierAbility': bool,
                }
            },
        }
        """

        # Response
        response = {
            'player': {
                'won': True,
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

        # Make the moves
        make_player_move(game, player, response)
        make_computer_move(game, player, response)

        # Make sure to pass the computer board withouth the ships to the frontend
        computer_board = json.loads(models.Game.objects.get(id=game['id']).computer_board)
        for row in computer_board:
            for tile in row:
                if 'ship' in tile:
                    del tile['ship']
        
        response['computer']['board'] = computer_board
        return Response(response, status=HTTP_200_OK)


def make_player_move(game: Dict[str, Any], player: Dict[str, Any], response: Dict[str, Any]) -> None:

    game_id = game['id']
    game_instance = models.Game.objects.get(id=game_id)
    computer_board = json.loads(game_instance.computer_board)

    row_origin = player['move']['row']
    col_origin = player['move']['col']

    if player['move']['isSubmarineAbility']:

        # Submarine ability: Uncover all ships in a 3x3 area around the tile
        tiles = [
            (row, col) for row in range(-1, 2) for col in range(-1, 2)
        ]

        for row, col in tiles:

            # Out of bounds check
            if row + row_origin < 0 or row + row_origin >= len(computer_board) or col + col_origin < 0 or col + col_origin >= len(computer_board[0]):
                continue

            tile = computer_board[row + row_origin][col + col_origin]

            if tile['background']['isLand']:
                continue

            if 'ship' in tile:
                tile['contains']['uncoveredShip'] = True
        
        game_instance.player_has_used_submarine_ability = True

    elif player['move']['isAircraftCarrierAbility']:
        
        # Aircraft carrier ability: Dstroy all ships in a 3x3 area around the tile
        tiles = [
            (row, col) for row in range(-1, 2) for col in range(-1, 2)
        ]

        for row, col in tiles:
                
            # Out of bounds check
            if row + row_origin < 0 or row + row_origin >= len(computer_board) or col + col_origin < 0 or col + col_origin >= len(computer_board[0]):
                continue

            tile = computer_board[row + row_origin][col + col_origin]

            if tile['background']['isLand']:
                continue

            if 'ship' in tile and tile['ship']['name'] == ShipName.AIRCRAFT_CARRIER:
                tile['contains']['successfulShot'] = True
                game_instance.aircraft_carrier_health -= 1
            
            elif 'ship' in tile and tile['ship']['name'] == ShipName.SUBMARINE:
                tile['contains']['successfulShot'] = True

                # Because the submarine has only 1 health, it is destroyed when it is hit
                game_instance.computer_has_used_submarine_ability = True
            
            elif 'ship' in tile:
                tile['contains']['successfulShot'] = True
            
            else:
                tile['contains']['missedShot'] = True
        
        game_instance.player_has_used_aircraft_carrier_ability = True

        # If the aircraft carrier is destroyed, the ability is used
        if game_instance.aircraft_carrier_health == 0:
            game_instance.computer_has_used_aircraft_carrier_ability = True

    else:

        tile = computer_board[row_origin][col_origin]
        if 'ship' in tile:
            tile['contains']['successfulShot'] = True

            if tile['ship']['name'] == 'submarine':

                # Since the submarine only has 1 health, it is destroyed when it is hit
                game_instance.computer_has_used_aircraft_carrier_ability = True

            elif tile['ship']['name'] == 'aircraftCarrier':
                game_instance.aircraft_carrier_health -= 1

        else:
            tile['contains']['missedShot'] = True
        
        # If the aircraft carrier is destroyed, the ability is used
        if game_instance.aircraft_carrier_health == 0:
            game_instance.computer_has_used_aircraft_carrier_ability = True
    
    # Save the game instance
    game_instance.computer_board = json.dumps(computer_board)
    game_instance.save()

    # Check if the player won
    for row in range(len(computer_board)):
        for col in range(len(computer_board[0])):
            tile = computer_board[row][col]
            if 'ship' in tile and not tile['contains']['successfulShot']:
                response['player']['won'] = False
                break

def make_computer_move(game: Dict[str, Any], player: Dict[str, Any], response: Dict[str, Any]) -> None:

    # Game instance
    game_id = game['id']
    game_instance = models.Game.objects.get(id=game_id)
    computer_board = json.loads(game_instance.computer_board)

    # Make random move
    while True:
        row = random.randint(0, len(player['board']) - 1)
        col = random.randint(0, len(player['board'][0]) - 1)
        move = player['board'][row][col]

        # If random move isn't valid, try again
        if move['background']['isLand'] or move['contains']['successfulShot'] or move['contains']['missedShot']:
            continue
        response['computer']['move']['row'] = row
        response['computer']['move']['col'] = col
        break
    

    # If the computer hasn't used the aircraft carrier ability yet, use it
    if not game_instance.computer_has_used_aircraft_carrier_ability:
        game_instance.computer_has_used_aircraft_carrier_ability = True
        response['computer']['move']['isAircraftCarrierAbility'] = True

        # Uncover aircraft carrier tiles
        for row in range(len(computer_board)):
            for col in range(len(computer_board[0])):
                tile = computer_board[row][col]
                if 'ship' in tile and tile['ship']['name'] == ShipName.AIRCRAFT_CARRIER.value:
                    computer_board[row][col]['contains']['uncoveredShip'] = True

    # If the computer hasn't used the submarine ability yet, use it
    elif not game_instance.computer_has_used_submarine_ability:
        game_instance.computer_has_used_submarine_ability = True
        response['computer']['move']['isSubmarineAbility'] = True

        # Uncover submarine tiles
        for row in range(len(computer_board)):
            for col in range(len(computer_board[0])):
                tile = computer_board[row][col]
                if 'ship' in tile and tile['ship']['name'] == ShipName.SUBMARINE.value:
                    computer_board[row][col]['contains']['uncoveredShip'] = True

    # Uncovered tiles take priority
    for row in range(len(player['board'])):
        for col in range(len(player['board'][0])):
            tile = player['board'][row][col]
            if tile['contains']['uncoveredShip'] and not tile['contains']['successfulShot']:
                response['computer']['move']['row'] = row
                response['computer']['move']['col'] = col

    game_instance.player_board = json.dumps(player['board'])
    game_instance.computer_board = json.dumps(computer_board)
    game_instance.save()
