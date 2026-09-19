/**
 * Temporary diagnostic page — NOT behind auth.
 * Navigate to /test-sounds in the web preview.
 * It auto-runs on mount, logs every step, and shows results on screen.
 * DELETE this file once sounds are confirmed working.
 */
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';

const RAIN = require('@/assets/sounds/calm/rain.wav');

type Line = { ok: boolean; text: string };

export default function TestSoundsPage() {
  const [lines, setLines] = useState<Line[]>([{ ok: true, text: 'Starting…' }]);

  const log = (ok: boolean, text: string) => {
    console.log(`[TestSounds] ${ok ? 'OK' : 'ERR'} ${text}`);
    setLines((prev) => [...prev, { ok, text }]);
  };

  useEffect(() => {
    (async () => {
      // ── Step 1: resolve the asset URI ──────────────────────────────────
      log(true, `Platform.OS = ${Platform.OS}`);
      try {
        const asset = Asset.fromModule(RAIN);
        log(true, `asset.uri before downloadAsync = ${asset.uri}`);
        log(true, `asset.localUri before downloadAsync = ${asset.localUri}`);
        await asset.downloadAsync();
        log(true, `asset.uri after downloadAsync = ${asset.uri}`);
        log(true, `asset.localUri after = ${asset.localUri}`);

        const url: string = (asset.localUri || asset.uri) ?? '';
        if (!url) { log(false, 'No URL — cannot play'); return; }

        // ── Step 2: fetch the URL to verify it's reachable ────────────────
        if (url.startsWith('http')) {
          try {
            const res = await fetch(url, { method: 'HEAD' });
            log(res.ok, `HEAD ${url} → ${res.status} ${res.headers.get('content-type')}`);
          } catch (e: any) {
            log(false, `fetch failed: ${e?.message}`);
          }
        } else {
          log(true, `local URI (no fetch needed): ${url}`);
        }

        // ── Step 3: try HTMLAudioElement.play() (web only) ─────────────────
        if (Platform.OS === 'web') {
          try {
            const el = new (window as any).Audio() as HTMLAudioElement;
            el.src = url;
            el.volume = 0.1;
            const playResult = await el.play();
            log(true, `audio.play() resolved — sound should be playing (playResult=${playResult})`);
            setTimeout(() => { el.pause(); el.src = ''; }, 3000);
          } catch (e: any) {
            log(false, `audio.play() rejected: ${e?.name} — ${e?.message}`);
          }
        }
      } catch (e: any) {
        log(false, `Asset error: ${e?.message}`);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.pad}>
      <Text style={styles.title}>Sound Diagnostic</Text>
      {lines.map((l, i) => (
        <Text key={i} style={[styles.line, l.ok ? styles.ok : styles.err]}>
          {l.ok ? '✓ ' : '✗ '}{l.text}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg:    { flex: 1, backgroundColor: '#111' },
  pad:   { padding: 20, paddingTop: 60 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  line:  { fontSize: 12, marginBottom: 6, fontFamily: 'monospace' },
  ok:    { color: '#4caf50' },
  err:   { color: '#f44336' },
});
