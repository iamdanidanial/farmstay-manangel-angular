import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboadComponent } from './component/dashboad/dashboad.component';
import { FarmComponent } from './farm.component';
import { GuestComponent } from './component/guest/guest.component';
import { RoomComponent } from './component/room/room.component';
import { FacilityComponent } from './component/facility/facility.component';
import { ActivityComponent } from './component/activity/activity.component';
import { FarmserviceComponent } from './component/farmservice/farmservice.component';
import { UserComponent } from './component/user/user.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { ReviewComponent } from './component/review/review.component';
import { FarmRoutingModule } from './farm-routing.module';
import { SharedModule } from '../shared/shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BookingComponent } from './component/booking/booking.component';
import { CalendarComponent } from './component/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CardDataComponent } from './component/dashboad/card-data/card-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';



@NgModule({
  declarations: [
    DashboadComponent,
    FarmComponent,
    GuestComponent,
    RoomComponent,
    FacilityComponent,
    ActivityComponent,
    FarmserviceComponent,
    UserComponent,
    GalleryComponent,
    ReviewComponent,
    BookingComponent,
    CalendarComponent,
    CardDataComponent
  ],
  imports: [
    CommonModule,
    FarmRoutingModule,
    SharedModule,
    FullCalendarModule,
    ReactiveFormsModule,
    EditorModule
  ],
  providers: [ MessageService, ConfirmationService ],
})
export class FarmModule { }
