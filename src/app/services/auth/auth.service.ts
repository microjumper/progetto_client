import { Injectable, OnDestroy } from '@angular/core';

import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, AccountInfo, EventType } from "@azure/msal-browser";

import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private subscriptions: Subscription[] = [];
  private activeAccount$: BehaviorSubject<AccountInfo | null> = new BehaviorSubject<AccountInfo | null>(null);

  constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService) {
    this.subscriptions.push(this.msalService.initialize().subscribe({
      next: () => this.activeAccount$.next(this.msalService.instance.getActiveAccount()),
      error: err => console.error('MsalService initialization failed:', err.message)
    }));

    this.subscriptions.push(this.msalBroadcastService.msalSubject$.subscribe({
      next: (event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS) {
          const authenticationResult = event.payload as AuthenticationResult;
          this.activeAccount$.next(authenticationResult.account);
        }
      },
      error: err => console.error('MsalBroadcastService failed:', err.message)
    }));
  }

  getActiveAccount(): Observable<AccountInfo | null> {
    return this.activeAccount$;
  }

  loginWithMicrosoft(): Observable<AuthenticationResult> {
    return this.msalService.loginPopup().pipe(
      tap(response => {
        this.msalService.instance.setActiveAccount(response.account);
      })
    );
  }

  logout() {
    this.msalService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
    this.activeAccount$.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
