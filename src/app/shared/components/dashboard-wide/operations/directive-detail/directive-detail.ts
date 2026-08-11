import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeSignature, hugeTimer01 } from '@ng-icons/huge-icons';
import { saxTickCircleBold } from '@ng-icons/iconsax/bold';
import { lucideScrollText } from '@ng-icons/lucide';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmAlertDialogImports } from "@spartan-ng/helm/alert-dialog";
import { DirectivesService } from '../../../../../core/services/page-wide/dashboard/operations/cio/directives/directives-service';
import { DirectiveDetailApi } from '../../../../../models/api/directive/DirectiveDetail.api';
import { SpartanH3 } from '../../../../typography/spartan-h3/spartan-h3';
import { SpartanMuted } from '../../../../typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../typography/spartan-p/spartan-p';

@Component({
  selector: 'nexus-directive-detail',
  imports: [NgIcon, SpartanP, HlmSeparator, SpartanMuted, SpartanH3,
    HlmAlertDialogImports],
  templateUrl: './directive-detail.html',
  styleUrl: './directive-detail.css',
  providers: [provideIcons({ saxTickCircleBold, hugeTimer01, hugeSignature, lucideScrollText })],
})
export class DirectiveDetail implements OnInit {
  directiveId = input<string>('');
  directiveService = inject(DirectivesService);
  // directiveDetail = this.directiveService.directiveDetail;
  directiveDetail = signal<DirectiveDetailApi>({
    id: 'DIR-001',
    instruction:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente nobis maxime neque quisquam accusantium velit laborum at, aperiam, deserunt quae eaque architecto, doloribus ullam ad quibusdam explicabo! Distinctio, error obcaecati./nCorrupti pariatur et hic deleniti voluptates velit praesentium temporibus est neque minima? Tenetur a maiores quos at dolorem eos optio beatae, illum laudantium iusto sit corrupti, nisi repellat impedit officia?/nDebitis voluptatum modi quae, fugiat neque, doloremque molestiae, cumque officiis reiciendis fugit dolorum. Molestiae, nesciunt. Voluptatem, recusandae labore! Sed vel ratione fugiat expedita praesentium totam architecto iste quia, saepe earum!',
    subject: 'Annual Code of Conduct Review',
    priorityLevel: 'high',
    registryVolume: 'financial',
    createdAt: new Date('2026-01-15T09:00:00Z'),
    modified: null,
    addressedTo: ['STAFF-02'],
  });

  async ngOnInit(): Promise<void> {
    if (this.directiveId().length !== 0)
      await this.directiveService.fetchDirectiveById(this.directiveId());
  }
}
