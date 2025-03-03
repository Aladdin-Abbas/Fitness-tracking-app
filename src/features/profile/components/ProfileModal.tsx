import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { Text, TextInput, Portal, Modal, Button, HelperText } from 'react-native-paper';
import { PROFILE_CONSTANTS, PROFILE_MESSAGES } from '../constants/profileConstants';
import { ProfileModalProps } from '../types';


export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onDismiss,
  newGoal,
  onChangeGoal,
  onSave,
  isLoading = false,
}) => {
  const [error, setError] = useState<string>('');

  const validateAndSave = async () => {
    const goalNumber = parseInt(newGoal, 10);
    if (isNaN(goalNumber) || goalNumber < PROFILE_CONSTANTS.MIN_DAILY_STEPS || goalNumber > PROFILE_CONSTANTS.MAX_DAILY_STEPS) {
      setError(PROFILE_MESSAGES.INVALID_GOAL);
      return;
    }
    setError('');
    try {
      await onSave();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.title}>Edit Profile</Text>
        <TextInput
          label="Daily Step Goal"
          value={newGoal}
          onChangeText={(text) => {
            onChangeGoal(text);
            setError('');
          }}
          keyboardType="numeric"
          style={styles.input}
          error={!!error}
        />
        {error ? <HelperText type="error" style={styles.errorText}>{error}</HelperText> : null}
        <Button
          mode="contained"
          onPress={validateAndSave}
          style={styles.editButton}
          disabled={isLoading}
          accessibilityLabel="Save daily step goal changes"
          accessibilityHint="Double tap to save your new daily step goal"
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText}>Saving...</Text>
            </View>
          ) : (
            'Save Changes'
          )}
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginLeft: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8
  },
  title: {
    marginBottom: 16
  },
  input: {
    marginBottom: 8
  },
  errorText: {
    marginBottom: 8
  },
  editButton: {
    marginTop: 8
  }
});