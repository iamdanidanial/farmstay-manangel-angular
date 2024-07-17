import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gallery } from '../../model/gallery.model';
import {  MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { FarmService } from '../../model/farmservice.model';
import { FarmServiceService } from '../../service/farmservice.service';

@Component({
  selector: 'app-farmservice',
  templateUrl: './farmservice.component.html',
  styleUrls: ['./farmservice.component.scss']
})
export class FarmserviceComponent implements OnInit {
  dataList                   : FarmService[] = [];
  @ViewChild('filter') filter!: ElementRef;
  galleryForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: Gallery | null = null;
  guestName: string = '';

  constructor(
    private farmserviceService: FarmServiceService,
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
      guestId: ['', Validators.required],
      galleryimg: ['']
    });
  }

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.galleryForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addGuest() {
    if (this.galleryForm.valid) {
      const formData = new FormData();
      formData.append('title', this.galleryForm.get('title').value);
      formData.append('description', this.galleryForm.get('description').value);
      if (this.selectedFile) {
        formData.append('serviceimg', this.selectedFile, this.selectedFile.name);
      }

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.farmserviceService.updateFarmService(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.farmserviceService.addFarmService(formData);
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
    this.farmserviceService.getFarmService(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.galleryForm.patchValue({
          title: dataApi.title,
          description: dataApi.description,
          serviceimg: dataApi.serviceimg,
        });
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  viewGuest(id: number) {
    this.farmserviceService.getFarmService(id).subscribe({
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
    return firstValueFrom(this.farmserviceService.getFarmServices().pipe(
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

