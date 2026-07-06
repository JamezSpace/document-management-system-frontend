import { Component, Input } from '@angular/core';

@Component({
  selector: 'nexus-id-card',
  imports: [],
  templateUrl: './id-card.html',
  styleUrl: './id-card.css',
})
export class IdCard {
    @Input({alias: 'idCardPage', required: true})
    page !: 'front' | 'back';

    @Input({alias: 'staffDetails', required: true})
    staffDetails !: any
}
