import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";

import { BookingService } from "../../../services/booking/booking.service";

export const uploadGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const bookingService = inject(BookingService);

  if (bookingService.appointment$.value?.eventDate) {
    return true;
  } else {
    return router.createUrlTree(['/booking/date']);
  }
};
