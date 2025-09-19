import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { shiftStore } from '../stores/ShiftStore';

const ShiftListScreen = observer(({ navigation }: any) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Если координаты уже сохранены, загружаем смены
      if (shiftStore.locationPermissionGranted && shiftStore.latitude && shiftStore.longitude) {
        await shiftStore.loadShifts();
      } else {
        // Запрашиваем разрешение на геолокацию
        const granted = await shiftStore.requestLocationPermission();
        if (granted) {
          await shiftStore.loadShifts();
        } else {
          // Даже без разрешения используем fallback координаты
          console.log('ShiftListScreen: Разрешение не получено, используем fallback координаты');
          await shiftStore.loadShifts();
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShiftDetail', { shift: item })}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item.companyName}</Text>
        {item.customerRating && (
          <Text style={styles.rating}>⭐ {item.customerRating}</Text>
        )}
      </View>

      <Text style={styles.dateTime}>{item.dateStartByCity} | {item.timeStartByCity} - {item.timeEndByCity}</Text>
      <Text style={styles.location}>{item.address}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.workTypes[0]?.nameOne || item.workTypes[0]?.nameTwo || item.workTypes[0]}</Text>

      <View style={styles.footer}>
        <View style={styles.workers}>
          <Text style={styles.workersText}>
            👥 {item.currentWorkers || 0}/{item.planWorkers || 0}
          </Text>
        </View>
        {item.priceWorker && (
          <Text style={styles.price}>{item.priceWorker} ₽</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (shiftStore.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (shiftStore.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{shiftStore.error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shiftStore.shifts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
});

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workers: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workersText: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});

export default ShiftListScreen;
