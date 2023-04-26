from django.db.models import Model, TextField, BooleanField, IntegerField


class Game(Model):

    computer_board: TextField = TextField()
    computer_has_used_submarine_ability: BooleanField = BooleanField(default=False)
    computer_has_used_aircraft_carrier_ability: BooleanField = BooleanField(default=False)

    player_board: TextField = TextField()
    player_has_used_submarine_ability: BooleanField = BooleanField(default=False)
    player_has_used_aircraft_carrier_ability: BooleanField = BooleanField(default=False)

    aircraft_carrier_health: IntegerField = IntegerField(default=10)

    submarine_count: IntegerField = IntegerField()
    aircraft_carrier_count: IntegerField = IntegerField()
    destroyer_count: IntegerField = IntegerField()
    frigate_count: IntegerField = IntegerField()
    battleship_count: IntegerField = IntegerField()
    supply_boat_count: IntegerField = IntegerField()