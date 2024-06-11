import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ButtonDirective } from "primeng/button";

import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventApi, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import itLocale from '@fullcalendar/core/locales/it';

import { filter, firstValueFrom, Subscription } from "rxjs";

import { BookingService } from "../../../services/booking/booking.service";
import { Appointment } from "../../../../../progetto_shared/appointment.type";
import { AuthService } from "../../../services/auth/auth.service";
import { WaitingListEntity } from "../../../../../progetto_shared/waitingListEntity.type";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    CardModule,
    ButtonDirective,
    RouterLink
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  calendarOptions: CalendarOptions | undefined;

  private subscription: Subscription | undefined;

  constructor(private bookingService: BookingService, private router: Router, private messageService: MessageService, private authService: AuthService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initCalendar();

    this.bookingService.appointment$.next({ ...this.bookingService.appointment$.value, eventDate: undefined });
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      stickyHeaderDates: true,
      stickyFooterScrollbar: true,
      height: 'auto',
      slotMinTime: '08:30',
      slotMaxTime: '18:30',
      initialView: 'timeGridWeek',
      nowIndicator: true,
      selectable: true,
      editable: false,
      droppable: false,
      allDaySlot: false,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'timeGridWeek,dayGridMonth'
      },
      views: {
        timeGridWeek: {
          type: 'timeGrid',
          duration: { weeks: 1 }
        },
        timeGridDay: {
          type: 'timeGrid',
          duration: { days: 1 }
        },
      },
      lazyFetching: true,
      eventDataTransform: eventData => {
        for (let prop in eventData) {
          if (eventData[prop] === null) {
            delete eventData[prop];
          }
        }
        return eventData;
      },
      eventClick: clickInfo => this.handleClick(clickInfo), // click on an event
    };
  }

  private async handleClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    const event = clickInfo.event;

    if(await this.isDatePassed(event)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore di selezione',
        detail: 'Impossibile selezionare una data passata', life: 3000
      });
      return;
    }

    if(event.extendedProps["appointment"])
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore di selezione',
        detail: 'Impossibile selezionare una data già occupata', life: 3000
      });
      return;
    }

    const currentAppointment = this.bookingService.appointment$.value;
    this.bookingService.appointment$.next({...currentAppointment, eventId: event.id, eventDate: event.start?.toISOString()});

    this.router.navigate(['booking', 'upload']);
  }

  private loadEvents(): void {
    this.subscription = this.bookingService.appointment$.pipe(
      filter(appointment => !!appointment &&!!appointment.legalServiceId), // filters null values
    ).subscribe({
      next: (appointment: Appointment | null) => {
        const calendar = this.calendarComponent?.getApi();
        calendar?.addEventSource(`http://localhost:7071/api/services/events/${appointment!.legalServiceId}`);
      },
      error: (error) => {
        console.error(error.message);

        this.router.navigate(['booking']);
      }
    });
  }

  onBack(): void {
    this.bookingService.appointment$.next(null);
  }

  async subscribeToWaitingList(): Promise<void> {
    this.confirmationService.confirm({
      message: 'Riceverai una email se un appuntamento sarà disponibile a causa di cancellazioni',
      header: 'Vuoi iscriverti alla lista d\'attesa?',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: async () => {
        const accountInfo = await firstValueFrom(this.authService.getActiveAccount());
        const appointment = await firstValueFrom(this.bookingService.appointment$);
        const entity: WaitingListEntity = {
          legalServiceId: appointment?.legalServiceId!,
          user: {
            id: accountInfo?.homeAccountId!,
            email: accountInfo?.username!
          }
        }
        const subscription: Subscription = this.bookingService.subscribeToWaitingList(entity).subscribe({
          next: response => { },
          error: error => console.error(error),
          complete: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Iscrizione effettuata',
              detail: 'Riceverai una email se un appuntamento sarà disponibile a causa di cancellazioni',
              life: 3000
            });

            this.router.navigate(['']);

            subscription.unsubscribe();
          }
        });
      },
      reject: () => { }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();

    const calendar = this.calendarComponent?.getApi();
    calendar?.removeAllEventSources();
    calendar?.removeAllEvents();
  }

  private async isDatePassed(event: EventApi): Promise<boolean> {
    const eventDate = event.start!;

    const response = await firstValueFrom(this.bookingService.getDate());
    const currentDate = new Date(response.dateISO);

    return eventDate < currentDate
  }
}
