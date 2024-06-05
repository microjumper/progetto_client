import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

import { ButtonDirective } from "primeng/button";
import { CarouselModule } from "primeng/carousel";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonDirective,
    CarouselModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  images: any[];

  constructor() {

    this.images = [
      { source: 'assets/carousel/photo_1.jpg', alt: '' },
      { source: 'assets/carousel/photo_2.jpg', alt: '' },
      { source: 'assets/carousel/photo_3.jpg', alt: '' },
      { source: 'assets/carousel/photo_4.jpg', alt: '' }
      ];
  }
}
