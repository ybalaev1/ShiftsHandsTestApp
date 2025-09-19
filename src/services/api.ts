import axios from 'axios';
import { Shift } from '../stores/ShiftStore';

class ApiService {
  private baseUrl = 'https://mobile.handswork.pro/api';

  async getShifts(latitude: number, longitude: number): Promise<Shift[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/shifts/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`
      );

      console.log('Response:', response.data);
      // const data = response.data;

      // Преобразование данных API в формат Shift
      // return data?.map((item: any) => ({
      //   id: item.id.toString(),
      //   title: item.companyName || 'Без названия',
      //   description: item.workTypes ? item.workTypes.join(', ') : 'Описание отсутствует',
      //   date: item.dateStartByCity || new Date().toISOString().split('T')[0],
      //   time: item.timeStartByCity && item.timeEndByCity ? `${item.timeStartByCity} - ${item.timeEndByCity}` : 'Время не указано',
      //   location: item.address || 'Местоположение не указано',
      //   status: item.status || 'active',
      //   logo: item.logo,
      //   currentWorkers: item.currentWorkers,
      //   planWorkers: item.planWorkers,
      //   priceWorker: item.priceWorker,
      //   customerFeedbacksCount: item.customerFeedbacksCount,
      //   customerRating: item.customerRating
      // }));
      const shifts = response.data?.data;
      return shifts;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
