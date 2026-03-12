import { Component, inject } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { User } from '../../../../../interfaces/users/User.interface';
import { SpartanH2 } from "../../../../../components/system-wide/typography/spartan-h2/spartan-h2";
import { SpartanP } from "../../../../../components/system-wide/typography/spartan-p/spartan-p";
import { SpartanH4 } from "../../../../../components/system-wide/typography/spartan-h4/spartan-h4";
import { HlmSeparator } from "@spartan-ng/helm/separator";

@Component({
  selector: 'nexus-overview',
  imports: [HlmCardImports, SpartanH2, SpartanP, SpartanH4, HlmSeparator],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
    
    user: User = {
    name: 'samuel',
    role: 'user',
    details: {},
    efficiencyScore: 25,
    permissionLevel: 1
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
