import React, { Component, ComponentType, PropsWithChildren, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

// ─── Fallback UI ──────────────────────────────────────────────────────────────

function GameFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🫧</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.body}>The game hit an unexpected error.</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <Text style={styles.buttonText}>Tap to try again</Text>
      </Pressable>
    </View>
  );
}

// ─── Class-based error boundary ───────────────────────────────────────────────

type BoundaryState = { error: Error | null };

class GameBoundary extends Component<PropsWithChildren<{ onRetry: () => void }>, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (__DEV__) {
      console.warn('[GameErrorBoundary] caught error:', error, info.componentStack);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <GameFallback onRetry={this.props.onRetry} />;
    }
    return this.props.children;
  }
}

// ─── Public wrapper ───────────────────────────────────────────────────────────

/**
 * Wraps a game screen in an error boundary.
 *
 * - Catches render/animation errors and shows a friendly retry prompt.
 * - Resets automatically when the user navigates away and comes back, so
 *   returning to the game always starts fresh.
 */
export function GameErrorBoundary({ children }: PropsWithChildren) {
  const boundaryRef = useRef<GameBoundary>(null);

  // Reset the boundary every time this screen gains focus, so navigating
  // away and back always gives the user a clean game.
  useFocusEffect(
    React.useCallback(() => {
      boundaryRef.current?.reset();
    }, [])
  );

  const handleRetry = () => {
    boundaryRef.current?.reset();
  };

  return (
    <GameBoundary ref={boundaryRef} onRetry={handleRetry}>
      {children}
    </GameBoundary>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07192E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    color: 'rgba(190,220,248,0.95)',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  body: {
    color: 'rgba(140,185,225,0.6)',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(42,155,143,0.85)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
  },
});
