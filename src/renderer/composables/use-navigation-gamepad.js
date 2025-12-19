import { onMounted, onBeforeUnmount } from 'vue'
import { GamepadActions } from '../../constants'

export function useNavigationGamepad(containerSelector = 'body') {
  let focusedElement = null

  const navigationActionMap = {
    [GamepadActions.NAVIGATE_UP]: () => navigateFocus('up'),
    [GamepadActions.NAVIGATE_DOWN]: () => navigateFocus('down'),
    [GamepadActions.NAVIGATE_LEFT]: () => navigateFocus('left'),
    [GamepadActions.NAVIGATE_RIGHT]: () => navigateFocus('right'),
    [GamepadActions.SELECT]: () => activateFocusedElement(),
    [GamepadActions.BACK]: () => window.history.back(),
  }

  function getFocusableElements() {
    const container = document.querySelector(containerSelector)
    if (!container) return []

    return Array.from(
      container.querySelectorAll(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => {
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }

  function navigateFocus(direction) {
    const focusables = getFocusableElements()
    if (focusables.length === 0) return

    const currentIndex = focusables.indexOf(focusedElement)
    let nextIndex = 0

    if (direction === 'down' || direction === 'right') {
      nextIndex = (currentIndex + 1) % focusables.length
    } else if (direction === 'up' || direction === 'left') {
      nextIndex = (currentIndex - 1 + focusables.length) % focusables.length
    }

    focusedElement = focusables[nextIndex]
    focusedElement?.focus()
    focusedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function activateFocusedElement() {
    if (focusedElement) {
      if (focusedElement.tagName === 'INPUT') {
        focusedElement.click()
      } else {
        focusedElement.click()
      }
    }
  }

  function handleGamepadAction(event) {
    const { action } = event.detail
    const handler = navigationActionMap[action]
    if (handler) {
      handler()
    }
  }

  onMounted(() => {
    // Set initial focus
    focusedElement = document.querySelector(containerSelector)
    window.addEventListener('gamepad-action', handleGamepadAction)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('gamepad-action', handleGamepadAction)
  })

  return {
    navigateFocus,
    activateFocusedElement,
  }
}
