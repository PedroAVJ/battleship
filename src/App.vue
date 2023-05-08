<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  background-color: #1a3a4e;
  min-height: 100vh;
}

.primary-button {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  background-color: #ff9800;
  border: none;
  border-radius: 4px;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
  text-decoration: none;
}

.primary-button:hover {
  background-color: #f57c00;
}

.primary-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.secondary-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.secondary-background {
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 150px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.board-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  background-color: #3c6e8f;
  align-items: center;
  text-align: center;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 500px;
  width: 500px;
}

.board-row {
  display: flex;
  flex: 1;
  width: 100%;
}

.board-cell {
  flex: 1;
  position: relative;
  box-sizing: border-box;
}

.water {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #4a6a85;
}

.land {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #2ecc71;
}

.out-of-bounds {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #3c6e8f;
}
</style>


