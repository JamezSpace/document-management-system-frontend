import { Component, inject, OnInit, signal } from '@angular/core';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';

@Component({
  selector: 'nexus-side-modal',
  imports: [],
  templateUrl: './side-modal.html',
  styleUrl: './side-modal.css',
})
export class SideModal implements OnInit {
  sideModalService = inject(SideModalService);

    ngOnInit(): void {
        console.log(this.sideModalService.isSideNavOpened);
    }

  protected closeSideNavOnBackdropClick(event: any) {
    const elFunction = event.target.dataset.function;

    if (elFunction === 'backdrop') this.sideModalService.close();
  }
  
  isSideNavOpened() : boolean {
    return this.sideModalService.isSideNavOpened
  }
  
  
}
