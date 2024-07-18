import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Country, Guest } from '../../model/guest.model';
import { GuestService } from '../../service/guest.service';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../service/country.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class GuestComponent implements OnInit {
  dataList                   : Guest[] = [];
  dataCountries                   : Guest[] = [];
  dataCountry : Country[]=[];
  @ViewChild('filter') filter!: ElementRef;
  guestForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: Guest | null = null;
  guestName: string = '';
  public apiUrlImage = environment.apiUrlImage;

  constructor(
    private guestService: GuestService,
    private countriesService: CountriesService,
    private messageService            : MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getGuests();
    this.getCountries()
    this.buildForm()
  }

  buildForm():void{
    this.guestForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      countryId: ['', Validators.required],
      guestimg: ['']
    });
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.guestForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addGuest() {
    if (this.guestForm.valid) {
      const formData = new FormData();
      formData.append('name', this.guestForm.get('name')!.value);
      formData.append('email', this.guestForm.get('email')!.value);
      formData.append('phoneNumber', this.guestForm.get('phoneNumber')!.value);
      formData.append('countryId', this.guestForm.get('countryId')!.value);
      if (this.selectedFile) {
        formData.append('guestimg', this.selectedFile, this.selectedFile.name);
      }

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.guestService.updateGuest(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.guestService.addGuest(formData);
      }

      request$.subscribe({
        next: (guest) => {
          if(this.isEditMode){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest updated successfully' });
          }else{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest saved successfully' });
          }

          this.onDisplayDialog();
          this.getGuests();
        },
        error: (err) => {
          console.error('Error saving guest:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save guest' });
        }
      });
    }
  }

  editGuest(id:number) {
    this.guestService.getGuest(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.guestForm.patchValue({
          name: dataApi.name,
          email: dataApi.email,
          phoneNumber: dataApi.phoneNumber,
          countryId: dataApi.countryId,
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
    this.guestService.getGuest(id).subscribe({
      next: (guest) => {
        this.currentGuest = guest.data;
        const data = this.getCountryById(this.currentGuest.countryId)
        this.viewDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  private getGuests(): Promise<any> {
    return firstValueFrom(this.guestService.getGuests().pipe(
        tap((res) => {
            if (!res.error) {
                this.dataList = res.data;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}

private getCountries(): Promise<any> {
  return firstValueFrom(this.countriesService.getCountries().pipe(
      tap((res) => {
          if (!res.error) {
            this.dataCountries = res.data.map(country => ({
              label: country.name,
              value: country.id,
              flag: country.googlemaps //
            })).sort((a, b) => a.label.localeCompare(b.label));
          } else {
              this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
          }
      }),
  ));
}

private getCountryById(id:number) {
  this.countriesService.getCountry(id).subscribe({
    next: (res) => {
    this.dataCountry = res.data
    console.log(this.dataCountry)
    },
    error: (err) => console.error('Error fetching guest:', err)
  });
}

confirmDeleteGuest(guest: any): void {
  console.log('button delete clicked');
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
  this.guestService.deleteGuest(id).subscribe(
    () => {
      // Handle successful deletion
      this.dataList = this.dataList.filter(guest => guest.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `deleted successfully` });
    },
    error => {
      // Handle error
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to delete ${name}` });
      console.error(`Failed to delete ${name}`, error);
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
