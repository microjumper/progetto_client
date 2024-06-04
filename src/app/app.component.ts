import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuItem, PrimeNGConfig } from "primeng/api";
import { ButtonDirective } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { ToolbarModule } from "primeng/toolbar";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, ButtonDirective, MenuModule, ToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  items: MenuItem[];

  constructor(private primengConfig: PrimeNGConfig) {
    this.items = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => console.log('Logout')
      }
    ];
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
