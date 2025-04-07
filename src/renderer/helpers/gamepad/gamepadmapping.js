export default class GamepadMapping {
  constructor() {
    // Default button-to-action mappings
    this.buttonMappings = {
      0: 'leftClick', // A button
      1: 'rightClick', // B button
      2: 'middleClick', // X button
      3: 'customAction', // Y button
    }

    // Action handlers
    this.actionHandlers = {
      leftClick: this.simulateLeftClick,
      rightClick: this.simulateRightClick,
      middleClick: this.simulateMiddleClick,
      customAction: () => this.simulateCustomAction(),
    }
  }

  // Update the mapping for a specific button
  updateMapping(buttonIndex, action) {
    if (this.actionHandlers[action]) {
      this.buttonMappings[buttonIndex] = action
    } else {
      console.error(`Action "${action}" is not defined.`)
    }
  }

  // Handle button press based on the current mappings
  handleButtonPress(buttonIndex, pointerX, pointerY) {
    const action = this.buttonMappings[buttonIndex]
    if (action && this.actionHandlers[action]) {
      this.actionHandlers[action](pointerX, pointerY)
    }
  }

  // Simulate a left mouse click
  simulateLeftClick(pointerX, pointerY) {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: pointerX,
      clientY: pointerY,
    })
    const element = document.elementFromPoint(pointerX, pointerY)
    if (element) {
      element.dispatchEvent(clickEvent)
    }
  }

  // Simulate a right mouse click
  simulateRightClick(pointerX, pointerY) {
    const rightClickEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: pointerX,
      clientY: pointerY,
    })
    const element = document.elementFromPoint(pointerX, pointerY)
    if (element) {
      element.dispatchEvent(rightClickEvent)
    }
  }

  // Simulate a middle mouse click
  simulateMiddleClick(pointerX, pointerY) {
    const middleClickEvent = new MouseEvent('auxclick', {
      bubbles: true,
      cancelable: true,
      clientX: pointerX,
      clientY: pointerY,
      button: 1, // Middle mouse button
    })
    const element = document.elementFromPoint(pointerX, pointerY)
    if (element) {
      element.dispatchEvent(middleClickEvent)
    }
  }
}
