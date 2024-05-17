import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNGConfig } from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.translateCalendar();
  }

  private translateCalendar(): void
  {
    this.primengConfig.setTranslation({
      monthNames: [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
      ],
      monthNamesShort: [
        "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
      ],
      dayNames: [
        "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"
      ],
      dayNamesShort: [
        "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
      ],
      dayNamesMin: [
        "Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"
      ],
      today: 'Oggi',
      clear: 'Cancella'
    });
  }
}
