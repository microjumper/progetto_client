import { Component, OnInit } from '@angular/core';

import { StepsModule } from "primeng/steps";
import { MenuItem } from "primeng/api";
import { CardModule } from "primeng/card";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    StepsModule,
    CardModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Seleziona un servizio',
        routerLink: 'service'
      },
      {
        label: 'Seleziona un appuntamento',
        routerLink: 'date'
      },
      {
        label: 'Allega dei documenti (opzionale)',
        routerLink: 'upload'
      }
    ];
  }
}
