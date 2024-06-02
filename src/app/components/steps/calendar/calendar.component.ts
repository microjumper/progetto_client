import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import itLocale from '@fullcalendar/core/locales/it';

import { filter, Subscription } from "rxjs";

import { BookingService } from "../../../services/booking/booking.service";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  calendarOptions: CalendarOptions | undefined;

  private subscription: Subscription | undefined;

  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    this.initCalendar();
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

  private handleClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    const event = clickInfo.event;
  }

  private loadEvents(): void {
    this.subscription = this.bookingService.legalServiceId.pipe(
      filter(legalServiceId => !!legalServiceId)) // filters empty strings
      .subscribe({
      next: (legalServiceId: string) => {
        const calendar = this.calendarComponent?.getApi();
        calendar?.addEventSource(`http://localhost:7071/api/events/legal-service/${legalServiceId}`);
      },
      error: (error) => {
        console.error(error.message);

        this.router.navigate(['booking']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();

    const calendar = this.calendarComponent?.getApi();
    calendar?.removeAllEventSources();
    calendar?.removeAllEvents();
  }
}
