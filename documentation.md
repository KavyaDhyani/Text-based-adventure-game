# Text-Based Adventure Game

## Overview

This is a short text-based adventure game implemented in JavaScript. The game allows players to navigate through the story by making their own choices, thus affecting the way the story unfolds.

## File Structure

- **index.html**: The main HTML file that sets up the game interface.
- **script.js**: The JavaScript file containing the game logic and functionality.
- **styles.css**: The CSS file for styling the game interface.

## Game Logic Functions

### 1. `async function typeText(text, element, speed = 30)`

Simulates text-typing effect in the terminal window.

- **Parameters**:
  - `text`: The string of text to be displayed.
  - `element`: The DOM element where the text will be displayed.
  - `speed`: The speed of typing in milliseconds (default is 30 ms).

- **Returns**: A Promise that resolves when the typing is complete.

### 2. `async function displayText(text, className = "")`

Displays text in the terminal.

- **Parameters**:
  - `text`: The text to be displayed.
  - `className`: An optional CSS class name to apply to the paragraph element.

- **Functionality**:
  - Creates a new paragraph element, assigns it a class name, appends it to the output area, and calls `typeText` to simulate typing effect.

### 3. `async function displayInventory()`

Displays the player's current inventory if there are any items.

- **Functionality**:
  - Checks if the inventory array has items and calls `displayText` to show the inventory.

### 4. `async function restartGame()`

Restarts the game.

- **Functionality**:
  - Clears the output area, resets the game state, re-enables the input field, and starts the game from the "intro" scene.

### 5. `async function processInput(value)`

Processes the player's input and determines the next action based on the current scene.

- **Parameters**:
  - `value`: The input string entered by the player.

- **Functionality**:
  - Displays the player's input, checks for the "restart" command, and determines the next scene based on the current choices.

### 6. `async function changeScene(sceneName)`

Changes the current scene of the game and displays the corresponding text.

- **Parameters**:
  - `sceneName`: The name of the scene to transition to.

- **Functionality**:
  - Updates the current scene, calls the `onEnter` function if it exists, retrieves the scene text, and checks if the scene is an ending scene.

## Event Listeners

### Input Event Listener

```javascript
input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && !gameState.isTyping) {
    const value = input.value.trim();
    if (value) {
      input.value = "";
      await processInput(value);
    }
  }
});
```

- Listens for the "Enter" key press on the input field.
- Calls processInput with the entered value if typing is not in progress.

## Usage Example

1. **Start the Game**: The game begins by calling changeScene("intro"), displaying the introductory text.
2. **Player Input**: The player types their choice (e.g., "yes" or "no") and presses "Enter".
3. **Scene Transition**: Based on the player's choice, the game transitions to the next scene, updating the narrative and choices available.
4. **Inventory Management**: The player's inventory is displayed after each scene, showing items acquired during the adventure.
5. **Restarting the Game**: The player can type "restart" at any time to reset the game and start over.
