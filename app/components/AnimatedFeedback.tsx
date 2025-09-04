import * as React from 'react';
import { Animated, View, Text, ViewStyle } from 'react-native';

interface AnimatedFeedbackProps {
  resultMessage: string | null;
  feedbackAnimation: Animated.Value; // Expect this from parent
  styles?: any; // Optional styles prop, consider a more specific type if known
}

const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({ resultMessage, feedbackAnimation, styles }) => {
  // Use the passed feedbackAnimation directly instead of creating a local opacity ref
  // const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if ("✅" === resultMessage || "❌" === resultMessage) {
      Animated.sequence([
        Animated.timing(feedbackAnimation, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackAnimation, {
          toValue: 0,
          duration: 400,
          delay: 700,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // For streak or other textual messages, fade in, hold longer, then fade out
      Animated.sequence([
        Animated.timing(feedbackAnimation, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackAnimation, {
          toValue: 0,
          duration: 450,
          delay: 1200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [resultMessage]);

  if (resultMessage) {
    return (
      <Animated.View style={{
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        alignItems: 'center' as const,
        zIndex: 100,
        opacity: feedbackAnimation, // Use feedbackAnimation for opacity
        pointerEvents: 'none',
      }}>
        {resultMessage === '✅' ? (
          <View style={{
            backgroundColor: 'rgba(58,125,58,0.07)',
            borderRadius: 999,
            paddingHorizontal: 28,
            paddingVertical: 14,
          }}>
            <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#2E7D2E', textAlign: 'center' as const }}>✓</Text>
          </View>
        ) : resultMessage === '❌' ? (
          <View style={{
            backgroundColor: 'rgba(178,34,34,0.07)',
            borderRadius: 999,
            paddingHorizontal: 28,
            paddingVertical: 14,
          }}>
            <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#FF1744', textAlign: 'center' as const }}>✖</Text>
          </View>
        ) : null}
      </Animated.View>
    );
  }
  return null;
};

export default AnimatedFeedback;
