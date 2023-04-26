from rest_framework.serializers import ModelSerializer

from . import models


class GameSerializer(ModelSerializer):
    class Meta:
        model = models.Game
        fields = '__all__'
