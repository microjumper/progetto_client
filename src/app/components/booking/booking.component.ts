import { Component, OnInit, ViewChild } from '@angular/core';

import { DropdownModule } from "primeng/dropdown";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventApi, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import itLocale from '@fullcalendar/core/locales/it';

import { DataService } from "../../services/data/data.service";
import { LegalService } from "../../../../progetto_shared/legalService.type";
import { BookingService } from "../../services/booking/booking.service";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    DropdownModule,
    FullCalendarModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  calendarOptions: CalendarOptions | undefined;
  legalServicesDropdown: LegalService[] = [];

  constructor(private dataService: DataService, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.getLegalServices();

    this.initCalendar();
  }

  private getLegalServices(): void
  {
    this.dataService.getLegalServices().subscribe({
      next: (data: LegalService[]) => {
        this.legalServicesDropdown = data;
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      stickyHeaderDates: true,
      stickyFooterScrollbar: true,
      height: 'auto',
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

    console.log(clickInfo.event);
  }

  onLegalServiceSelected(event: { originalEvent: Event, value: any }): void
  {
    const calendar = this.calendarComponent?.getApi();
    if(calendar) {
      calendar.removeAllEventSources();
      calendar.removeAllEvents();
      calendar.addEventSource(`http://localhost:7071/api/events/legal-service/${event.value.id}`);
    }
  }
}
