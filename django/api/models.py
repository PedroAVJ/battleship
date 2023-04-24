from django.db.models import Model, TextField, BooleanField, IntegerField


class Game(Model):

    computer_board = TextField()
    computer_has_used_submarine_ability = BooleanField(default=False)
    computer_has_used_aircraft_carrier_ability = BooleanField(default=False)

    player_board = TextField()
    player_has_used_submarine_ability = BooleanField(default=False)
    player_has_used_aircraft_carrier_ability = BooleanField(default=False)

    submarine_count = IntegerField()
    aircraft_carrier_count = IntegerField()
    destroyer_count = IntegerField()
    frigate_count = IntegerField()
    battleship_count = IntegerField()
    supply_boat_count = IntegerField()