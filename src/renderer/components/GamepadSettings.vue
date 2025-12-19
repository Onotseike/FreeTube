<template>
  <FtSettingsSection
    :title="$t('Settings.Gamepad Settings.Gamepad Settings')"
  >
    <div class="switchColumnGrid">
      <div class="switchColumn">
        <FtToggleSwitch
          :label="$t('Settings.Gamepad Settings.Enable Gamepad Support')"
          :compact="true"
          :default-value="gamepadEnabled"
          @change="updateGamepadEnabled"
        />
      </div>
    </div>

    <div class="gamepadStatus">
      <span class="statusLabel">{{ $t('Settings.Gamepad Settings.Controller Status') }}</span>
      <span :class="['statusValue', gamepadConnected ? 'connected' : 'disconnected']">
        {{ gamepadConnected ? $t('Settings.Gamepad Settings.Connected') : $t('Settings.Gamepad Settings.Disconnected') }}
      </span>
    </div>

    <FtFlexBox>
      <FtSlider
        :label="$t('Settings.Gamepad Settings.Deadzone Threshold')"
        :default-value="deadzoneThreshold"
        :min-value="0.1"
        :max-value="0.9"
        :step="0.05"
        @change="updateDeadzoneThreshold"
      />
      <FtSelect
        :placeholder="$t('Settings.Gamepad Settings.Sensitivity')"
        :value="sensitivity"
        :select-names="sensitivityNames"
        :select-values="SENSITIVITY_VALUES"
        :icon="['fas', 'sliders']"
        @change="updateSensitivity"
      />
    </FtFlexBox>

    <h4 class="groupTitle">
      {{ $t('Settings.Gamepad Settings.Button Mappings') }}
    </h4>
    <div class="mappingGrid">
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.A') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Play Pause') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.B') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Back') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.X') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Fullscreen') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.Y') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Theatre Mode') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.LB') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Seek Backward') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.RB') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Seek Forward') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.Start') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Captions') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.Left Stick') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Volume Speed') }}</span>
      </div>
      <div class="mappingItem">
        <span class="buttonName">{{ $t('Settings.Gamepad Settings.Buttons.D-Pad') }}</span>
        <span class="action">{{ $t('Settings.Gamepad Settings.Actions.Navigate') }}</span>
      </div>
    </div>
  </FtSettingsSection>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/use-i18n-polyfill'

import FtFlexBox from './ft-flex-box/ft-flex-box.vue'
import FtSelect from './FtSelect/FtSelect.vue'
import FtSettingsSection from './FtSettingsSection/FtSettingsSection.vue'
import FtSlider from './FtSlider/FtSlider.vue'
import FtToggleSwitch from './FtToggleSwitch/FtToggleSwitch.vue'

import store from '../store/index'

const { t } = useI18n()

const SENSITIVITY_VALUES = ['low', 'medium', 'high']
const sensitivityNames = computed(() => [
  t('Settings.Gamepad Settings.Sensitivity Levels.Low'),
  t('Settings.Gamepad Settings.Sensitivity Levels.Medium'),
  t('Settings.Gamepad Settings.Sensitivity Levels.High')
])

const gamepadConnected = ref(false)

/** @type {import('vue').ComputedRef<boolean>} */
const gamepadEnabled = computed(() => store.getters.getGamepadEnabled ?? false)

/**
 * @param {boolean} value
 */
function updateGamepadEnabled(value) {
  store.dispatch('updateGamepadEnabled', value)
}

/** @type {import('vue').ComputedRef<number>} */
const deadzoneThreshold = computed(() => store.getters.getGamepadDeadzoneThreshold ?? 0.5)

/**
 * @param {number} value
 */
function updateDeadzoneThreshold(value) {
  store.dispatch('updateGamepadDeadzoneThreshold', value)
}

/** @type {import('vue').ComputedRef<string>} */
const sensitivity = computed(() => store.getters.getGamepadSensitivity ?? 'medium')

/**
 * @param {string} value
 */
function updateSensitivity(value) {
  store.dispatch('updateGamepadSensitivity', value)
}

function handleGamepadConnected() {
  gamepadConnected.value = true
}

function handleGamepadDisconnected() {
  gamepadConnected.value = false
}

onMounted(() => {
  window.addEventListener('gamepadconnected', handleGamepadConnected)
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)

  // Check if gamepad already connected
  const gamepads = navigator.getGamepads?.() ?? []
  gamepadConnected.value = gamepads.some(gp => gp !== null)
})

onUnmounted(() => {
  window.removeEventListener('gamepadconnected', handleGamepadConnected)
  window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)
})
</script>

<style scoped>
.gamepadStatus {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  font-size: 14px;
}

.gamepadStatus .statusLabel {
  color: var(--secondary-text-color);
}

.gamepadStatus .statusValue {
  font-weight: bold;
}

.gamepadStatus .connected {
  color: var(--success-color, #4caf50);
}

.gamepadStatus .disconnected {
  color: var(--tertiary-text-color);
}

.mappingGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.mappingItem {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--card-bg-color);
  border: 1px solid var(--tertiary-text-color);
  border-radius: 4px;
}

.buttonName {
  font-weight: bold;
  color: var(--primary-text-color);
}

.action {
  color: var(--secondary-text-color);
}
</style>
