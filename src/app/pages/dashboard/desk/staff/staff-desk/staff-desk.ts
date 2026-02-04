import { Component } from '@angular/core';
import { SpartanH2 } from '../../../../../components/public/spartan-h2/spartan-h2';
import { User } from '../../../../../interfaces/dashboard/User.interface';
import { Document } from '../../../../../interfaces/dashboard/ui-models/Dashboard.ui-model';

@Component({
  selector: 'nexus-staff-desk',
  imports: [SpartanH2],
  templateUrl: './staff-desk.html',
  styleUrl: './staff-desk.css',
})
export class StaffDesk {
  user: User = {
    name: 'samuel',
    role: 'user',
    details: {},
    efficiencyScore: 25,
  };
  documents!: Document;

  lastDraft = {
    lastSaved: new Date().toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    }),
    title: 'The tale of the new song',
    ref: 'ui/sen/2202',
    modifiedAt: '2/2/2026',
  };

validToShowModifiedAt() {
    return new Date(this.lastDraft.modifiedAt).getTime() < Date.now();
}

  mostRecentDraftDurationFromNow(dateNow: string): string | undefined {
    const parsedDate = new Date(dateNow).getTime();

    const difference = (Date.now() - parsedDate) / 1000;

    if (difference < 0) return;
    let formattedText = '';

    switch (true) {
      case difference < 60:
        formattedText = `${Math.floor(difference)}s ago`;
        break;
      case difference >= 60 && difference <= 3600:
        formattedText = `${Math.floor(difference / 60)} mins ago`;
        break;
      case difference > 3600:
        formattedText = `${Math.floor(difference / 3600)} hours ago`;
    }

    return formattedText;
  }

  directives = [
    {
      priority: 'low',
      type: 'memo',
      message: 'respond now',
    },
  ];

  continueDraft() {}
}
