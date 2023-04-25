import json
import random

from rest_framework.generics import CreateAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import *
from .serializers import *


SHIP_DIMENSIONS = {
    'submarine': {
        'length': 1,
        'width': 1,
    },
    'supply_boat': {
        'length': 2,
        'width': 1,
    },
    'destroyer': {
        'length': 3,
        'width': 1,
    },
    'battleship': {
        'length': 4,
        'width': 1,
    },
    'frigate': {
        'length': 5,
        'width': 1,
    },
    'aircraft_carrier': {
        'length': 5,
        'width': 2,
    },
}


class StartGameView(CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == HTTP_201_CREATED and response.data:
            game_id = response.data.get('id')

            # Instead of returning the game object, we return the game id
            # Thus, preventing the client from seeing the computer board
            return Response({'id': game_id}, status=HTTP_201_CREATED)
        else:
            return response

    def perform_create(self, serializer):
        game = serializer.save()

        # After creating the game, we randomly place the ships on the board
        place_ships_on_board(game)
        game.save()


def place_ships_on_board(game):

    # We order the ships by length so that we can place the longer ships first
    ships = [
        ('aircraft_carrier', game.aircraft_carrier_count),
        ('frigate', game.frigate_count),
        ('battleship', game.battleship_count),
        ('destroyer', game.destroyer_count),
        ('supply_boat', game.supply_boat_count),
        ('submarine', game.submarine_count),
    ]

    # Parse it as json so that we can access the board as a 2D array
    computer_board = json.loads(game.computer_board)
    for ship_name, ship_count in ships:
        for _ in range(ship_count):
            place_ship(computer_board, ship_name)
    
    game.computer_board = json.dumps(computer_board)

def place_ship(computer_board, ship_name):

    # We randomly select a tile on the board and check if it is a valid placement, if not, we try again
    while True:
        row = random.randint(0, len(computer_board) - 1)
        col = random.randint(0, len(computer_board[0]) - 1)

        if computer_board[row][col]['background']['isLand']:
            continue

        # Ship hitbox check
        if 'ship' in computer_board[row][col]:
            continue

        orientation = random.choice(['horizontal', 'vertical'])
        if is_valid_placement(computer_board, row, col, ship_name, orientation):
            for row_offset, col_offset in get_ship_hit_boxes(row, col, ship_name, orientation):
                computer_board[row_offset][col_offset]['ship'] = {
                    'name': ship_name,
                }
            break


def is_valid_placement(computer_board, row, col, ship_name, orientation):
    for row_offset, col_offset in get_ship_hit_boxes(row, col, ship_name, orientation):

        # Out of bounds check
        if row_offset < 0 or row_offset >= len(computer_board):
            return False
        if col_offset < 0 or col_offset >= len(computer_board[0]):
            return False

        if computer_board[row_offset][col_offset]['background']['isLand']:
            return False
        
        # Ship hitbox check
        if 'ship' in computer_board[row_offset][col_offset]:
            return False

    return True

def get_ship_hit_boxes(row, col, ship_name, orientation):
    hit_boxes = []

    length = SHIP_DIMENSIONS[ship_name]['length']
    width = SHIP_DIMENSIONS[ship_name]['width']

    for i in range(length):
        for j in range(width):

            # You can think of row and col as the origin of the ship
            # Traverse the ship in the direction of the orientation
            if orientation == 'horizontal':
                hit_boxes.append((row + i, col + j))
            else:
                hit_boxes.append((row + j, col + i))

    return hit_boxes


class MakeMoveView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        game = request.data.get('game')
        player = request.data.get('player')

        game_id = request.data.get('game_id')
        player_board = request.data.get('player_board')
        row = request.data.get('row')
        col = request.data.get('col')
        move_is_submarine_ability = request.data.get('move_is_submarine_ability')
        move_is_aircraft_carrier_ability = request.data.get('move_is_aircraft_carrier_ability')

        if isInvalidInput(game_id, player_board, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability):
            return Response({'error': 'Invalid input'}, status=HTTP_400_BAD_REQUEST)

        game = Game.objects.get(id=game_id)
        results_from_player_move = run_player_move(game, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability)

        player_won = True
        computer_board = json.loads(game.computer_board)
        for row in computer_board:
            for tile in row:
                if 'ship' in tile and not tile['contains']['successfulShot']:
                    player_won = False
                    break

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
        return Response({
            'player': {
                'won': player_won,
            },
            'computer': {
                'board': computer_board,
                'move': {
                    'row': row,
                    'col': col,
                    'is_submarine_ability': move_is_submarine_ability,
                    'is_aircraft_carrier_ability': move_is_aircraft_carrier_ability,
                }
            },
        }, status=HTTP_200_OK)

def isInvalidInput(game_id, player_board, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability):
    if not game_id or not player_board:
        return True
    
    if not row and row != 0 or not col and col != 0:
        return True

    if move_is_submarine_ability and move_is_aircraft_carrier_ability:
        return True
    
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        return True

    # Out of bounds check
    if row < 0 or row >= len(json.loads(game.computer_board)):
        return True
    if col < 0 or col >= len(json.loads(game.computer_board)[0]):
        return True
    
    if game.player_has_used_submarine_ability and move_is_submarine_ability:
        return True
    if game.player_has_used_aircraft_carrier_ability and move_is_aircraft_carrier_ability:
        return True
    
    move = json.loads(game.computer_board)[row][col]
    if move['background']['isLand'] or move['contains']['successfulShot'] or move['contains']['missedShot']:
        return True
    
    return False

def run_player_move(game: Game, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability):
    results_from_player_move = []
    computer_board = json.loads(game.computer_board)
    if move_is_aircraft_carrier_ability:
        game.player_has_used_aircraft_carrier_ability = True

        # Aircraft Carrier ability: Destroy all ships in a 3x3 area around the tile
        for row_offset in range(-1, 2):
            for col_offset in range(-1, 2):

                # Out of bounds check
                if row_offset + row < 0 or row_offset + row >= len(computer_board) or col_offset + col < 0 or col_offset + col >= len(computer_board[0]):
                    continue

                tile = computer_board[row_offset + row][col_offset + col]

                if tile['background']['isLand']:
                    continue

                if 'ship' in tile:
                    tile['contains']['successfulShot'] = True
                    results_from_player_move.append({'row': row_offset + row, 'col': col_offset + col, 'action': 'successfulShot'})

                    # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
                    if tile['ship']['name'] == 'submarine':

                        # Since the submarine only has 1 health, it is destroyed when it is hit
                        game.computer_has_used_aircraft_carrier_ability = True

                    elif tile['ship']['name'] == 'aircraftCarrier':
                        game.aircraft_carrier_health -= 1
                        if game.aircraft_carrier_health == 0:
                            game.computer_has_used_aircraft_carrier_ability = True

                else:
                    tile['contains']['missedShot'] = True
                    results_from_player_move.append({'row': row_offset + row, 'col': col_offset + col, 'action': 'missedShot'})

    elif move_is_submarine_ability:
        game.player_has_used_submarine_ability = True

        # Submarine ability: Uncovers ships in a 3x3 area around the tile
        for row_offset in range(-1, 2):
            for col_offset in range(-1, 2):

                # Out of bounds check
                if row_offset + row < 0 or row_offset + row >= len(computer_board) or col_offset + col < 0 or col_offset + col >= len(computer_board[0]):
                    continue

                tile = computer_board[row_offset + row][col_offset + col]
                if 'ship' in tile:
                    tile['contains']['uncovered'] = True
                    results_from_player_move.append({'row': row_offset + row, 'col': col_offset + col, 'action': 'uncoveredShip'})

    else:

        move = computer_board[row][col]
        if 'ship' in move:
            move['contains']['successfulShot'] = True
            results_from_player_move.append({'row': row, 'col': col, 'action': 'successfulShot'})

            # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
            if move['ship']['name'] == 'submarine':

                # Since the submarine only has 1 health, it is destroyed when it is hit
                game.computer_has_used_submarine_ability = True

            elif move['ship']['name'] == 'aircraftCarrier':
                game.aircraft_carrier_health -= 1
                if game.aircraft_carrier_health == 0:
                    game.computer_has_used_aircraft_carrier_ability = True

        else:
            move['contains']['missedShot'] = True
            results_from_player_move.append({'row': row, 'col': col, 'action': 'missedShot'})
    
    return results_from_player_move