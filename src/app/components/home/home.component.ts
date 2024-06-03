import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";

import { ToolbarModule } from "primeng/toolbar";
import { MenuModule } from "primeng/menu";
import { ButtonDirective } from "primeng/button";
import { MenuItem } from "primeng/api";
import { CarouselModule } from "primeng/carousel";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ToolbarModule,
    MenuModule,
    ButtonDirective,
    CarouselModule,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  items: MenuItem[];
  images: any[];

  constructor() {
    this.items = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => console.log('Logout')
      }
    ];

    this.images = [
      { source: 'assets/carousel/photo_1.jpg', alt: '' },
      { source: 'assets/carousel/photo_2.jpg', alt: '' },
      { source: 'assets/carousel/photo_3.jpg', alt: '' },
      { source: 'assets/carousel/photo_4.jpg', alt: '' }
      ];
  }
}
