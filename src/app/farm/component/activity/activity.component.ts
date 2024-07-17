import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gallery } from '../../model/gallery.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { Activity } from '../../model/activity.model';
import { ActivityService } from '../../service/activity.service';
import { GuestService } from '../../service/guest.service';
import { Guest } from '../../model/guest.model';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  dataList                   : Activity[] = [];
  dataGuests                   : Guest[] = [];
  @ViewChild('filter') filter!: ElementRef;
  galleryForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: Gallery | null = null;
  guestName: string = '';
  text: string | undefined;

  constructor(
    private activityService: ActivityService,
    private guestService: GuestService,
    private messageService            : MessageService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getGalleries();
    this.buildForm()
  }

  buildForm():void{
    this.galleryForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      guestId: ['', Validators.required],
      activityimg: ['']
    });
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.galleryForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
    this.getGuests()
  }

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
                flag: guest.country.googlemaps //
              })).sort((a, b) => a.label.localeCompare(b.label));
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}

  addGuest() {
    if (this.galleryForm.valid) {
      const formData = new FormData();
      formData.append('title', this.galleryForm.get('title').value);
      formData.append('description', this.galleryForm.get('description').value);
      formData.append('date', this.galleryForm.get('date').value);
      formData.append('guestId', this.galleryForm.get('guestId').value);
      if (this.selectedFile) {
        formData.append('activityimg', this.selectedFile, this.selectedFile.name);
      }

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.activityService.updateActivity(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.activityService.addActivity(formData);
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
    this.activityService.getActivity(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.galleryForm.patchValue({
          title: dataApi.title,
          description: dataApi.description,
          date: dataApi.date,
          guestId: dataApi.guestId,
          activityimg: dataApi.activityimg,
        });
        this.getGuests()
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  viewGuest(id: number) {
    this.activityService.getActivity(id).subscribe({
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
    return firstValueFrom(this.activityService.getActivities().pipe(
        tap((res) => {
            if (!res.error) {
                this.dataList = res.data;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
            }
        }),
    ));
}


onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

clear(table: Table) {
  table.clear();
  this.filter.nativeElement.value = '';
}
}
