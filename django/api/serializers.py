from rest_framework.serializers import ModelSerializer

from .models import *


class GameSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
