import { Component } from '@angular/core';
import { NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { ButtonDirective } from "primeng/button";
import { FieldsetModule } from "primeng/fieldset";

import { Appointment } from "../../../../../progetto_shared/appointment.type";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    ButtonDirective,
    NgForOf,
    FieldsetModule,
    RouterLink
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  appointments: Appointment[] = [];

  cancelAppointment(appointmentID: string) { }
}
