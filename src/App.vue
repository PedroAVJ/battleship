<template>
  <router-view />
</template>

<!-- This are the styles for the whole app -->
<style>
/** For some reason Bootstrap overrides the background color of the body tag, so we need to override it back */
body {
  background-color: #1a3a4e !important;
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
</style>

