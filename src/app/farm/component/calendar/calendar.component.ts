import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../service/calendar.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  displayDialog: boolean = false;
  selectedEvent: any = null;

  constructor(private bookingService: CalendarService) {}
  ngOnInit() {
    const bookings = this.bookingService.getBookings();
    const events = bookings.map((booking) => ({
      title: booking.bookingMethod, // Display the booking method as the title
      start: booking.startDate,
      end: moment(booking.endDate).add(1, 'day').format('YYYY-MM-DD'),
      color: this.getEventColor(booking.bookingMethod),
      extendedProps: {
        noBooking: booking.noBooking,
        totalPrice: booking.totalPrice,
        roomId: booking.roomId,
        guestId: booking.guestId,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        paymentDate: booking.paymentDate,
      }
    }));

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      displayEventTime: true, // Menampilkan waktu acara
      events: events,
      eventClick: this.handleEventClick.bind(this),
    };
  }

  getEventColor(bookingMethod: string): string {
    switch (bookingMethod) {
      case 'WhatsApp':
        return '#009688'; // Warna biru untuk WhatsApp
      case 'Booking.com':
        return '#3f51b5'; // Warna hijau untuk Booking.com
      case 'GoogleMaps':
        return '#ff9800'; // Warna oranye untuk GoogleMaps
      case 'Airbnb':
        return '#e91e63'; // Warna merah untuk Airbnb
      default:
        return '#000000'; // Warna default hitam
    }
  }

  handleEventClick(arg: any) {
    this.selectedEvent = arg.event.extendedProps;
    this.displayDialog = true;
  }
  }