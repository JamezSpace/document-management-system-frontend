import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { NgIcon } from "@ng-icons/core";
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { NotifStatus } from '../../../models/ui/global/NotifStatus.ui';

@Component({
  selector: 'nexus-status-modal',
  imports: [NgIcon, HlmAlertDialogImports],
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
