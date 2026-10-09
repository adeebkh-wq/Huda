/**
 * Huda's small audio service, backed by SDK 57 expo-audio.
 * Keeps recording/playback ownership explicit for the existing imperative UI.
 * There is no dependency on the removed native AV module.
 */
import {
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import type { AudioPlayer, AudioSource, AudioStatus } from 'expo-audio';

export const InterruptionModeIOS = { DoNotMix: 'doNotMix' } as const;
export const InterruptionModeAndroid = { DoNotMix: 'doNotMix' } as const;

export interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  didJustFinish: boolean;
  currentTime: number;
  duration: number;
  error?: string;
}
type StatusListener = ((status: PlaybackStatus) => void) | null;
interface PlaybackOptions {
  shouldPlay?: boolean;
  isLooping?: boolean;
  volume?: number;
  rate?: number;
  shouldCorrectPitch?: boolean;
}
interface AudioSettings {
  allowsRecordingIOS?: boolean;
  playsInSilentModeIOS?: boolean;
  staysActiveInBackground?: boolean;
  playThroughEarpieceAndroid?: boolean;
  shouldDuckAndroid?: boolean;
  interruptionModeIOS?: 'doNotMix';
  interruptionModeAndroid?: 'doNotMix';
}

const toStatus = (status: AudioStatus): PlaybackStatus => ({
  isLoaded: status.isLoaded,
  isPlaying: status.playing,
  didJustFinish: status.didJustFinish,
  currentTime: status.currentTime,
  duration: status.duration,
  error: status.error ?? undefined,
});

export namespace Audio {
  export const setAudioModeAsync = (settings: AudioSettings) =>
    applyAudioMode({
      allowsRecording: settings.allowsRecordingIOS ?? false,
      playsInSilentMode: settings.playsInSilentModeIOS ?? true,
      shouldPlayInBackground: settings.staysActiveInBackground ?? false,
      shouldRouteThroughEarpiece: settings.playThroughEarpieceAndroid ?? false,
      interruptionMode: settings.interruptionModeIOS ?? settings.interruptionModeAndroid ??
        (settings.shouldDuckAndroid ? 'duckOthers' : 'doNotMix'),
    });

  export class Sound {
    private listener: StatusListener = null;
    private subscription: { remove(): void };
    private released = false;

    private constructor(private player: AudioPlayer) {
      this.subscription = player.addListener('playbackStatusUpdate', (status) => {
        this.listener?.(toStatus(status));
      });
    }

    static async createAsync(
      source: AudioSource,
      options: PlaybackOptions = {},
      listener: StatusListener = null,
      downloadFirst = false,
    ) {
      const player = createAudioPlayer(source, { downloadFirst, updateInterval: 100 });
      const sound = new Sound(player);
      sound.listener = listener;
      player.volume = options.volume ?? 1;
      player.loop = options.isLooping ?? false;
      player.shouldCorrectPitch = options.shouldCorrectPitch ?? false;
      if (options.rate != null) player.setPlaybackRate(options.rate);
      try {
        const deadline = Date.now() + 20000;
        while (!player.isLoaded) {
          if (player.currentStatus.error) throw new Error(player.currentStatus.error);
          if (Date.now() >= deadline) throw new Error('Audio could not be loaded.');
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        if (options.shouldPlay) player.play();
        return { sound };
      } catch (error) {
        await sound.unloadAsync();
        throw error;
      }
    }

    setOnPlaybackStatusUpdate(listener: StatusListener) { this.listener = listener; }
    async getStatusAsync(): Promise<PlaybackStatus> {
      return this.released
        ? { isLoaded: false, isPlaying: false, didJustFinish: false, currentTime: 0, duration: 0 }
        : toStatus(this.player.currentStatus);
    }
    async playAsync() { this.player.play(); }
    async stopAsync() { this.player.pause(); await this.player.seekTo(0); }
    async replayAsync() { await this.player.seekTo(0); this.player.play(); }
    async playFromPositionAsync(milliseconds: number) {
      await this.player.seekTo(milliseconds / 1000);
      this.player.play();
    }
    async setIsLoopingAsync(loop: boolean) { this.player.loop = loop; }
    async setVolumeAsync(volume: number) { this.player.volume = volume; }
    async unloadAsync() {
      if (this.released) return;
      this.released = true;
      this.listener = null;
      this.subscription.remove();
      this.player.remove();
    }
  }

}

// Avoid shadowing the SDK function inside the exported namespace.
const applyAudioMode = setAudioModeAsync;
