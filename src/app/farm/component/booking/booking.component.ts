import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Booking } from '../../model/booking.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../service/booking.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom, tap } from 'rxjs';
import { Table } from 'primeng/table';
import { Guest } from '../../model/guest.model';
import { GuestService } from '../../service/guest.service';
import { RoomService } from '../../service/room.service';
import { Room } from '../../model/room.model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  dataList                   : Booking[] = [];
  dataGuests                   : Guest[] = [];
  dataRooms                   : Room[] = [];
  @ViewChild('filter') filter!: ElementRef;
  bookingForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  minDate: Date;
  totalPriceDisabled: boolean = true;
  currentBookingValue: any;

  constructor(
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService : RoomService,
    private messageService            : MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getBookings();
    this.buildForm()
  }

  buildForm():void{
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalPrice: ['', Validators.required],
      roomId: [1, Validators.required],
      guestId: [1, Validators.required],
      bookingMethod: ['WhatsApp', Validators.required],
      paymentMethod: ['Cash', Validators.required],
      paymentStatus: ['Pending', Validators.required],
    });

    this.minDate = new Date();
  }


  private formatDates(data: any): any {
    return {
      ...data,
      startDate: this.formatDate(data.startDate),
      endDate: this.formatDate(data.endDate)
    };
  }

  private formatDate(date: string): string {
    const [day, month, year] = date.split('/');
    return `${day}/${parseInt(month, 10)}/${year}`;
  }

  calculateTotalPrice() {
    const startDate = new Date(this.bookingForm.get('startDate').value);
    const endDate = new Date(this.bookingForm.get('endDate').value);
    const roomId = this.bookingForm.get('roomId').value;

      if (endDate < startDate) {
        this.bookingForm.patchValue({
          endDate: null
        })
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'End Date must be greater than Start Date.' });
        return;
      }

      const room = this.dataRooms.find(r => r.id === roomId);
      if (room) {
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Selisih hari
        const totalPrice = room.price * diffDays;
        this.bookingForm.patchValue({ totalPrice: totalPrice });
      }
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.getGuests()
    this.getRooms()
    this.bookingForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
  }

  bookingMethods: any[] = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Booking.com', value: 'Booking.com' },
    { label: 'GoogleMaps', value: 'GoogleMaps' },
    { label: 'Airbnb', value: 'Airbnb' }
  ];
  paymentMethods: any[] = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'PayPal', value: 'PayPal' }
  ];
  paymentStatuses: any[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Failed', value: 'Failed' }
  ];

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private getGuests(): Promise<any> {
    return firstValueFrom(this.guestService.getGuests().pipe(
        tap((res) => {
            if (!res.error) {
              this.dataGuests = res.data.map(guest => ({
                label: guest.name,
                value: guest.id,
                flag: guest.country.flags //
              })).sort((a, b) => a.label.localeCompare(b.label));
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}

private getRooms(): Promise<any> {
  return firstValueFrom(this.roomService.getRooms().pipe(
      tap((res) => {
          if (!res.error) {
            this.dataRooms = res.data
          } else {
              this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
          }
      }),
  ));
}

  addGuest() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;

      // Fungsi untuk mengubah objek Date menjadi format "15/7/2024"
      function formatDate(date: string): string {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Bulan dimulai dari 0
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Jika tidak ada perubahan pada startDate dan endDate, gunakan nilai yang ada
      if (!this.isEditMode || (this.isEditMode && !formData.startDate && !formData.endDate)) {
        // Misalnya, jika ingin menggunakan nilai default jika kosong
        formData.startDate = formatDate(formData.startDate);
        formData.endDate = formatDate(formData.endDate);
      } else {
        formData.startDate = this.currentBookingValue.startDate;
        formData.endDate = this.currentBookingValue.endDate;
        // Jika ada perubahan, ubah format startDate dan endDate

      }

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.bookingService.updateBooking(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.bookingService.addBooking(formData);
      }

      request$.subscribe({
        next: (guest) => {
          if (this.isEditMode) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Booking updated successfully' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Booking saved successfully' });
          }

          this.onDisplayDialog(); // Method untuk menampilkan dialog
          this.getBookings(); // Method untuk memperbarui data bookings setelah perubahan
        },
        error: (err) => {
          console.error('Error saving booking:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Room is already booked within the selected dates.' });
        }
      });
    }
  }
  editGuest(id:number) {
    this.bookingService.getBooking(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
      this.currentBookingValue = { ...dataApi }
      this.bookingForm.patchValue({
        startDate: dataApi.startDate,
        endDate: dataApi.endDate,
        totalPrice: dataApi.totalPrice,
        roomId: dataApi.roomId,
        guestId: dataApi.guestId,
        bookingMethod: dataApi.bookingMethod,
        paymentMethod: dataApi.paymentMethod,
        paymentStatus: dataApi.paymentStatus,
      });
      this.getGuests()
      this.getRooms()
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  viewGuest(id: number) {
    // this.bookingService.getBooking(id).subscribe({
    //   next: (guest) => {
    //     this.currentGuest = guest.data;
    //     const data = this.getCountryById(this.currentGuest.countryId)
    //     this.viewDialog = true;
    //   },
    //   error: (err) => console.error('Error fetching guest:', err)
    // });
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
      ))
  }

  getPaymentMethodColor(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'Cash':
        return 'bg-blue-500 text-white';
      case 'Paypal':
        return 'bg-green-500 text-white';
      case 'Bank Transfer':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  confirmDeleteGuest(guest: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${guest.noBooking} atas nama ${guest.guest.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.deleteGuest(guest.id);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled' });
      }
    });
  }

  deleteGuest(id: number): void {
    this.bookingService.deleteBooking(id).subscribe(
      () => {
        // Handle successful deletion
        this.dataList = this.dataList.filter(guest => guest.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `deleted successfully` });
      },
      error => {
        // Handle error
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to delete data` });
        console.error(`Failed to delete data`, error);
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
