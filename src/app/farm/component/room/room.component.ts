import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from '../../model/room.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { RoomService } from '../../service/room.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  dataList                   : Room[] = [];
  @ViewChild('filter') filter!: ElementRef;
  roomForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: Room | null = null;
  guestName: string = '';
  public apiUrlImage = environment.apiUrlImage;

  constructor(
    private roomService: RoomService,
    private messageService            : MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getRooms();
    this.buildForm()
  }

  buildForm():void{
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', Validators.required],
      price: ['', Validators.required],
      roomimg: ['']
    });
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.roomForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.roomForm.get('name').value);
    formData.append('description', this.roomForm.get('description').value);
    formData.append('capacity', this.roomForm.get('capacity').value);
    formData.append('price', this.roomForm.get('price').value);
    if (this.selectedFile && this.selectedFile.name) {
      formData.append('roomimg', this.selectedFile, this.selectedFile.name);
    } else {
      console.error('File yang dipilih tidak valid:', this.selectedFile);
    }
    console.log(this.selectedFile)

    // Kirim formData ke server atau lakukan yang lain sesuai kebutuhan
    console.log(formData); // Contoh output, sesuaikan dengan implementasi HTTP Anda
  }

  addGuest() {
    if (this.roomForm.valid) {
      const formData = new FormData();
      formData.append('name', this.roomForm.get('name')!.value);
      formData.append('description', this.roomForm.get('description')!.value);
      formData.append('capacity', this.roomForm.get('capacity')!.value);
      formData.append('price', this.roomForm.get('price')!.value);
      if (this.selectedFile) {
        formData.append('roomimg', this.selectedFile, this.selectedFile.name);
      }

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.roomService.updateRoom(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.roomService.addRoom(formData);
      }

      request$.subscribe({
        next: (guest) => {
          if(this.isEditMode){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest updated successfully' });
          }else{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest saved successfully' });
          }

          this.onDisplayDialog();
          this.getRooms();
        },
        error: (err) => {
          console.error('Error saving guest:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save guest' });
        }
      });
    }
  }

  editGuest(id:number) {
    this.roomService.getRoom(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.roomForm.patchValue({
          name: dataApi.name,
          price: dataApi.price,
          description: dataApi.description,
          capacity: dataApi.capacity,
        });
        this.guestName = dataApi.name;
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  viewGuest(id: number) {
    this.roomService.getRoom(id).subscribe({
      next: (guest) => {
        this.currentGuest = guest.data;
        this.viewDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
  }

  private getRooms(): Promise<any> {
    return firstValueFrom(this.roomService.getRooms().pipe(
        tap((res) => {
            if (!res.error) {
                this.dataList = res.data;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}

confirmDeleteGuest(guest: any): void {
  this.confirmationService.confirm({
    message: `Are you sure you want to delete ${guest.name}?`,
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
  this.roomService.deleteRoom(id).subscribe(
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

