import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GuestComponent } from './component/guest/guest.component';
import { FacilityComponent } from './component/facility/facility.component';
import { BookingComponent } from './component/booking/booking.component';
import { ActivityComponent } from './component/activity/activity.component';
import { ReviewComponent } from './component/review/review.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { FarmserviceComponent } from './component/farmservice/farmservice.component';
import { DashboadComponent } from './component/dashboad/dashboad.component';
import { RoomComponent } from './component/room/room.component';
import { CalendarComponent } from './component/calendar/calendar.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboadComponent },
        { path: 'guest', component: GuestComponent },
        { path: 'booking', component: BookingComponent },
        { path: 'room', component: RoomComponent },
        { path: 'service', component: FarmserviceComponent },
        { path: 'facility', component: FacilityComponent },
        { path: 'activity', component: ActivityComponent },
        { path: 'review', component: ReviewComponent },
        { path: 'gallery', component: GalleryComponent },
        { path: 'calendar', component: CalendarComponent },
    ])],
    exports: [RouterModule]
})
export class FarmRoutingModule { }
