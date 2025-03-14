import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BoundedList, { ENTRY_HEIGHT, MAX_VISIBLE_ENTRIES } from './BoundedList';

const COLLAPSED_HEIGHT = 100;
const BASE_EXPANDED_HEIGHT = 160; // Height without BoundedList
const BOUNDED_LIST_HEIGHT = ENTRY_HEIGHT * MAX_VISIBLE_ENTRIES + 32;
const EXPANDED_HEIGHT = BASE_EXPANDED_HEIGHT + BOUNDED_LIST_HEIGHT;

const ListBlock = ({ list, onPress, fixedExpanded }) => {
  const [expanded, setExpanded] = useState(fixedExpanded);
  const [animation] = useState(new Animated.Value(fixedExpanded ? 1 : 0));

  useEffect(() => {
    if (fixedExpanded) {
      setExpanded(true);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: false,
        friction: 8,
      }).start();
    }
  }, [fixedExpanded]);

  const toggleExpand = () => {
    if (fixedExpanded) return;
    
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
  });

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const containerStyle = expanded ? {
    height: containerHeight,
    maxHeight: undefined,
  } : {
    height: containerHeight,
    overflow: 'hidden'
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={fixedExpanded ? 1 : 0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.date}>
              {formatDate(list.lastUpdated)}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Icon name="launch" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            {!fixedExpanded && (
              <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
                <Icon name="keyboard-arrow-down" size={24} color="#FFFFFF" />
              </Animated.View>
            )}
          </View>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.countBadge}>
            <Icon name="list" size={16} color="#FFFFFF" style={styles.countIcon} />
            <Text style={styles.countText}>{list.entries?.length || 0} items</Text>
          </View>
          {list.isPinned && (
            <View style={styles.pinnedBadge}>
              <Icon name="push-pin" size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Animated.View style={[
        styles.expandedContent,
        {
          opacity: animation,
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}>
        {list.description && (
          <Text style={styles.description} numberOfLines={2}>
            {list.description}
          </Text>
        )}

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Recent Entries</Text>
          <BoundedList
            entries={list.entries || []}
            onEntryPress={() => {}}
            style={styles.boundedList}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(173, 196, 206, 0.3)',
    borderRadius: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    padding: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countIcon: {
    marginRight: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  pinnedBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 159, 69, 0.3)',
    padding: 4,
    borderRadius: 8,
  },
  expandedContent: {
    padding: 12,
    paddingTop: 0,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
    lineHeight: 20,
  },
  previewContainer: {
    marginTop: 4,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  boundedList: {
    marginTop: 4,
  },
});

export default ListBlock; 