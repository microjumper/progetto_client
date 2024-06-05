import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from "@angular/common";

import { MenuItem, PrimeNGConfig } from "primeng/api";
import { ButtonDirective } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { ToolbarModule } from "primeng/toolbar";

import { AuthService } from "./services/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonDirective, MenuModule, ToolbarModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  isLogged: boolean;
  items: MenuItem[];

  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) {
    this.isLogged = false;
    this.items = [];
  }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.isLogged = !!this.authService.getActiveAccount();

    this.setupMenu();
  }

  login() {
    this.authService.loginWithMicrosoft().subscribe({
      next: (response) => {
        this.isLogged = !!this.authService.getActiveAccount();
        this.setupMenu();
      },
      error: (error) => console.error(error.message)
    });
  }

  private setupMenu() {
    this.items = [
      {
        label: this.authService.getActiveAccount()?.username,
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout()
          }
        ]
      }
    ];
  }
}
