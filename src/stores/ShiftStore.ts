import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Shift {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'active' | 'completed' | 'cancelled';
  logo?: string;
  currentWorkers?: number;
  planWorkers?: number;
  priceWorker?: number;
  customerFeedbacksCount?: number;
  customerRating?: number;
}

class ShiftStore {
  shifts: Shift[] = [];
  selectedShift: Shift | null = null;
  isLoading = false;
  error: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  locationPermissionGranted = false;

  constructor() {
    makeAutoObservable(this);
    this.loadSavedLocation();
  }

  async loadSavedLocation() {
    try {
      const savedLat = await AsyncStorage.getItem('user_latitude');
      const savedLng = await AsyncStorage.getItem('user_longitude');

      if (savedLat && savedLng) {
        runInAction(() => {
          this.latitude = parseFloat(savedLat);
          this.longitude = parseFloat(savedLng);
          this.locationPermissionGranted = true;
        });
        // console.log('ShiftStore: Координаты установлены из сохраненных данных');
      } else {
        // console.log('ShiftStore: Сохраненные координаты не найдены');
      }
    } catch (error) {
      // console.error('ShiftStore: Ошибка загрузки сохраненной локации:', error);
    }
  }

  async requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Разрешение на геолокацию',
            message: 'Приложению нужно разрешение на доступ к вашей геолокации',
            buttonNeutral: 'Спросить позже',
            buttonNegative: 'Отмена',
            buttonPositive: 'ОК',
          }
        );
        runInAction(() => {
          this.locationPermissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        });
        if (this.locationPermissionGranted) {
          await this.getCurrentLocation();
        } else {
        }
        return this.locationPermissionGranted;
      } else {
        return new Promise<boolean>((resolve) => {
          Geolocation.getCurrentPosition(
            () => {
              runInAction(() => {
                this.locationPermissionGranted = true;
              });
              this.getCurrentLocation().then(() => resolve(true));
            },
            async () => {
              runInAction(() => {
                this.locationPermissionGranted = false;
              });
              // Даже при ошибке получаем fallback координаты
              await this.getCurrentLocation();
              resolve(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        });
      }
    } catch (error) {
      // console.error('ShiftStore: Ошибка запроса разрешения на геолокацию:', error);
      return false;
    }
  }

  async getCurrentLocation() {
    return new Promise<void>((resolve) => {
      Geolocation.getCurrentPosition(
        async (position: any) => {
          const { latitude, longitude } = position.coords;
          runInAction(() => {
            this.latitude = latitude;
            this.longitude = longitude;
          });

          try {
            await AsyncStorage.setItem('user_latitude', latitude.toString());
            await AsyncStorage.setItem('user_longitude', longitude.toString());
          } catch (error) {
          }

          resolve();
        },
        async (error: any) => {

          // Используем координаты Санкт-Петербурга по умолчанию при любой ошибке геолокации
          const defaultLat = 59.9343; // Центр Санкт-Петербурга
          const defaultLng = 30.3351; // Центр Санкт-Петербурга
          // console.log('ShiftStore: Устанавливаем координаты по умолчанию:', { defaultLat, defaultLng });
          runInAction(() => {
            this.latitude = defaultLat;
            this.longitude = defaultLng;
          });

          try {
            await AsyncStorage.setItem('user_latitude', defaultLat.toString());
            await AsyncStorage.setItem('user_longitude', defaultLng.toString());
          } catch (storageError) {
          }

          resolve(); // Разрешаем промис даже при ошибке
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  async loadShifts() {
    // Используем координаты Санкт-Петербурга по умолчанию, если геолокация не предоставлена
    const defaultLat = 59.9343; // Центр Санкт-Петербурга
    const defaultLng = 30.3351; // Центр Санкт-Петербурга

    const lat = this.latitude || defaultLat;
    const lng = this.longitude || defaultLng;

    this.isLoading = true;
    this.error = null;

    try {
      const shifts = await apiService.getShifts(lat, lng);
      runInAction(() => {
        this.shifts = shifts;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки смен';
        this.isLoading = false;
      });
    }
  }



  clearError() {
    console.log('ShiftStore: Очищаем ошибку');
    this.error = null;
  }
}

export const shiftStore = new ShiftStore();
