import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
class SideModalService {
  private sideNavOpened = signal<boolean>(false);
  open() {
    this.sideNavOpened.set(true);
  }

  close() {
    this.sideNavOpened.set(false);
  }

  get isSideNavOpened() : boolean {    
    return this.sideNavOpened()
  }
}

export { SideModalService };
