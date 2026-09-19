import React, { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@/components/IoniconsSVG';
import { useColors } from '@/hooks/useColors';

interface PinModalProps {
  visible: boolean;
  title?: string;
  onSuccess: () => void;
  onCancel: () => void;
  validatePin: (pin: string) => boolean;
}

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export function PinModal({ visible, title = 'Enter PIN', onSuccess, onCancel, validatePin }: PinModalProps) {
  const colors = useColors();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const shake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [shakeX]);

  const handleDigit = useCallback((d: string) => {
    if (d === '') return;
    if (d === '⌫') {
      setInput((p) => p.slice(0, -1));
      setError(false);
      return;
    }
    const next = input + d;
    if (next.length > 4) return;
    setInput(next);
    if (next.length === 4) {
      if (validatePin(next)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setTimeout(() => { setInput(''); setError(false); onSuccess(); }, 200);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        shake();
        setError(true);
        setTimeout(() => { setInput(''); setError(false); }, 700);
      }
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [input, validatePin, onSuccess, shake]);

  const handleCancel = () => {
    setInput('');
    setError(false);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>

          <Animated.View style={[styles.dots, shakeStyle]}>
            {[0,1,2,3].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i < input.length
                      ? (error ? colors.destructive : colors.primary)
                      : colors.border,
                  },
                ]}
              />
            ))}
          </Animated.View>

          {error && (
            <Text style={[styles.errorText, { color: colors.destructive }]}>Incorrect PIN</Text>
          )}

          <View style={styles.keypad}>
            {DIGITS.map((d, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleDigit(d)}
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor: d === '' ? 'transparent' : pressed ? colors.muted : colors.secondary,
                  },
                ]}
              >
                {d === '⌫' ? (
                  <Ionicons name="backspace-outline" size={22} color={colors.foreground} />
                ) : (
                  <Text style={[styles.keyText, { color: d ? colors.foreground : 'transparent' }]}>{d}</Text>
                )}
              </Pressable>
            ))}
          </View>

          <Pressable onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginTop: -12,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 216,
    gap: 12,
  },
  key: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
});
