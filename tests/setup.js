import { vi } from 'vitest'

// Mock navigator.getGamepads
global.navigator.getGamepads = vi.fn(() => [])
global.navigator.webkitGetGamepads = vi.fn(() => [])

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0))

// Mock CustomEvent for old browsers
if (typeof global.CustomEvent !== 'function') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(event, params) {
      super(event, params)
      this.detail = params?.detail
    }
  }
}

// Mock window.dispatchEvent
global.window.dispatchEvent = vi.fn()

// Setup common mocks
beforeEach(() => {
  vi.clearAllMocks()
})
