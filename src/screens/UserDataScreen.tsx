import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useFitness } from '../context/FitnessContext';

type UserDataScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserData'>;

export const UserDataScreen = () => {
  const navigation = useNavigation<UserDataScreenNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [image, setImage] = useState<string | null>(null);
  type FormErrors = {
    firstName: string;
    lastName: string;
    height: string;
    weight: string;
    dailyGoal: string;
  };

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    height: '',
    weight: '',
    dailyGoal: ''
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      height: '',
      weight: '',
      dailyGoal: ''
    };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!height.trim() || isNaN(Number(height))) {
      newErrors.height = 'Valid height is required';
      isValid = false;
    }

    if (!weight.trim() || isNaN(Number(weight))) {
      newErrors.weight = 'Valid weight is required';
      isValid = false;
    }

    if (!dailyGoal.trim() || isNaN(Number(dailyGoal))) {
      newErrors.dailyGoal = 'Valid daily goal is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const { updateUserProfile, updateDailyGoal } = useFitness();

  const handleSubmit = () => {
    if (validateForm()) {
      const userProfile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        height: height.trim(),
        weight: weight.trim(),
        image: image
      };
      
      updateUserProfile(userProfile);
      updateDailyGoal(parseInt(dailyGoal.trim()));
      navigation.replace('Main');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Welcome to Fitness Tracker</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Please provide your information to get started</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Text variant="titleLarge">Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          error={!!errors.firstName}
          {...(errors.firstName ? { placeholder: errors.firstName } : {})}
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          error={!!errors.lastName}
          {...(errors.lastName ? { placeholder: errors.lastName } : {})}
        />

        <TextInput
          label="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.height}
          {...(errors.height ? { placeholder: errors.height } : {})}
        />

        <TextInput
          label="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.weight}
          {...(errors.weight ? { placeholder: errors.weight } : {})}
        />

        <TextInput
          label="Daily Step Goal"
          value={dailyGoal}
          onChangeText={setDailyGoal}
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.dailyGoal}
          {...(errors.dailyGoal ? { placeholder: errors.dailyGoal } : {})}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Get Started
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    marginTop: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  imageContainer: {
    marginBottom: 32,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
  },
});