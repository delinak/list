import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ENTRY_HEIGHT = 60;
export const MAX_VISIBLE_ENTRIES = 3;
const CONTAINER_HEIGHT = ENTRY_HEIGHT * MAX_VISIBLE_ENTRIES + 16;

const BoundedList = ({ entries, onEntryPress, style }) => {
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const renderEntry = (entry, index) => {
    const inputRange = [
      -1,
      0,
      ENTRY_HEIGHT * index,
      ENTRY_HEIGHT * (index + 2)
    ];

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
    });

    return (
      <Animated.View
        key={entry.id}
        style={[
          styles.entryContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.entry}
          onPress={() => onEntryPress(entry)}
          activeOpacity={0.7}
        >
          <View style={styles.entryContent}>
            <Text style={styles.entryTitle} numberOfLines={1}>
              {entry.name}
            </Text>
            {entry.description && (
              <Text style={styles.entryDescription} numberOfLines={1}>
                {entry.description}
              </Text>
            )}
          </View>
          {entry.completed && (
            <Icon name="check-circle" size={20} color="#4CAF50" />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      height: CONTAINER_HEIGHT,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: 8,
    },
    entryContainer: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    entry: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(173, 196, 206, 0.3)',
      borderRadius: 12,
      padding: 12,
      height: ENTRY_HEIGHT - 8,
    },
    entryContent: {
      flex: 1,
    },
    entryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    entryDescription: {
      fontSize: 12,
      color: '#FFFFFF',
      opacity: 0.8,
    },
    scrollButton: {
      position: 'absolute',
      right: 12,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    scrollButtonTop: {
      top: 4,
    },
    scrollButtonBottom: {
      bottom: 4,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {entries.length > MAX_VISIBLE_ENTRIES && (
        <TouchableOpacity
          style={[styles.scrollButton, styles.scrollButtonTop]}
          onPress={handleScrollToTop}
        >
          <Icon name="keyboard-arrow-up" size={20} color="#FFF" />
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {entries.map((entry, index) => renderEntry(entry, index))}
      </ScrollView>

      {entries.length > MAX_VISIBLE_ENTRIES && (
        <TouchableOpacity
          style={[styles.scrollButton, styles.scrollButtonBottom]}
          onPress={handleScrollToBottom}
        >
          <Icon name="keyboard-arrow-down" size={20} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BoundedList; 