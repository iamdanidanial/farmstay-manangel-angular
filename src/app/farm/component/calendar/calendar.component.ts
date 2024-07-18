import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from 'moment';
import { BookingService } from '../../service/booking.service';
import { firstValueFrom, tap } from 'rxjs';
import { Booking } from '../../model/booking.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements  OnInit, AfterViewInit {
  calendarOptions: CalendarOptions;
  displayDialog: boolean = false;
  selectedEvent: any = null;
  dataList: Booking[]=[]

  constructor(private bookingService: BookingService, private messageService : MessageService) {}

  ngOnInit() {
    this.loadDataForCalendar(); // Panggil fungsi ini saat komponen diinisialisasi
  }

  ngAfterViewInit() {
    // Inisialisasi FullCalendar setelah view dan data siap
    if (this.calendarOptions) {
      this.initFullCalendar();
    }
  }

  async loadDataForCalendar() {
    try {
      await this.getBookings(); // Fetch bookings and populate this.dataList
      this.initFullCalendar();
    } catch (error) {
      console.error('Error loading data for calendar:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load calendar data' });
    }
  }

  private initFullCalendar() {
    const events = this.dataList.map((booking) => ({
      title: booking.bookingMethod,
      start: moment(booking.startDate).format('YYYY-MM-DD'),
      end: moment(booking.endDate).add(1, 'day').format('YYYY-MM-DD'),
      color: this.getEventColor(booking.bookingMethod),
      extendedProps: {
        noBooking: booking.bookingNumber,
        totalPrice: booking.totalPrice,
        roomId: booking.roomId,
        guestId: booking.guestId,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        paymentDate: booking.paymentDate,
      }
    }));
console.log(events)
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      displayEventTime: true,
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

  private getBookings(): Promise<any> {
    return firstValueFrom(this.bookingService.getBookings().pipe(
        tap((res) => {
            if (!res.error) {
                this.dataList = res.data;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}
  }