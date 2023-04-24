import json

from rest_framework.serializers import ModelSerializer, Field

from .models import *


class BoardJSONField(Field):
    """Custom serializer field to serialize JSON object."""

    def to_representation(self, value):
        return json.loads(value)

    def to_internal_value(self, data):
        return json.dumps(data)


class GameSerializer(ModelSerializer):
    computer_board = BoardJSONField()
    player_board = BoardJSONField()

    class Meta:
        model = Game
        fields = '__all__'
