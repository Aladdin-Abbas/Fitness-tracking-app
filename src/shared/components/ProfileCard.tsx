import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

interface ProfileCardProps {
  image: string | null;
  onImagePress: () => void;
  name: string;
  height: string;
  weight: string;
  dailyGoal: string;
  onEditPress: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  image,
  onImagePress,
  name,
  height,
  weight,
  dailyGoal,
  onEditPress,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.portraitLayout}>
          <TouchableOpacity onPress={onImagePress} style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Text variant="titleLarge">Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text variant="titleLarge" style={[styles.name, { color: '#000000', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }]}>{name}</Text>
            <Text variant="bodyLarge" style={[styles.info, { color: '#333333', fontSize: 16, marginBottom: 8 }]}>Height: {height}</Text>
            <Text variant="bodyLarge" style={[styles.info, { color: '#333333', fontSize: 16, marginBottom: 8 }]}>Weight: {weight}</Text>
            <Text variant="bodyLarge" style={[styles.info, { color: '#333333', fontSize: 16, marginBottom: 8 }]}>Daily Goal: {dailyGoal}</Text>

            <Button
              mode="contained"
              onPress={onEditPress}
              style={styles.editButton}
            >
              Update Daily Goal
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  portraitLayout: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  placeholderImage: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  name: {
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    marginBottom: 12,
    width: '100%',
  },
  editButton: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
});