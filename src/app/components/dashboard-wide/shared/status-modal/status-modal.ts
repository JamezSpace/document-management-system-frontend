import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { NgIcon } from "@ng-icons/core";
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { NotifStatus } from '../../../../interfaces/system/NotifStatus.ui';
import { SpartanH3 } from "../../../system-wide/typography/spartan-h3/spartan-h3";
import { SpartanP } from "../../../system-wide/typography/spartan-p/spartan-p";

@Component({
  selector: 'nexus-status-modal',
  imports: [NgIcon, HlmAlertDialogImports, SpartanH3, SpartanP],
  templateUrl: './status-modal.html',
  styleUrl: './status-modal.css',
})
export class StatusModal {
    statusModal = input<NotifStatus>({
        description: '',
        iconName: '',
        title: ''
    });

    @ViewChild('dialogTrigger')
    private dialogTrigger?: ElementRef<HTMLButtonElement>;

    open() {
      this.dialogTrigger?.nativeElement.click();
    }
}
