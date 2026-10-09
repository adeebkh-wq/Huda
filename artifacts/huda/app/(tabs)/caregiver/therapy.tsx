import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { TherapyVideo } from '@/components/therapy/TherapyVideo';
import type { TherapyVideoHandle } from '@/components/therapy/TherapyVideo';
import { Ionicons } from '@/components/IoniconsSVG';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/data/translations';
import { getTherapySubtitles } from '@/data/therapySubtitles';
import {
  getTherapyGuideCopy,
  localizeTherapyLesson,
  localizeTherapyReferenceSummary,
} from '@/data/therapyGuideTranslations';
import {
  therapyLessons,
  therapyReferences,
  therapyMedia,
  therapyDurationSeconds,
} from '@/data/therapyLessons';
import type { TherapyLesson, TherapyReference } from '@/data/therapyLessons';

export default function TherapyGuide() {
  const colors = useColors();
  const { appLanguage } = useApp();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [lessonId, setLessonId] = useState<string | null>(null);
  const lesson = therapyLessons.find((l) => l.id === lessonId) ?? null;
  const [videoError, setVideoError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [linkError, setLinkError] = useState(false);
  const copy = getTherapyGuideCopy(appLanguage);
  const displayLesson = lesson ? localizeTherapyLesson(lesson, appLanguage) : null;
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
    setLinkError(false);
    setAttempt(0);
    setLessonId(id);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const back = () => (lesson ? open(null) : router.back());

  const openLink = async (url: string) => {
    try {
      setLinkError(false);
      await Linking.openURL(url);
    } catch {
      setLinkError(true);
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
          accessibilityLabel={lesson ? copy.backToLessonLibrary : copy.backToCaregiverDashboard}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1} accessibilityRole="header">
          {displayLesson ? displayLesson.title : copy.title}
        </Text>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}>
        <View style={[styles.notice, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '55' }]}>
            <Text style={[
              styles.noticeText,
              { color: colors.foreground },
              appLanguage === 'ar' && styles.rtlText,
            ]}>
            {copy.notice}
          </Text>
        </View>

        {!lesson &&
          therapyLessons.map((l) => {
            const localizedLesson = localizeTherapyLesson(l, appLanguage);
            return (
              <Pressable
                key={l.id}
                onPress={() => open(l.id)}
                accessibilityRole="button"
                accessibilityLabel={`${copy.openLesson}: ${localizedLesson.title}. ${localizedLesson.category}`}
                style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={[styles.cardIcon, { backgroundColor: colors.primary + '22' }]}>
                  <Ionicons name="play" size={26} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.cat, { color: colors.primary }, appLanguage === 'ar' && styles.rtlText]}>{localizedLesson.category}</Text>
                  <Text style={[styles.cardTitle, { color: colors.foreground }, appLanguage === 'ar' && styles.rtlText]}>{localizedLesson.title}</Text>
                  <Text style={[styles.body, { color: colors.mutedForeground }, appLanguage === 'ar' && styles.rtlText]}>{localizedLesson.summary}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </Pressable>
            );
          })}

        {lesson && (
          <LessonDetail
            lesson={lesson}
            colors={colors}
            refs={refs}
            videoRef={videoRef}
            appLanguage={appLanguage}
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
  appLanguage: LanguageCode;
  attempt: number;
  videoError: boolean;
  setVideoError: (error: boolean) => void;
  retry: () => void;
  openLink: (url: string) => Promise<void>;
  linkError: boolean;
  others: TherapyLesson[];
  open: (id: string | null) => void;
}

function LessonDetail({
  lesson,
  colors,
  refs,
  videoRef,
  appLanguage,
  attempt,
  videoError,
  setVideoError,
  retry,
  openLink,
  linkError,
  others,
  open,
}: LessonDetailProps) {
  const copy = getTherapyGuideCopy(appLanguage);
  const localizedLesson = localizeTherapyLesson(lesson, appLanguage);
  const isArabic = appLanguage === 'ar';
  const subtitles = getTherapySubtitles(lesson.id, appLanguage, lesson.segments);
  const subtitleLanguage = SUPPORTED_LANGUAGES.find(({ code }) => code === appLanguage)?.native ?? 'English';
  const durationLabel = copy.durationTemplate
    .replace('{seconds}', String(therapyDurationSeconds))
    .replace('{language}', subtitleLanguage);
  const H = (t: string) => (
    <Text style={[styles.h, { color: colors.foreground }, isArabic && styles.rtlText]} accessibilityRole="header">{t}</Text>
  );
  const box = [styles.box, { backgroundColor: colors.card, borderColor: colors.border }];
  return (
    <>
      <Text style={[styles.body, { color: colors.foreground }, isArabic && styles.rtlText]}>{localizedLesson.summary}</Text>
      <View style={[styles.videoWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        {videoError ? (
          <View style={styles.videoErr}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.destructive} />
            <Text style={[styles.body, { color: colors.foreground, textAlign: 'center' }]}>{copy.videoError}</Text>
            <Pressable
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel={copy.retryVideo}
              style={[styles.btn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.btnText, { color: colors.primaryForeground }]}>{copy.retry}</Text>
            </Pressable>
          </View>
        ) : (
          <TherapyVideo
            key={`${lesson.id}-${attempt}`}
            ref={videoRef}
            source={therapyMedia[lesson.id]}
            segments={subtitles}
            language={appLanguage}
            onError={() => setVideoError(true)}
            label={`${copy.videoLabel} ${localizedLesson.title}`}
          />
        )}
      </View>
      <Text style={[styles.small, { color: colors.mutedForeground }]}>
        {durationLabel}
      </Text>

      {H(copy.possibleBenefits)}
      <View style={box}>
        {localizedLesson.benefits.map((b: string, i: number) => (
          <View key={i} style={[styles.bullet, isArabic && styles.bulletRtl]}>
            <Text style={{ color: colors.primary }}>•</Text>
            <Text style={[styles.body, { color: colors.foreground, flex: 1 }, isArabic && styles.rtlText]}>{b}</Text>
          </View>
        ))}
      </View>

      {H(copy.limitations)}
      <View style={box}><Text style={[styles.body, { color: colors.foreground }, isArabic && styles.rtlText]}>{localizedLesson.limitations}</Text></View>

      {H(copy.professionalGuidance)}
      <View style={box}><Text style={[styles.body, { color: colors.foreground }, isArabic && styles.rtlText]}>{localizedLesson.professional}</Text></View>

      {H(copy.fullTranscript)}
      <View style={box}>
        {lesson.segments.map((s, i) => (
          <View key={i} style={{ gap: 2 }}>
            <Text style={[styles.cardTitle, { color: colors.foreground }, isArabic && styles.rtlText]}>{i + 1}. {subtitles[i]?.heading ?? s.heading}</Text>
            <Text style={[styles.body, { color: colors.foreground }, isArabic && styles.rtlText]}>{subtitles[i]?.caption ?? s.caption}</Text>
          </View>
        ))}
      </View>

      {H(copy.references)}
      {linkError && <Text style={[styles.body, { color: colors.destructive }, isArabic && styles.rtlText]} accessibilityLiveRegion="polite">{copy.couldNotOpenLink}</Text>}
      {refs.map((r) => (
        <View key={r.id} style={box}>
          <Text style={[styles.cat, { color: colors.primary }, isArabic && styles.rtlText]}>{r.organization}</Text>
          <Text style={[styles.cardTitle, { color: colors.foreground }, isArabic && styles.rtlText]}>{r.title}</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }, isArabic && styles.rtlText]}>
            {localizeTherapyReferenceSummary(r.id, r.summary, appLanguage)}
          </Text>
          <Pressable
            onPress={() => openLink(r.url)}
            accessibilityRole="link"
            accessibilityLabel={`${copy.openWebsite}: ${r.organization}. ${copy.internetRequired}`}
            style={[styles.btn, { borderColor: colors.primary, borderWidth: 1.5 }]}
          >
            <Ionicons name="open-outline" size={18} color={colors.primary} />
            <Text style={[styles.btnText, { color: colors.primary }, isArabic && styles.rtlText]}>{copy.openWebsite}</Text>
          </Pressable>
        </View>
      ))}

      {H(copy.moreLessons)}
      {others.map((l: TherapyLesson) => (
        (() => {
          const otherLesson = localizeTherapyLesson(l, appLanguage);
          return (
            <Pressable
              key={l.id}
              onPress={() => open(l.id)}
              accessibilityRole="button"
              accessibilityLabel={`${copy.openLesson}: ${otherLesson.title}`}
              style={[styles.box, styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }, isArabic && styles.rtlText]}>{otherLesson.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </Pressable>
          );
        })()
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
  bulletRtl: { flexDirection: 'row-reverse' },
  videoWrap: { width: '100%', maxWidth: 360, aspectRatio: 9 / 16, alignSelf: 'center', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
  videoErr: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, paddingHorizontal: 16, borderRadius: 12 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  btnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
