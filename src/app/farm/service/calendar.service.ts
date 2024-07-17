import { Injectable } from '@angular/core';

export interface Booking {
  noBooking: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  roomId: number;
  guestId: number;
  bookingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  getBookings(): Booking[] {
    return [
      {
        noBooking: 'BK001',
        startDate: '2024-07-01',
        endDate: '2024-07-03',
        totalPrice: 500,
        roomId: 1,
        guestId: 1,
        bookingMethod: 'WhatsApp',
        paymentMethod: 'Cash',
        paymentStatus: 'Completed',
        paymentDate: '2024-07-01',
      },

      {
        noBooking: 'BK001',
        startDate: '2024-07-02',
        endDate: '2024-07-02',
        totalPrice: 500,
        roomId: 1,
        guestId: 1,
        bookingMethod: 'Booking.com',
        paymentMethod: 'Cash',
        paymentStatus: 'Completed',
        paymentDate: '2024-07-01',
      },

      {
        noBooking: 'BK001',
        startDate: '2024-07-26',
        endDate: '2024-07-27',
        totalPrice: 500,
        roomId: 1,
        guestId: 1,
        bookingMethod: 'Airbnb',
        paymentMethod: 'Cash',
        paymentStatus: 'Completed',
        paymentDate: '2024-07-01',
      },

      {
        noBooking: 'BK001',
        startDate: '2024-07-03',
        endDate: '2024-07-06',
        totalPrice: 500,
        roomId: 1,
        guestId: 1,
        bookingMethod: 'GoogleMaps',
        paymentMethod: 'Cash',
        paymentStatus: 'Completed',
        paymentDate: '2024-07-01',
      },
      // Add more bookings here
    ];
  }
}