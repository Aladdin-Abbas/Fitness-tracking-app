import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useFitness } from '../../../context/FitnessContext';

type UseProfileImage = boolean | undefined

export const useProfileImage = (isUpdating:UseProfileImage = false) => {
  const [image, setImage] = useState<string | null>(null);
  const { updateUserImage } = useFitness();
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: retryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (retryStatus !== 'granted') {
        alert('We need camera roll permissions to add a profile photo.');
        return;
      }
      status = retryStatus;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      isUpdating && updateUserImage(result.assets[0].uri)
    }

    
  };

  return {
    image,
    setImage,
    pickImage,
  };
};