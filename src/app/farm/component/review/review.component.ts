import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../../model/review.model';
import { ReviewService } from '../../service/review.service';
import { Guest } from '../../model/guest.model';
import { GuestService } from '../../service/guest.service';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  dataList                   : Review[] = [];
  dataGuests                   : Guest[] = [];
  @ViewChild('filter') filter!: ElementRef;
  reviewForm: FormGroup;
  displayDialog: boolean = false;
  selectedFile: File = null;
  isEditMode: boolean = false;
  currentGuestId: number | null = null;
  viewDialog: boolean = false;
  currentGuest: Review | null = null;
  guestName: string = '';

  constructor(
    private messageService            : MessageService,
    private reviewService : ReviewService,
    private guestService : GuestService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getReviews();
    this.buildForm()
  }

  buildForm():void{
    this.reviewForm = this.fb.group({
      content: ['', Validators.required],
      guestId: ['', [Validators.required]],
      rating: ['', Validators.required],
    });
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

  onDisplayDialog() {
    this.displayDialog = !this.displayDialog;
    this.reviewForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentGuestId = null;
    this.guestName = '';
    this.getGuests()
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addGuest() {
    if (this.reviewForm.valid) {
      const formData = this.reviewForm.value;

      let request$;
      if (this.isEditMode && this.currentGuestId !== null) {
        // Edit mode: send PUT request
        request$ = this.reviewService.updateReview(this.currentGuestId, formData);
      } else {
        // Add mode: send POST request
        request$ = this.reviewService.addReview(formData);
      }

      request$.subscribe({
        next: (guest) => {
          if(this.isEditMode){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest updated successfully' });
          }else{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest saved successfully' });
          }

          this.onDisplayDialog();
          this.getReviews();
        },
        error: (err) => {
          console.error('Error saving guest:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save guest' });
        }
      });
    }
  }

  editGuest(id:number) {
    this.reviewService.getReview(id).subscribe({
      next: (guest) => {
      const dataApi = guest.data
        this.reviewForm.patchValue({
          guestId: dataApi.guestId,
          content: dataApi.content,
          rating: dataApi.rating,
        });
        this.getGuests()
        this.currentGuestId = dataApi.id;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: (err) => console.error('Error fetching guest:', err)
    });
  }

  // viewGuest(id: number) {
  //   this.reviewService.getReview(id).subscribe({
  //     next: (guest) => {
  //       this.currentGuest = guest.data;
  //       const data = this.getCountryById(this.currentGuest.countryId)
  //       this.viewDialog = true;
  //     },
  //     error: (err) => console.error('Error fetching guest:', err)
  //   });
  // }

  private getReviews(): Promise<any> {
    return firstValueFrom(this.reviewService.getReviews().pipe(
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
  console.log('button delete clicked');
  this.confirmationService.confirm({
    message: `Are you sure you want to delete ${guest.guest.name}?`,
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
  this.reviewService.deleteReview(id).subscribe(
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
