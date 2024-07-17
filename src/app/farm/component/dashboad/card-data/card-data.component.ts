import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-card',
  templateUrl: './card-data.component.html',
  styleUrls: ['./card-data.component.scss']
})
export class CardDataComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() iconClass: string = '';
  @Input() iconBgClass: string='';

  constructor() { }
}
