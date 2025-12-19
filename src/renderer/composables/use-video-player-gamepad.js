import { onMounted, onBeforeUnmount } from 'vue'
import { GamepadActions } from '../../constants'

export function useVideoPlayerGamepad(playerInstance) {
  const gamepadActionMap = {
    // Playback control
    [GamepadActions.PLAY_PAUSE]: () => {
      const video = playerInstance.video.value
      video.paused ? video.play() : video.pause()
    },

    [GamepadActions.MUTE]: () => {
      const video = playerInstance.video.value
      video.muted = !video.muted
    },

    [GamepadActions.VOLUME_UP]: () => {
      playerInstance.changeVolume(0.05)
    },

    [GamepadActions.VOLUME_DOWN]: () => {
      playerInstance.changeVolume(-0.05)
    },

    [GamepadActions.SEEK_FORWARD]: (details) => {
      const seconds = details.distance ? 10 * details.distance : 5
      playerInstance.seekBySeconds(seconds, false, true)
    },

    [GamepadActions.SEEK_BACKWARD]: (details) => {
      const seconds = details.distance ? 10 * details.distance : 5
      playerInstance.seekBySeconds(-seconds, false, true)
    },

    [GamepadActions.SKIP_FORWARD]: () => {
      playerInstance.$emit('skip-to-next')
    },

    [GamepadActions.SKIP_BACKWARD]: () => {
      playerInstance.$emit('skip-to-prev')
    },

    // Player modes
    [GamepadActions.FULLSCREEN]: () => {
      playerInstance.ui.getControls().toggleFullScreen()
    },

    [GamepadActions.THEATRE_MODE]: () => {
      playerInstance.$emit('toggle-theatre-mode')
    },

    [GamepadActions.BACK]: () => {
      // Navigate back in browser history
      window.history.back()
    },

    [GamepadActions.PICTURE_IN_PICTURE]: () => {
      const controls = playerInstance.ui.getControls()
      if (controls.isPiPAllowed()) {
        controls.togglePiP()
      }
    },

    [GamepadActions.CAPTIONS]: () => {
      if (playerInstance.player.getTextTracks().length > 0) {
        const currentlyVisible = playerInstance.player.isTextTrackVisible()
        playerInstance.player.setTextTrackVisibility(!currentlyVisible)
      }
    },

    [GamepadActions.SPEED_UP]: () => {
      playerInstance.changePlayBackRate(0.25)
    },

    [GamepadActions.SPEED_DOWN]: () => {
      playerInstance.changePlayBackRate(-0.25)
    },
  }

  function handleGamepadAction(event) {
    const { action, ...details } = event.detail
    const handler = gamepadActionMap[action]
    if (handler) {
      handler(details)
    }
  }

  onMounted(() => {
    window.addEventListener('gamepad-action', handleGamepadAction)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('gamepad-action', handleGamepadAction)
  })

  return {
    gamepadActionMap,
  }
}
