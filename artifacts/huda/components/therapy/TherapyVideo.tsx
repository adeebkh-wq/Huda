import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { LanguageCode } from '@/data/translations';
import type { TherapySubtitleSegment } from '@/data/therapySubtitles';
import { THERAPY_VIDEO_BACKGROUND, THERAPY_VIDEO_TEXT } from '@/data/therapyVideoTheme';

export interface TherapyVideoHandle {
  pause: () => void;
  playFromStart: () => void;
  setLooping: (looping: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

interface Props {
  source: number;
  label: string;
  segments: TherapySubtitleSegment[];
  language: LanguageCode;
  narrationProgress: number | null;
  onPlayingChange: (isPlaying: boolean) => void;
  onError: () => void;
  ref: React.Ref<TherapyVideoHandle>;
}

export function TherapyVideo({
  source,
  label,
  segments,
  language,
  narrationProgress,
  onPlayingChange,
  onError,
  ref,
}: Props) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const narrationProgressRef = useRef<number | null>(null);

  // The hook releases the player when a lesson is switched or this view unmounts.
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.25;
    p.pause();
  });

  useImperativeHandle(ref, () => ({
    pause: () => player.pause(),
    playFromStart: () => {
      player.currentTime = 0;
      player.play();
    },
    setLooping: (looping) => {
      player.loop = looping;
    },
    setPlaybackRate: (rate) => {
      player.playbackRate = rate;
    },
  }), [player]);

  useEffect(() => {
    narrationProgressRef.current = narrationProgress;
    if (narrationProgress === null || segments.length === 0) return;

    const weights = segments.map(({ caption }) => Math.max(1, caption.trim().length));
    const totalWeight = weights.reduce((total, weight) => total + weight, 0);
    let position = Math.min(0.9999, Math.max(0, narrationProgress)) * totalWeight;
    let nextIndex = weights.length - 1;
    for (let index = 0; index < weights.length; index += 1) {
      if (position < weights[index]) {
        nextIndex = index;
        break;
      }
      position -= weights[index];
    }
    setSegmentIndex((current) => current === nextIndex ? current : nextIndex);
  }, [narrationProgress, segments]);

  useEffect(() => {
    if (player.status === 'error') onError();
    const subscription = player.addListener('statusChange', ({ status }) => {
      if (status === 'error') onError();
    });
    return () => subscription.remove();
  }, [player, onError]);

  useEffect(() => {
    const timeSubscription = player.addListener('timeUpdate', ({ currentTime }) => {
      if (narrationProgressRef.current !== null) return;
      if (!Number.isFinite(currentTime) || segments.length === 0) return;
      const nextIndex = Math.min(segments.length - 1, Math.max(0, Math.floor(currentTime / 8)));
      setSegmentIndex((current) => current === nextIndex ? current : nextIndex);
    });
    const playingSubscription = player.addListener('playingChange', ({ isPlaying }) => {
      onPlayingChange(isPlaying);
    });
    return () => {
      timeSubscription.remove();
      playingSubscription.remove();
    };
  }, [player, segments.length, onPlayingChange]);

  const onFrameLayout = (event: LayoutChangeEvent) => {
    setFrameWidth(event.nativeEvent.layout.width);
  };
  const currentSegment = segments[segmentIndex] ?? segments[0];
  const scale = frameWidth > 0 ? frameWidth / 540 : 0.6;
  const isArabic = language === 'ar';

  return (
    <View style={styles.frame} onLayout={onFrameLayout}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        nativeControls
        contentFit="contain"
        surfaceType="textureView"
        accessibilityLabel={label}
      />
      {currentSegment && (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
          <View style={styles.headingMask}>
            <Text
              style={[
                styles.heading,
                {
                  color: THERAPY_VIDEO_TEXT,
                  fontSize: 34 * scale,
                  lineHeight: 43 * scale,
                  textAlign: isArabic ? 'right' : 'left',
                  writingDirection: isArabic ? 'rtl' : 'ltr',
                },
              ]}
              numberOfLines={3}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {currentSegment.heading}
            </Text>
          </View>
          <View style={styles.captionMask}>
            <Text
              style={[
                styles.caption,
                {
                  color: THERAPY_VIDEO_TEXT,
                  fontSize: 24 * scale,
                  lineHeight: 33 * scale,
                  textAlign: isArabic ? 'right' : 'left',
                  writingDirection: isArabic ? 'rtl' : 'ltr',
                },
              ]}
              numberOfLines={5}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {currentSegment.caption}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', height: '100%', position: 'relative' },
  headingMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '12.7%',
    height: '16.2%',
    justifyContent: 'center',
    paddingHorizontal: '5.9%',
    backgroundColor: THERAPY_VIDEO_BACKGROUND,
  },
  heading: { fontFamily: 'Inter_700Bold' },
  captionMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '62.5%',
    height: '20%',
    justifyContent: 'center',
    paddingHorizontal: '5.9%',
    backgroundColor: THERAPY_VIDEO_BACKGROUND,
  },
  caption: { fontFamily: 'Inter_400Regular' },
});
