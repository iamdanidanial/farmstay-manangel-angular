import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { FacilityService } from '../../service/facility.service';
import { Facility } from '../../model/facility.model';
@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit {
  dataList                   : Facility[] = [];
  @ViewChild('filter') filter!: ElementRef;
  facilityForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: | null = null;
  guestName: string = '';

  constructor(
    private facilityService: FacilityService,
    private messageService            : MessageService,
    private confirmationService : ConfirmationService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getGalleries();
    this.buildForm()
  }

  buildForm():void{
    this.facilityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.facilityForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  addGuest() {
    if (this.facilityForm.valid) {
      const formData = this.facilityForm.value;

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.facilityService.updateFacility(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.facilityService.addFacility(formData);
      }

      request$.subscribe({
        next: (guest) => {
          if(this.isEditMode){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest updated successfully' });
          }else{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest saved successfully' });
          }

          this.onDisplayDialog();
          this.getGalleries();
        },
        error: (err) => {
          console.error('Error saving guest:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save guest' });
        }
      });
    }
  }

  editGuest(id:number) {
    this.facilityService.getFacility(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.facilityForm.patchValue({
          name: dataApi.name,
        });
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  viewGuest(id: number) {
    this.facilityService.getFacility(id).subscribe({
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

  private getGalleries(): Promise<any> {
    return firstValueFrom(this.facilityService.getFacilities().pipe(
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
  this.facilityService.deleteFacility(id).subscribe(
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

