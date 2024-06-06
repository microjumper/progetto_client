import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from "@angular/common";

import { MenuItem, PrimeNGConfig } from "primeng/api";
import { ButtonDirective } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { ToolbarModule } from "primeng/toolbar";

import { AuthService } from "./services/auth/auth.service";
import { filter, Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonDirective, MenuModule, ToolbarModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  isLogged = false;

  items: MenuItem[] = [
    {
      label: 'username',
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.authService.logout()
        }
      ]
    }
  ];

  private subscription: Subscription | undefined;

  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.subscription = this.authService.getActiveAccount().pipe(
      filter(account => !!account)).subscribe({
      next: (account) => {
        this.items[0].label = account?.username;
        this.isLogged = true;
      },
      error: (error) => {
        console.error(error.message);
        this.isLogged = false;
      }
    })
  }

  login() {
    this.authService.loginWithMicrosoft().subscribe({
      next: (response) => {
        this.isLogged = !!this.authService.getActiveAccount();
      },
      error: (error) => {
        console.error(error.message);
        this.isLogged = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
