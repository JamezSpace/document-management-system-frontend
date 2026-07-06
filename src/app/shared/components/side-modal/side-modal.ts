import { Component, inject } from '@angular/core';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';

@Component({
  selector: 'nexus-side-modal',
  imports: [],
  templateUrl: './side-modal.html',
  styleUrl: './side-modal.css',
  providers: [
    provideIcons({
      lucideMail,
    }),
  ],
})
export class SideModal {
  sideModalService = inject(SideModalService)

  protected closeSideNavOnBackdropClick(event: any) {
    const elFunction = event.target.dataset.function;

    if (elFunction === 'backdrop') this.sideModalService.close();
  }
  
  isSideNavOpened() : boolean {
    return this.sideModalService.isSideNavOpened
  }
  
  
}
