import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard.service';
import { firstValueFrom, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.scss'],
  providers:[MessageService]
})
export class DashboadComponent implements OnInit {

  dataList: any = {};

  constructor(private dashboardService: DashboardService,
    private messageService : MessageService
  ) { }

  ngOnInit(): void {
    this.getDashboard();
  }

    private getDashboard(): Promise<any> {
      return firstValueFrom(this.dashboardService.getCounts().pipe(
          tap((res) => {
            if (res && res.data && res.data.length > 0) {
              this.dataList = res.data[0];
              } else {
                  this.messageService.add({ severity: 'error', summary: 'Gagal', detail: res.details });
              }
          }),
      ));
    }
}