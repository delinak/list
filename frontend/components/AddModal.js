import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const AddModal = ({ visible, onClose, onSubmit, presetColors }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const newList = {
        name: name.trim(),
        description: description.trim(),
        tags: selectedTags,
        entries: [],
        isPinned: false,
        lastUpdated: new Date().toISOString(),
      };
      await onSubmit(newList);
      setName('');
      setDescription('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const exists = prev.find(t => t.name === tag.name);
      if (exists) {
        return prev.filter(t => t.name !== tag.name);
      }
      return [...prev, tag];
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New List</Text>
          
          <TextInput
            style={styles.input}
            placeholder="List Name"
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

          <Text style={styles.sectionTitle}>Tags</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
          >
            {presetColors.map((color, index) => {
              const tag = {
                name: `Tag ${index + 1}`,
                color,
              };
              const isSelected = selectedTags.some(t => t.name === tag.name);
              
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.tag,
                    { backgroundColor: color },
                    isSelected && styles.selectedTag,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.tagText}>{tag.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.createButton,
                (!name.trim() || loading) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create List</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1B2430',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTag: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#FF9F45',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddModal; 