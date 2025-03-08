import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TagBadge = ({ tag }) => (
  <View style={[styles.tagBadge, { backgroundColor: tag.color }]}>
    <Text style={styles.tagText}>{tag.name}</Text>
  </View>
);

const ListBlock = ({ list, onPress, isPinned }) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const expandedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 250], // Increased height to accommodate description
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        { height: expandedHeight }
      ]}
    >
      <TouchableOpacity 
        style={styles.mainContent}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{list.name}</Text>
            {isPinned && (
              <Icon 
                name="push-pin" 
                size={16} 
                color="#FFFFFF" 
                style={styles.pinIcon} 
              />
            )}
          </View>
          <Text style={styles.countText}>{list.entriesCount || 0} items</Text>
        </View>
        
        <View style={styles.tagsRow}>
          {list.tags?.map(tag => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </View>

        {expanded && (
          <>
            <Text style={styles.description}>
              {list.description || 'No description provided'}
            </Text>
            
            <View style={styles.expandedContent}>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={onPress}
              >
                <Text style={styles.viewButtonText}>View Full List</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(173, 196, 206, 0.5)',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  mainContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 12,
    marginBottom: 16,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  pinIcon: {
    opacity: 0.8,
  },
});

export default ListBlock; 