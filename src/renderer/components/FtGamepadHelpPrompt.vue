<template>
  <FtPrompt
    :title="$t('GamepadHelp.Title')"
    @click="store.dispatch('closeGamepadHelpPrompt')"
  >
    <div class="gamepad-help-content">
      <div class="help-section">
        <h3>{{ $t('KeyboardShortcutPrompt.Sections.Video.Playback') }}</h3>
        <ul>
          <li>{{ $t('GamepadHelp.PlayPause') }}</li>
          <li>{{ $t('GamepadHelp.SeekLeft') }}</li>
          <li>{{ $t('GamepadHelp.SeekRight') }}</li>
          <li>{{ $t('GamepadHelp.VolumeUpDown') }}</li>
        </ul>
      </div>

      <div class="help-section">
        <h3>{{ $t('KeyboardShortcutPrompt.Sections.Video.General') }}</h3>
        <ul>
          <li>{{ $t('GamepadHelp.Fullscreen') }}</li>
          <li>{{ $t('GamepadHelp.TheatreMode') }}</li>
          <li>{{ $t('GamepadHelp.SpeedControl') }}</li>
        </ul>
      </div>

      <div class="help-section">
        <h3>{{ $t('GamepadHelp.ButtonMapping') }}</h3>
        <ul>
          <li>{{ $t('GamepadHelp.NavigateUI') }}</li>
          <li>{{ $t('GamepadHelp.Select') }}</li>
          <li>{{ $t('GamepadHelp.Back') }}</li>
        </ul>
      </div>
    </div>
  </FtPrompt>
</template>

<script setup>
import store from '../../store/index'
import FtPrompt from '../FtPrompt/FtPrompt.vue'
</script>

<style scoped lang="scss">
.gamepad-help-content {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .help-section {
    h3 {
      margin-bottom: 10px;
      font-size: 1.1em;
    }

    ul {
      list-style: none;
      padding-left: 0;

      li {
        padding: 5px 0;
        padding-left: 20px;
        position: relative;

        &::before {
          content: '•';
          position: absolute;
          left: 0;
        }
      }
    }
  }
}
</style>
