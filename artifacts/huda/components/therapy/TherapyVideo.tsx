import React, { useEffect, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export interface TherapyVideoHandle {
  pause: () => void;
}

interface Props {
  source: number;
  label: string;
  onError: () => void;
  ref: React.Ref<TherapyVideoHandle>;
}

export function TherapyVideo({ source, label, onError, ref }: Props) {
  // The hook releases the player when a lesson is switched or this view unmounts.
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.pause();
  });

  useImperativeHandle(ref, () => ({ pause: () => player.pause() }), [player]);
  useEffect(() => {
    if (player.status === 'error') onError();
    const subscription = player.addListener('statusChange', ({ status }) => {
      if (status === 'error') onError();
    });
    return () => subscription.remove();
  }, [player, onError]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      contentFit="contain"
      surfaceType="textureView"
      accessibilityLabel={label}
    />
  );
}

const styles = StyleSheet.create({
  video: { width: '100%', height: '100%' },
});
