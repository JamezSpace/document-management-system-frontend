import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { hugeInformationSquare, hugeTick04 } from '@ng-icons/huge-icons';

@Component({
  selector: 'nexus-notif-toast',
  imports: [NgIcon],
  templateUrl: './notif-toast.html',
  styleUrl: './notif-toast.css',
  providers: [
    provideIcons({
      hugeTick04, hugeInformationSquare
    }),
  ]
})
export class NotifToast {
    constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {message: string, type: 'success' | 'info'},
  ) {}
}
