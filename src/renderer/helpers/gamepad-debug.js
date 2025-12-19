// src/renderer/helpers/gamepad-debug.js
window.DEBUG_GAMEPAD = () => {
  const gamepad = navigator.getGamepads()[0]
  console.warn('Gamepad State:', {
    buttons: gamepad.buttons.map(b => b.pressed),
    axes: gamepad.axes.map(a => a.toFixed(2))
  })
}
