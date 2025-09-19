import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ShiftDetailScreen = ({ route }: any) => {
  const { shift } = route.params;

  if (!shift) {
    return (
      <View style={styles.center}>
        <Text>Смена не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{shift.companyName}</Text>
          {shift.customerRating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {shift.customerRating}</Text>
              {shift.customerFeedbacksCount && (
                <Text style={styles.reviews}>({shift.customerFeedbacksCount} отзывов)</Text>
              )}
            </View>
          )}
        </View>

        <Text style={styles.date}>{shift.dateStartByCity} | {shift.timeStartByCity} - {shift.timeEndByCity}</Text>
        <Text style={styles.location}>{shift.address}</Text>
        <Text style={styles.description}>{shift.workTypes[0]?.nameOne}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Количество работников:</Text>
            <Text style={styles.detailValue}>
              {shift.currentWorkers || 0} / {shift.planWorkers || 0}
            </Text>
          </View>

          {shift.priceWorker && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Оплата:</Text>
              <Text style={styles.priceValue}>{shift.priceWorker} ₽</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default ShiftDetailScreen;
