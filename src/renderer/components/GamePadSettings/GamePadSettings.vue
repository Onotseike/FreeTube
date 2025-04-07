<template>
  <ft-settings-section :title="$t('Settings.GamePad Settings')">
    <h4
      class="groupTitle"
    >
      {{ $t('Settings.GamePad Settings.Configure Gamepad Support') }}
    </h4>
  </ft-settings-section>
</template>

<script>
import GamepadMapping from '../../helpers/gamepad/gamepadmapping'

export default {
  name: 'GamePadSettings',
  data() {
    return {
      gamepadMapping: new GamepadMapping(),
      selectedButton: null,
      selectedAction: '',
      buttonMappings: {},
    }
  },
  mounted() {
    this.pollGamepad()
  },
  methods: {
    pollGamepad() {
      const poll = () => {
        const gamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(gp => gp) : []
        gamepads.forEach((gamepad) => {
          gamepad.buttons.forEach((button, index) => {
            if (button.pressed && this.selectedButton === null) {
              this.selectedButton = index
            }
          })
        })
        requestAnimationFrame(poll)
      }
      poll()
    },
    assignAction() {
      if (this.selectedButton !== null && this.selectedAction) {
        this.gamepadMapping.updateMapping(this.selectedButton, this.selectedAction)
        this.buttonMappings = { ...this.gamepadMapping.buttonMappings }
        this.selectedButton = null
        this.selectedAction = ''
      }
    },
  },
}
</script>
<style scoped src="./GamePadSettings.css" />
