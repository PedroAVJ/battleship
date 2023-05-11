# Battleship++

Experience the excitement of the classic Battleship game with a modern twist! Battleship++ features new maps, unique ships with special abilities, and a challenging AI opponent to put your strategic skills to the test!

<div align="center">
  <img src="./assets/screenshot.png" alt="Battleship Game Screenshot">
</div>

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Design & Architecture](#design--architecture)

## Live Demo

You can play the game online [here](https://pedroavj.github.io/battleship/).

## Features

- Responsive design for desktop and mobile devices
- Single-player mode against an AI opponent
- Various maps to choose from
- New ship types with unique abilities
- Intuitive drag-and-drop interface for ship placement

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

```git clone https://github.com/pedroavj/battleship.git```

2. Change into the project directory:

```cd battleship```

3. Install dependencies:

```npm install```

## Usage

To run the development server and access the game locally:

1. Start the development server:

```npm run serve```

2. Open your browser and navigate to the local server URL (usually http://localhost:8080).

## Design & Architecture

### Motivation

I chose to build a Battleship clone for two reasons:

1. Showcase a visually engaging project, as it's easier to gauge a system's complexity when you can see it in action.
2. Implement challenging logic, especially with regards to component coupling and state management.

### Stack

- Vue 3 and TypeScript for the main framework and typing.
- Pinia for state management, due to its modern design and built-in TypeScript support.
- Vue Router for navigation.
- Bootstrap 5 for carousel and modals.

### Component Design

Components use TypeScript and the Composition API, providing better readability and flexibility compared to the Options API.

### Game State Persistence

Pinia persisted state plugin saves game state to local storage, allowing game resumption after a refresh.

## Architecture

### Boards

There are three types of boards:

1. PlayerBoard: For ship placement.
2. EnemyBoard: For gameplay.
3. MapBoard: For map selection.

Despite some code repetition, these boards have separate implementations due to their distinct and extensive requirements.

### Utility Functions

Low-level logic is implemented in the `Game.ts` file inside the `utils` folder. It contains utility functions for ship placement, tile checking, and board resolutions, among other things.

### State Management

For board tiles in `RootState`, explicit actions are not used to mutate the state. This decision was made to avoid excessive boilerplate code, but it requires additional reactivity management, such as when displaying modals for when a user wins or loses.

## AI

### Ability Usage

The computer algorithm randomly decides to use an ability based on the current health of the ships, with lower health ships being more likely to use their abilities.

### Target Selection

1. If a ship is uncovered, the AI targets it.
2. If there are no uncovered ships, the AI targets the adjacent tiles of shot at squares to maximize the probability of hitting a ship. It shoots in the direction of the longest straight line of hits.
3. If no unaccounted hits are on the board, a Monte Carlo algorithm places the remaining ships and generates a heatmap for likely ship locations. The computer targets the tile with the highest probability of containing a ship.