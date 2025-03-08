import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';

const StandaloneEntry = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) { // Only allow left swipe
        pan.x.setValue(gesture.dx);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -100) { // Threshold for delete action
        // Show delete confirmation
      } else {
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleDoublePress = () => {
    setCompleted(!completed);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: pan.getTranslateTransform() },
        completed && styles.completedContainer,
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        onPress={handlePress}
        onDoublePress={handleDoublePress}
      >
        <Text style={styles.title}>{entry.name}</Text>
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{entry.description}</Text>
            <Text style={styles.date}>
              {new Date(entry.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: 'rgba(144, 238, 144, 0.9)', // Light green
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default StandaloneEntry; 