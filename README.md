# Battleship++

¡Experimenta la emoción del clásico juego de Battleship con un giro moderno! Battleship++ cuenta con nuevos mapas, barcos únicos con habilidades especiales y un desafiante oponente de IA para poner a prueba tus habilidades estratégicas.

<div align="center">
  <img src="./assets/screenshot.png" alt="Captura de pantalla del juego de Battleship">
</div>

## Índice

- [Demo en vivo](#demo-en-vivo)
- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Diseño y Arquitectura](#diseño-&-arquitectura)

## Demo en Vivo

Puedes jugar el juego en línea [aquí](https://pedroavj.github.io/battleship/).

## Características

- Diseño adaptable para dispositivos de escritorio y móviles
- Modo para un solo jugador contra un oponente de IA
- Varios mapas para elegir
- Nuevos tipos de barcos con habilidades únicas
- Interfaz intuitiva de arrastrar y soltar para la colocación de barcos

## Instalación

Para configurar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:

```git clone https://github.com/pedroavj/battleship.git```

2. Cambia al directorio del proyecto:

```cd battleship```

3. Instala las dependencias:

```npm install```

## Uso

Para ejecutar el servidor de desarrollo y acceder al juego localmente:

1. Inicia el servidor de desarrollo:

```npm run serve```

2. Abre tu navegador y navega a la URL del servidor local (usualmente http://localhost:8080).

## Diseño & Arquitectura

### Motivación

Elegí construir un clon de Battleship por dos razones:

1. Mostrar un proyecto visualmente atractivo, ya que es más fácil evaluar la complejidad de un sistema cuando se puede ver en acción.
2. Implementar una lógica desafiante, especialmente en lo que respecta al acoplamiento de componentes y la gestión del estado.

### Tecnologías

- Vue 3 y TypeScript para el marco principal y la tipificación.
- Pinia para la gestión del estado, debido a su diseño moderno y soporte incorporado para TypeScript.
- Vue Router para la navegación.
- Bootstrap 5 para carrusel y modales.

### Diseño de Componentes

Los componentes utilizan TypeScript y la API de Composición, proporcionando una mejor legibilidad y flexibilidad en comparación con la API de Opciones.

### Persistencia del Estado del Juego

El plugin de estado persistido de Pinia guarda el estado del juego en el almacenamiento local, permitiendo la reanudación del juego después de un refresco.

## Arquitectura

### Tableros

Existen tres tipos de tableros:

1. PlayerBoard: Para la colocación de barcos.
2. EnemyBoard: Para el juego.
3. MapBoard: Para la selección de mapas.

A pesar de alguna repetición de código, estos tableros tienen implementaciones separadas debido a sus requisitos distintos y extensos.

### Funciones de Utilidad

La lógica de bajo nivel está implementada en el archivo Game.ts dentro de la carpeta utils. Contiene funciones de utilidad para la colocación de barcos, la comprobación de casillas, y las resoluciones de tablero, entre otras cosas.

### Gestión del Estado

Para las casillas del tablero en RootState, no se utilizan acciones explícitas para mutar el estado. Esta decisión se tomó para evitar un código de plantilla excesivo, pero requiere una gestión de reactividad adicional, como cuando se muestran modales para cuando un usuario gana o pierde.

## AI

### Uso de Habilidades

El algoritmo del ordenador decide aleatoriamente usar una habilidad basándose en la salud actual de los barcos, siendo más probable que los barcos con menor salud utilicen sus habilidades.

### Selección de Objetivo

1. Si un barco está descubierto, la IA lo tiene en su punto de mira.
2. Si no hay barcos descubiertos, la IA apunta a las casillas adyacentes a las cuadrículas disparadas para maximizar la probabilidad de acertar a un barco. Dispara en la dirección de la línea recta más larga de aciertos.
3. Si no hay impactos sin contabilizar en el tablero, un algoritmo de Monte Carlo coloca los barcos restantes y genera un mapa de calor para las posibles ubicaciones de los barcos. El ordenador apunta a la casilla con la mayor probabilidad de contener un barco.