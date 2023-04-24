import random

from rest_framework.generics import CreateAPIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import *
from .serializers import *


SHIP_LENGTHS = {
    'submarine': 1,
    'supply_boat': 2,
    'destroyer': 3,
    'battleship': 4,
    'frigate': 5,
    'aircraft_carrier': 5,
}


class StartGameView(CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        # Instead of returning the game object, we return the game id
        # Thus, preventing the client from seeing the computer board
        game_id = self.get_serializer().instance.id
        return Response({'id': game_id}, status=HTTP_201_CREATED)

    def perform_create(self, serializer):
        game = serializer.save()

        # After creating the game, we randomly place the ships on the board
        game.computer_board = place_ships_on_board(game)
        game.save()


def place_ships_on_board(game):

    # We order the ships by length so that we can place the longer ships first
    ships = [
        ['aircraft_carrier', game.aircraft_carrier_count],
        ['frigate', game.frigate_count],
        ['battleship', game.battleship_count],
        ['destroyer', game.destroyer_count],
        ['supply_boat', game.supply_boat_count],
        ['submarine', game.submarine_count],
    ]

    computer_board = game.computer_board

    for ship_name, ship_count in ships:
        for _ in range(ship_count):
            place_ship(computer_board, ship_name)
    
    return computer_board

def place_ship(computer_board, ship_name):

    # We randomly select a tile on the board and check if it is a valid placement, if not, we try again
    while True:
        row = random.randint(0, len(computer_board) - 1)
        col = random.randint(0, len(computer_board[0]) - 1)

        if computer_board[row][col]['background']['isLand']:
            continue
        if computer_board[row][col]['contains']['shipHitbox']:
            continue

        orientation = random.choice(['horizontal', 'vertical'])
        if is_valid_placement(computer_board, row, col, ship_name, orientation):
            hit_boxes = get_ship_hit_boxes(row, col, ship_name, orientation)

            for row, col in hit_boxes:
                computer_board[row][col]['contains']['shipHitbox'] = True

            # We add the ship to the tile so that we can draw the ship sprite
            computer_board[row][col]['ship'] = {
                'name': ship_name,
                'length': SHIP_LENGTHS[ship_name],
                'health': SHIP_LENGTHS[ship_name],
                'orientation': orientation,
            }
            break


def is_valid_placement(computer_board, row, col, ship_name, orientation):
    hit_boxes = get_ship_hit_boxes(row, col, ship_name, orientation)

    for row, col in hit_boxes:

        # Out of bounds check
        if row < 0 or row >= len(computer_board):
            return False
        if col < 0 or col >= len(computer_board[0]):
            return False

        if computer_board[row][col]['background']['isLand']:
            return False
        if computer_board[row][col]['contains']['shipHitbox']:
            return False

    return True

def get_ship_hit_boxes(row, col, ship_name, orientation):
    hit_boxes = []

    for i in range(SHIP_LENGTHS[ship_name]):
        if orientation == 'horizontal':
            hit_boxes.append((row + i, col))

            # If the ship is an Aircraft Carrier, we need to check the tile below
            if ship_name == 'aircraft_carrier':
                hit_boxes.append((row + i, col + 1))
        else:
            hit_boxes.append((row, col + i))

            # If the ship is an Aircraft Carrier, we need to check the tile to the right
            if ship_name == 'aircraft_carrier':
                hit_boxes.append((row + 1, col + i))

    return hit_boxes


class MakeMoveView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        game_id = request.data.get('game_id')
        row = request.data.get('row')
        col = request.data.get('col')
        move_is_submarine_ability = request.data.get('move_is_submarine_ability')
        move_is_aircraft_carrier_ability = request.data.get('move_is_aircraft_carrier_ability')
        uncovered_tiles = request.data.get('uncovered_tiles')

        if isInvalidInput(game_id, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability, uncovered_tiles):
            return Response({'error': 'Invalid input'}, status=HTTP_400_BAD_REQUEST)

        game = Game.objects.get(pk=game_id)

        # We get the game instance from the serializer so that the boards can be accessed already parsed
        game = GameSerializer(game)
        
        results_from_player_move = run_player_move(game, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability)

        # Make random move
        player_board = game.data['player_board']
        while True:
            row = random.randint(0, len(player_board) - 1)
            col = random.randint(0, len(player_board[0]) - 1)
            move = player_board[row][col]

            # If random move isn't valid, try again
            if move['background']['isLand'] or move['contains']['successfulShot'] or move['contains']['missedShot']:
                continue
            computer_move = (row, col)
            break

        # Uncovered tiles take priority
        for tile in uncovered_tiles:
            computer_move = (tile['row'], tile['col'])
            break

        # If the computer hasn't used the aircraft carrier ability yet, use it
        computer_move_is_aircraft_carrier_ability = False
        computer_move_is_submarine_ability = False
        if not game.data['computer_has_used_aircraft_carrier_ability']:
            computer_move_is_aircraft_carrier_ability = True
        elif not game.data['computer_has_used_submarine_ability']:
            computer_move_is_submarine_ability = True

        game.save()
        return Response({
            'results_from_player_move': results_from_player_move,
            'computer_move': computer_move,
            'computer_move_is_aircraft_carrier_ability': computer_move_is_aircraft_carrier_ability,
            'computer_move_is_submarine_ability': computer_move_is_submarine_ability,
        }, status=HTTP_200_OK)

def isInvalidInput(game_id, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability, uncovered_tiles):
    if not game_id or not row or not col:
        return True

    if move_is_submarine_ability and move_is_aircraft_carrier_ability:
        return True

    if move_is_submarine_ability and not uncovered_tiles:
        return True
    if move_is_aircraft_carrier_ability and not uncovered_tiles:
        return True
    
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        return True
    
    # We get the game instance from the serializer so that the boards can be accessed already parsed
    game = GameSerializer(game)

    # Out of bounds check
    if row < 0 or row >= len(game.data['computer_board']):
        return True
    if col < 0 or col >= len(game.data['computer_board'][0]):
        return True
    
    if game.data['player_has_used_submarine_ability'] and move_is_submarine_ability:
        return True
    if game.data['player_has_used_aircraft_carrier_ability'] and move_is_aircraft_carrier_ability:
        return True
    
    move = game.data['computer_board'][row][col]
    if move['background']['isLand'] or move['contains']['successfulShot'] or move['contains']['missedShot']:
        return True
    
    return False

def run_player_move(game, row, col, move_is_submarine_ability, move_is_aircraft_carrier_ability):
    results_from_player_move = []
    computer_board = game.data['computer_board']
    move = computer_board[row][col]
    if move_is_aircraft_carrier_ability:
        game.data['player_has_used_aircraft_carrier_ability'] = True

        # Aircraft Carrier ability: Destroy all ships in a 3x3 area around the tile
        for row in range(-1, 2):
            for col in range(-1, 2):

                # Out of bounds check
                if row + row < 0 or row + row >= len(computer_board) or col + col < 0 or col + col >= len(computer_board[0]):
                    continue

                tile = computer_board[row + row][col + col]
                if tile['contains']['shipHitbox']:
                    tile['contains']['successfulShot'] = True
                    results_from_player_move.append({'row': row + row, 'col': col + col, 'action': 'successfulShot'})

                    # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
                    tile['ship']['health'] -= 1
                    if tile['ship']['health'] == 0:
                        if tile['ship']['name'] == 'aircraftCarrier':
                            game.data['computer_has_used_aircraft_carrier_ability'] = True
                        elif tile['ship']['name'] == 'submarine':
                            game.data['computer_has_used_submarine_ability'] = True

                else:
                    tile['contains']['missedShot'] = True
                    results_from_player_move.append({'row': row + row, 'col': col + col, 'action': 'missedShot'})

    elif move_is_submarine_ability:
        game.data['player_has_used_submarine_ability'] = True

        # Submarine ability: Uncovers ships in a 3x3 area around the tile
        for row in range(-1, 2):
            for col in range(-1, 2):

                # Out of bounds check
                if row + row < 0 or row + row >= len(computer_board) or col + col < 0 or col + col >= len(computer_board[0]):
                    continue

                tile = computer_board[row + row][col + col]
                if tile['contains']['shipHitbox']:
                    tile['contains']['uncovered'] = True
                    results_from_player_move.append({'row': row + row, 'col': col + col, 'action': 'uncoveredShip'})

    else:
        if move['contains']['shipHitbox']:
            move['contains']['successfulShot'] = True
            results_from_player_move.append({'row': row, 'col': col, 'action': 'successfulShot'})

            # If the submarine or aircraft carrier is destroyed before their respective abilities are used, the abilities will be used
            move['ship']['health'] -= 1
            if move['ship']['health'] == 0:
                if move['ship']['name'] == 'aircraftCarrier':
                    game.data['computer_has_used_aircraft_carrier_ability'] = True
                elif move['ship']['name'] == 'submarine':
                    game.data['computer_has_used_submarine_ability'] = True

        else:
            move['contains']['missedShot'] = True
            results_from_player_move.append({'row': row, 'col': col, 'action': 'missedShot'})
    
    return results_from_player_move