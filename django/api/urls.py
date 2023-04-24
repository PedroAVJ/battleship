from django.urls import path
from .views import StartGameView, MakeMoveView


urlpatterns = [
    path('start_game/', StartGameView.as_view(), name='start_game'),
    path('make_move/', MakeMoveView.as_view(), name='make_move'),
]
