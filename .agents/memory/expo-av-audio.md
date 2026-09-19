---
name: expo-av audio recording/playback setup
description: Required Audio.setAudioModeAsync calls before recording or playback in expo-av
---

**Rule:** Before recording: `Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })`. Before playback: `Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true })`. Always unload previous Sound instances before creating a new one.

**Why:** iOS will silently fail or play through wrong audio session if mode is not set. Android is more lenient but iOS requires explicit session configuration.

**How to apply:** Any component that records or plays audio must call setAudioModeAsync first. Keep a ref to the current Sound instance and call unloadAsync() before creating a new one to avoid memory leaks.
