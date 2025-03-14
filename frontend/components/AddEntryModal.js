import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

const AddEntryModal = ({ visible, onClose, onSuccess, existingTags }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedTags([]);
    setShowNewTagInput(false);
    setNewTagName('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      tags: selectedTags,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSuccess(newEntry);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      Alert.alert('Error', 'Tag name is required');
      return;
    }

    const newTag = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTagName.trim(),
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
    };

    setSelectedTags(prev => [...prev, newTag]);
    setNewTagName('');
    setShowNewTagInput(false);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Entry</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Entry name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollView}
            >
              {existingTags?.map(tag => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tag,
                    { backgroundColor: tag.color },
                    selectedTags.some(t => t.id === tag.id) && styles.selectedTag
                  ]}
                  onPress={() => handleTagToggle(tag)}
                >
                  <Text style={styles.tagText}>{tag.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.tag, styles.newTagButton]}
                onPress={() => setShowNewTagInput(true)}
              >
                <Icon name="add" size={16} color="#FFF" />
                <Text style={styles.tagText}>New Tag</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {showNewTagInput && (
            <View style={styles.newTagSection}>
              <TextInput
                style={styles.input}
                placeholder="New tag name"
                placeholderTextColor="#999"
                value={newTagName}
                onChangeText={setNewTagName}
              />
              <TouchableOpacity
                style={styles.createTagButton}
                onPress={handleCreateTag}
              >
                <Text style={styles.buttonText}>Create Tag</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1B2430',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
  },
  tagsSection: {
    marginBottom: 15,
  },
  tagsScrollView: {
    flexDirection: 'row',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTag: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  newTagSection: {
    marginBottom: 15,
  },
  newTagButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  createTagButton: {
    backgroundColor: '#FF9F45',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: '#FF9F45',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddEntryModal; 