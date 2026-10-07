import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { TherapyVideo } from '@/components/therapy/TherapyVideo';
import type { TherapyVideoHandle } from '@/components/therapy/TherapyVideo';
import { Ionicons } from '@/components/IoniconsSVG';
import { useColors } from '@/hooks/useColors';
import {
  therapyLessons,
  therapyReferences,
  therapyMedia,
  therapyDurationSeconds,
} from '@/data/therapyLessons';
import type { TherapyLesson, TherapyReference } from '@/data/therapyLessons';

export default function TherapyGuide() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [lessonId, setLessonId] = useState<string | null>(null);
  const lesson = therapyLessons.find((l) => l.id === lessonId) ?? null;
  const [videoError, setVideoError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [linkError, setLinkError] = useState<string | null>(null);
  const videoRef = useRef<TherapyVideoHandle>(null);
  const scrollRef = useRef<ScrollView>(null);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  useFocusEffect(useCallback(() => pause, [pause]));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') pause();
    });
    return () => sub.remove();
  }, [pause]);

  const open = (id: string | null) => {
    pause();
    setVideoError(false);
    setLinkError(null);
    setAttempt(0);
    setLessonId(id);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const back = () => (lesson ? open(null) : router.back());

  const openLink = async (url: string) => {
    try {
      setLinkError(null);
      await Linking.openURL(url);
    } catch {
      setLinkError('Could not open the link. Check your internet connection and try again.');
    }
  };

  const refs = lesson
    ? therapyReferences.filter((r) => lesson.referenceIds.includes(r.id))
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={back}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={lesson ? 'Back to lesson library' : 'Back to caregiver dashboard'}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1} accessibilityRole="header">
          {lesson ? lesson.title : 'Therapy Guide'}
        </Text>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}>
        <View style={[styles.notice, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '55' }]}>
          <Text style={[styles.noticeText, { color: colors.foreground }]}>
            Original Huda animations with captions and no audio. They are not clinician demonstrations. General education only: not diagnosis or treatment instructions. Cited sources do not endorse this app. Lessons and reference summaries are stored offline; external websites need internet.
          </Text>
        </View>

        {!lesson &&
          therapyLessons.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => open(l.id)}
              accessibilityRole="button"
              accessibilityLabel={`Open lesson: ${l.title}. ${l.category}`}
              style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.primary + '22' }]}>
                <Ionicons name="play" size={26} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.cat, { color: colors.primary }]}>{l.category}</Text>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{l.title}</Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>{l.summary}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </Pressable>
          ))}

        {lesson && (
          <LessonDetail
            lesson={lesson}
            colors={colors}
            refs={refs}
            videoRef={videoRef}
            attempt={attempt}
            videoError={videoError}
            setVideoError={setVideoError}
            retry={() => { setVideoError(false); setAttempt((a) => a + 1); }}
            openLink={openLink}
            linkError={linkError}
            others={therapyLessons.filter((l) => l.id !== lesson.id)}
            open={open}
          />
        )}
      </ScrollView>
    </View>
  );
}

interface LessonDetailProps {
  lesson: TherapyLesson;
  colors: ReturnType<typeof useColors>;
  refs: TherapyReference[];
  videoRef: React.RefObject<TherapyVideoHandle | null>;
  attempt: number;
  videoError: boolean;
  setVideoError: (error: boolean) => void;
  retry: () => void;
  openLink: (url: string) => Promise<void>;
  linkError: string | null;
  others: TherapyLesson[];
  open: (id: string | null) => void;
}

function LessonDetail({ lesson, colors, refs, videoRef, attempt, videoError, setVideoError, retry, openLink, linkError, others, open }: LessonDetailProps) {
  const H = (t: string) => (
    <Text style={[styles.h, { color: colors.foreground }]} accessibilityRole="header">{t}</Text>
  );
  const box = [styles.box, { backgroundColor: colors.card, borderColor: colors.border }];
  return (
    <>
      <Text style={[styles.body, { color: colors.foreground }]}>{lesson.summary}</Text>
      <View style={[styles.videoWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        {videoError ? (
          <View style={styles.videoErr}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.destructive} />
            <Text style={[styles.body, { color: colors.foreground, textAlign: 'center' }]}>This video could not be played.</Text>
            <Pressable
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel="Retry video"
              style={[styles.btn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <TherapyVideo
            key={`${lesson.id}-${attempt}`}
            ref={videoRef}
            source={therapyMedia[lesson.id]}
            onError={() => setVideoError(true)}
            label={`Video: ${lesson.title}`}
          />
        )}
      </View>
      <Text style={[styles.small, { color: colors.mutedForeground }]}>
        {therapyDurationSeconds}-second captioned animation, no audio.
      </Text>

      {H('Possible benefits')}
      <View style={box}>
        {lesson.benefits.map((b: string, i: number) => (
          <View key={i} style={styles.bullet}>
            <Text style={{ color: colors.primary }}>•</Text>
            <Text style={[styles.body, { color: colors.foreground, flex: 1 }]}>{b}</Text>
          </View>
        ))}
      </View>

      {H('Limitations')}
      <View style={box}><Text style={[styles.body, { color: colors.foreground }]}>{lesson.limitations}</Text></View>

      {H('Professional guidance')}
      <View style={box}><Text style={[styles.body, { color: colors.foreground }]}>{lesson.professional}</Text></View>

      {H('Full transcript')}
      <View style={box}>
        {lesson.segments.map((s, i) => (
          <View key={i} style={{ gap: 2 }}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{i + 1}. {s.heading}</Text>
            <Text style={[styles.body, { color: colors.foreground }]}>{s.caption}</Text>
          </View>
        ))}
      </View>

      {H('References')}
      {linkError && <Text style={[styles.body, { color: colors.destructive }]} accessibilityLiveRegion="polite">{linkError}</Text>}
      {refs.map((r) => (
        <View key={r.id} style={box}>
          <Text style={[styles.cat, { color: colors.primary }]}>{r.organization}</Text>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{r.title}</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>{r.summary}</Text>
          <Pressable
            onPress={() => openLink(r.url)}
            accessibilityRole="link"
            accessibilityLabel={`Open ${r.organization} website. Requires internet.`}
            style={[styles.btn, { borderColor: colors.primary, borderWidth: 1.5 }]}
          >
            <Ionicons name="open-outline" size={18} color={colors.primary} />
            <Text style={[styles.btnText, { color: colors.primary }]}>Open website (requires internet)</Text>
          </Pressable>
        </View>
      ))}

      {H('More lessons')}
      {others.map((l: TherapyLesson) => (
        <Pressable
          key={l.id}
          onPress={() => open(l.id)}
          accessibilityRole="button"
          accessibilityLabel={`Open lesson: ${l.title}`}
          style={[styles.box, styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>{l.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontFamily: 'Inter_700Bold' },
  content: { padding: 16, gap: 14 },
  notice: { padding: 14, borderRadius: 14, borderWidth: 1 },
  noticeText: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_500Medium' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, minHeight: 72 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cat: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', lineHeight: 22 },
  body: { fontSize: 15, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  small: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  h: { fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 8 },
  box: { padding: 14, borderRadius: 14, borderWidth: 1, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  bullet: { flexDirection: 'row', gap: 8 },
  videoWrap: { width: '100%', maxWidth: 360, aspectRatio: 9 / 16, alignSelf: 'center', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
  videoErr: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, paddingHorizontal: 16, borderRadius: 12 },
  btnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
