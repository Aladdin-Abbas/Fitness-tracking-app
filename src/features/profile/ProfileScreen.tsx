import React, { useState } from 'react';
import { StyleSheet,ScrollView } from 'react-native';
import { useFitness } from '../../context/FitnessContext';
import { ProfileCard } from '../../shared/components/ProfileCard';
import { useProfileImage } from './hooks/useProfileImage';
import { ProfileModal } from './components/ProfileModal';

export const ProfileScreen = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const { dailyGoal, updateDailyGoal, userProfile } = useFitness();
  const { image, pickImage } = useProfileImage(true);

  return (
    <ScrollView style={styles.container}>
      <ProfileCard
        image={userProfile?.image || image}
        onImagePress={pickImage}
        name={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Not Set'}
        height={userProfile?.height ? `${userProfile.height} cm` : 'Not Set'}
        weight={userProfile?.weight ? `${userProfile.weight} kg` : 'Not Set'}
        dailyGoal={`${dailyGoal} steps`}
        onEditPress={() => setIsEditModalVisible(true)}
      />

      <ProfileModal
        visible={isEditModalVisible}
        onDismiss={() => setIsEditModalVisible(false)}
        newGoal={newGoal}
        onChangeGoal={setNewGoal}
        onSave={() => {
          if (newGoal) {
            updateDailyGoal(parseInt(newGoal));
            setIsEditModalVisible(false);
          }
        }}
      />
      </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  }
});