import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

const ListEntry = ({ entry, onUpdate }) => {
  const handlePress = () => {
    onUpdate({ 
      ...entry, 
      completed: !entry.completed 
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        entry.completed && styles.completedContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.title,
        entry.completed && styles.completedText
      ]}>
        {entry.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(173, 196, 206, 0.5)', // Light version
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  completedContainer: {
    backgroundColor: 'rgba(150, 182, 197, 0.8)', // Darker version when completed
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  completedText: {
    opacity: 0.8,
  },
});

export default ListEntry; 