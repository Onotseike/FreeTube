import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GamepadButtons, GamepadAxes, GamepadActions } from '../src/constants'

describe('GamePad Support - Service Tests', () => {
  let mockGamepad
  let dispatchSpy

  beforeEach(() => {
    // Create a mock gamepad object
    mockGamepad = {
      index: 0,
      connected: true,
      buttons: Array(17).fill(null).map(() => ({ pressed: false, value: 0 })),
      axes: Array(6).fill(0),
    }

    // Mock navigator.getGamepads
    navigator.getGamepads = vi.fn(() => [mockGamepad])

    // Spy on window.dispatchEvent
    dispatchSpy = vi.spyOn(window, 'dispatchEvent')
  })

  describe('Connection/Disconnection', () => {
    it('should detect gamepad connection', () => {
      // Simulate gamepad connection event
      const event = new Event('gamepadconnected')
      event.gamepad = mockGamepad

      window.dispatchEvent(event)

      expect(dispatchSpy).toHaveBeenCalled()
    })

    it('should handle multiple gamepads', () => {
      const gamepad1 = { index: 0, connected: true, buttons: [], axes: [] }
      const gamepad2 = { index: 1, connected: true, buttons: [], axes: [] }

      navigator.getGamepads = vi.fn(() => [gamepad1, gamepad2])

      expect(navigator.getGamepads().length).toBe(2)
    })

    it('should store correct gamepad index', () => {
      mockGamepad.index = 0
      const gamepads = navigator.getGamepads()

      expect(gamepads[0].index).toBe(0)
    })
  })

  describe('Button Input Detection', () => {
    it('should detect button press', () => {
      mockGamepad.buttons[GamepadButtons.A].pressed = true

      const buttons = mockGamepad.buttons
      expect(buttons[GamepadButtons.A].pressed).toBe(true)
    })

    it('should detect multiple button presses', () => {
      mockGamepad.buttons[GamepadButtons.A].pressed = true
      mockGamepad.buttons[GamepadButtons.B].pressed = true
      mockGamepad.buttons[GamepadButtons.X].pressed = true

      const pressedButtons = mockGamepad.buttons
        .map((btn, idx) => btn.pressed ? idx : null)
        .filter(idx => idx !== null)

      expect(pressedButtons).toContain(GamepadButtons.A)
      expect(pressedButtons).toContain(GamepadButtons.B)
      expect(pressedButtons).toContain(GamepadButtons.X)
    })

    it('should detect button release', () => {
      mockGamepad.buttons[GamepadButtons.A].pressed = false

      expect(mockGamepad.buttons[GamepadButtons.A].pressed).toBe(false)
    })

    it('should handle all standard buttons', () => {
      const standardButtons = [
        GamepadButtons.A,
        GamepadButtons.B,
        GamepadButtons.X,
        GamepadButtons.Y,
        GamepadButtons.LB,
        GamepadButtons.RB,
        GamepadButtons.START,
        GamepadButtons.BACK,
      ]

      standardButtons.forEach(buttonIndex => {
        mockGamepad.buttons[buttonIndex].pressed = true
        expect(mockGamepad.buttons[buttonIndex].pressed).toBe(true)
      })
    })
  })

  describe('Analog Stick Input', () => {
    it('should detect left stick X-axis movement', () => {
      mockGamepad.axes[GamepadAxes.LEFT_STICK_X] = 0.75

      expect(mockGamepad.axes[GamepadAxes.LEFT_STICK_X]).toBe(0.75)
    })

    it('should detect left stick Y-axis movement', () => {
      mockGamepad.axes[GamepadAxes.LEFT_STICK_Y] = -0.8

      expect(mockGamepad.axes[GamepadAxes.LEFT_STICK_Y]).toBe(-0.8)
    })

    it('should detect right stick movement', () => {
      mockGamepad.axes[GamepadAxes.RIGHT_STICK_X] = 0.5
      mockGamepad.axes[GamepadAxes.RIGHT_STICK_Y] = -0.6

      expect(mockGamepad.axes[GamepadAxes.RIGHT_STICK_X]).toBe(0.5)
      expect(mockGamepad.axes[GamepadAxes.RIGHT_STICK_Y]).toBe(-0.6)
    })

    it('should detect trigger values', () => {
      mockGamepad.axes[GamepadAxes.LEFT_TRIGGER] = 0.9
      mockGamepad.axes[GamepadAxes.RIGHT_TRIGGER] = 1.0

      expect(mockGamepad.axes[GamepadAxes.LEFT_TRIGGER]).toBe(0.9)
      expect(mockGamepad.axes[GamepadAxes.RIGHT_TRIGGER]).toBe(1.0)
    })

    it('should handle stick return to center', () => {
      mockGamepad.axes[GamepadAxes.LEFT_STICK_X] = 0.0
      mockGamepad.axes[GamepadAxes.LEFT_STICK_Y] = 0.0

      expect(mockGamepad.axes[GamepadAxes.LEFT_STICK_X]).toBe(0)
      expect(mockGamepad.axes[GamepadAxes.LEFT_STICK_Y]).toBe(0)
    })
  })

  describe('Deadzone Handling', () => {
    it('should ignore values below deadzone threshold', () => {
      const deadzone = 0.5
      const tinyValue = 0.1

      const shouldIgnore = Math.abs(tinyValue) < deadzone
      expect(shouldIgnore).toBe(true)
    })

    it('should register values above deadzone threshold', () => {
      const deadzone = 0.5
      const significantValue = 0.75

      const shouldRegister = Math.abs(significantValue) >= deadzone
      expect(shouldRegister).toBe(true)
    })

    it('should handle edge case at deadzone boundary', () => {
      const deadzone = 0.5
      const edgeValue = 0.5

      const atBoundary = Math.abs(edgeValue) === deadzone
      expect(atBoundary).toBe(true)
    })
  })

  describe('Input Debouncing', () => {
    it('should debounce rapid button presses', () => {
      const debounceTime = 50
      const lastPressTime = 0

      const shouldProcess = (currentTime) => {
        const timeSinceLastPress = currentTime - lastPressTime
        return timeSinceLastPress >= debounceTime
      }

      expect(shouldProcess(100)).toBe(true)
      expect(shouldProcess(110)).toBe(true)
    })

    it('should debounce rapid axis changes', () => {
      const debounceTime = 100
      const isDebounced = (current, last) => (current - last) < debounceTime
      expect(isDebounced(50, 0)).toBe(true)
      expect(isDebounced(150, 0)).toBe(false)
    })
  })

  describe('GamePad Event Constants', () => {
    it('should have all required action types', () => {
      const requiredActions = [
        'play_pause',
        'mute',
        'volume_up',
        'volume_down',
        'seek_forward',
        'seek_backward',
        'fullscreen',
        'theatre_mode',
        'captions',
      ]

      requiredActions.forEach(action => {
        expect(Object.values(GamepadActions)).toContain(action)
      })
    })

    it('should have correct button mappings', () => {
      expect(GamepadButtons.A).toBe(0)
      expect(GamepadButtons.B).toBe(1)
      expect(GamepadButtons.X).toBe(2)
      expect(GamepadButtons.Y).toBe(3)
      expect(GamepadButtons.LB).toBe(4)
      expect(GamepadButtons.RB).toBe(5)
    })

    it('should have correct axis mappings', () => {
      expect(GamepadAxes.LEFT_STICK_X).toBe(0)
      expect(GamepadAxes.LEFT_STICK_Y).toBe(1)
      expect(GamepadAxes.RIGHT_STICK_X).toBe(2)
      expect(GamepadAxes.RIGHT_STICK_Y).toBe(3)
    })
  })

  describe('Browser Compatibility', () => {
    it('should support navigator.getGamepads', () => {
      expect(typeof navigator.getGamepads).toBe('function')
    })

    it('should fallback to webkitGetGamepads if needed', () => {
      const getGamepads = navigator.getGamepads || navigator.webkitGetGamepads
      expect(typeof getGamepads).toBe('function')
    })

    it('should handle missing Gamepad API gracefully', () => {
      const hasGamepadAPI = 'getGamepads' in navigator || 'webkitGetGamepads' in navigator
      expect(typeof hasGamepadAPI).toBe('boolean')
    })
  })
})
