import { ref, onMounted, onBeforeUnmount } from 'vue'
import { GamepadAxes, GamepadActions, GamepadBindings } from '../../constants'

const AXIS_THRESHOLD = 0.5 // Deadzone threshold
const AXIS_DEBOUNCE_MS = 100
const BUTTON_DEBOUNCE_MS = 50

export function useGamepadService() {
  const gamepadConnected = ref(false)
  const gamepadIndex = ref(null)
  const isMonitoring = ref(false)
  const lastAxisTime = ref({})
  const lastButtonTime = ref({})

  // Button state tracking to prevent repeated triggers
  const previousButtonState = ref({})

  /**
   * Get current gamepad state
   */
  function getGamepad() {
    if (gamepadIndex.value === null) return null
    const gamepads = navigator.getGamepads?.() || navigator.webkitGetGamepads?.()
    return gamepads?.[gamepadIndex.value]
  }

  /**
   * Check if gamepad is available and poll for input
   */
  function monitorGamepadInput() {
    const gamepad = getGamepad()
    if (!gamepad) return

    // Poll buttons
    pollButtons(gamepad)

    // Poll axes (sticks and triggers)
    pollAxes(gamepad)

    if (isMonitoring.value) {
      requestAnimationFrame(monitorGamepadInput)
    }
  }

  /**
   * Poll gamepad buttons for changes
   */
  function pollButtons(gamepad) {
    gamepad.buttons.forEach((button, index) => {
      const pressed = button.pressed
      const previously = previousButtonState.value[index]?.pressed || false

      // Detect button press (transition from unpressed to pressed)
      if (pressed && !previously) {
        handleButtonPress(index)
      }

      // Update state
      previousButtonState.value[index] = { pressed }
    })
  }

  /**
   * Poll gamepad analog sticks and triggers
   */
  function pollAxes(gamepad) {
    gamepad.axes.forEach((value, index) => {
      const now = Date.now()
      const lastTime = lastAxisTime.value[index] || 0

      // Apply deadzone
      if (Math.abs(value) < AXIS_THRESHOLD) return

      // Debounce rapid axis changes
      if (now - lastTime < AXIS_DEBOUNCE_MS) return

      lastAxisTime.value[index] = now
      handleAxisChange(index, value)
    })
  }

  /**
   * Handle button press events
   */
  function handleButtonPress(buttonIndex) {
    const now = Date.now()
    const lastTime = lastButtonTime.value[buttonIndex] || 0

    // Debounce button presses
    if (now - lastTime < BUTTON_DEBOUNCE_MS) return
    lastButtonTime.value[buttonIndex] = now

    const action = GamepadBindings[buttonIndex]
    if (action) {
      dispatchGamepadAction(action, { button: buttonIndex })
    }
  }

  /**
   * Handle analog stick/trigger input
   */
  function handleAxisChange(axisIndex, value) {
    let action = null
    const details = { axis: axisIndex, value }

    // Left stick Y-axis (vertical) = Volume control
    if (axisIndex === GamepadAxes.LEFT_STICK_Y) {
      action = value > 0 ? GamepadActions.VOLUME_DOWN : GamepadActions.VOLUME_UP
    } else if (axisIndex === GamepadAxes.LEFT_STICK_X) {
      action = value > 0 ? GamepadActions.SPEED_UP : GamepadActions.SPEED_DOWN
    } else if (axisIndex === GamepadAxes.RIGHT_STICK_Y) {
      // Right stick Y-axis = Seeking (short seek)
      action = value > 0 ? GamepadActions.SEEK_BACKWARD : GamepadActions.SEEK_FORWARD
      details.distance = Math.abs(value) // How far stick is pushed (0-1)
    } else if (axisIndex === GamepadAxes.LEFT_TRIGGER) {
      // Triggers for navigation (if using trigger squeeze)
      action = GamepadActions.NAVIGATE_UP
      details.intensity = value
    } else if (axisIndex === GamepadAxes.RIGHT_TRIGGER) {
      action = GamepadActions.NAVIGATE_DOWN
      details.intensity = value
    }

    if (action) {
      dispatchGamepadAction(action, details)
    }
  }

  /**
   * Dispatch action to subscribers
   */
  function dispatchGamepadAction(action, details) {
    // This will be handled by composables that subscribe
    window.dispatchEvent(new CustomEvent('gamepad-action', {
      detail: { action, ...details }
    }))
  }

  /**
   * Handle gamepad connection
   */
  function handleGamepadConnected(e) {
    console.warn('Gamepad connected:', e.gamepad)
    gamepadIndex.value = e.gamepad.index
    gamepadConnected.value = true
    startMonitoring()
  }

  /**
   * Handle gamepad disconnection
   */
  function handleGamepadDisconnected(e) {
    console.warn('Gamepad disconnected:', e.gamepad)
    if (e.gamepad.index === gamepadIndex.value) {
      gamepadIndex.value = null
      gamepadConnected.value = false
      stopMonitoring()
    }
  }

  /**
   * Start monitoring gamepad input
   */
  function startMonitoring() {
    if (isMonitoring.value) return
    isMonitoring.value = true
    requestAnimationFrame(monitorGamepadInput)
  }

  /**
   * Stop monitoring gamepad input
   */
  function stopMonitoring() {
    isMonitoring.value = false
  }

  /**
   * Enable gamepad support
   */
  function enable() {
    window.addEventListener('gamepadconnected', handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)

    // Check if gamepad already connected
    const gamepads = navigator.getGamepads?.() || navigator.webkitGetGamepads?.()
    if (gamepads) {
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          gamepadIndex.value = i
          gamepadConnected.value = true
          startMonitoring()
          break
        }
      }
    }
  }

  /**
   * Disable gamepad support
   */
  function disable() {
    window.removeEventListener('gamepadconnected', handleGamepadConnected)
    window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)
    stopMonitoring()
    gamepadConnected.value = false
    gamepadIndex.value = null
  }

  onMounted(() => {
    enable()
  })

  onBeforeUnmount(() => {
    disable()
  })

  return {
    gamepadConnected,
    getGamepad,
    enable,
    disable,
  }
}
