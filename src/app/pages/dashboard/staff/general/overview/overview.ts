import { Component, inject } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { CurrentStaffService } from '../../../../../features/shared/services/current-staff/current-staff-service';

@Component({
  selector: 'nexus-overview',
  imports: [HlmCardImports],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
    private currentStaffService = inject(CurrentStaffService);
    
    readonly staff = this.currentStaffService.data;

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
      type: 'internal memo',
      message: "meeting at director's office",
    },
    {
      priority: 'high',
      type: 'internal memo',
      message: 'please see memo on document handling policy updates',
    },
  ];

  continueDraft() {}
}
