import * as React from 'react';
import { FlatList, useWindowDimensions,StyleSheet ,View} from 'react-native';
import { Card, Text } from 'react-native-paper';

type Activity = {
    id: number;
    date: string;
    type: string;
    duration: string;
    calories: number;
    steps: number;
  };

interface ActivityList {
    filteredActivities: Activity[]
}

interface ListItem { 
    item:Activity
}

export const ActivityList = ({ filteredActivities }:ActivityList) => {
    const dimensions = useWindowDimensions();
    
  const renderItem = ({ item } :ListItem) => (
    <Card key={item.id} style={[styles.card, dimensions.width > dimensions.height && styles.landscapeCard]}>
      <Card.Content>
        <Text variant="titleLarge">{item.type}</Text>
        <Text variant="bodyMedium">Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text variant="bodyMedium">Duration: {item.duration}</Text>
        <Text variant="bodyMedium">Steps: {item.steps}</Text>
        <Text variant="bodyMedium">Calories: {item.calories}</Text>
      </Card.Content>
    </Card>
  );

  return (
    // <View style={[  styles.activitiesListContainer,dimensions.width > dimensions.height ? styles.activitiesContainerLandscape : styles.activitiesContainerPortrait,styles.listContainer]}>
        <FlatList
        data={filteredActivities}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
        />
    //  </View>
  );
};


const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
      },
      landscapeCard: {
        marginLeft: 8,
      },
      activitiesContainerPortrait: {
        marginTop: 16,
        flex: 1, // Add this
      },
      activitiesContainerLandscape: {
        flex: 1,
        maxWidth: '50%', // Add this
      },
      listContainer: {
        height: '100%', // Add this
      },
      activitiesListContainer: {
        flex: 1,
        height: '50%', // Adjust this value as needed
      },
      flatList: {
        flex: 1,
        width: '100%',
      },
      flatListContent: {
        paddingBottom: 16,
      },
})