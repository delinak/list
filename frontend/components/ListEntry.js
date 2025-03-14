import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListEntry = ({ entry, onUpdate, onDelete }) => {
  const handlePress = () => {
    onUpdate({ 
      ...entry, 
      completed: !entry.completed 
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'destructive',
        },
      ]
    );
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
      <View style={styles.contentContainer}>
        <Text style={[
          styles.title,
          entry.completed && styles.completedText
        ]}>
          {entry.name}
        </Text>
        {entry.description && (
          <Text style={[
            styles.description,
            entry.completed && styles.completedText
          ]}>
            {entry.description}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="delete-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(173, 196, 206, 0.5)', // Light version
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  contentContainer: {
    flex: 1,
  },
  completedContainer: {
    backgroundColor: 'rgba(150, 182, 197, 0.8)', // Darker version when completed
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  completedText: {
    opacity: 0.8,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    marginLeft: 12,
    opacity: 0.8,
  },
});

export default ListEntry; 