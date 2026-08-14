import { AfterViewInit, Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeTickDouble02 } from '@ng-icons/huge-icons';
import { saxTickCircleBold } from '@ng-icons/iconsax/bold';
import { lucideEye, lucideGavel, lucideSend, lucideXCircle, lucideZap } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnAvatarImports } from '@spartan-ng/brain/avatar';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { SideModalService } from '../../../../../../core/services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { DirectivesService } from '../../../../../../core/services/page-wide/dashboard/operations/cio/directives/directives-service';
import { DirectiveUi } from '../../../../../../models/api/directive/Directive.ui';
import { DirectiveDetail } from '../../../../../../shared/components/dashboard-wide/operations/directive-detail/directive-detail';
import { SideModal } from '../../../../../../shared/components/side-modal/side-modal';


@Component({
  selector: 'nexus-directives-log',
  imports: [
    HlmSelectImports,
    HlmAlertDialogImports,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    NgIcon,
    BrnAvatarImports,
    HlmSeparator,
    HlmTextareaImports,
    MatTableModule,
    MatPaginatorModule,
    DirectiveDetail,
    SideModal
],
  templateUrl: './directives-log.html',
  styleUrl: './directives-log.css',
  providers: [
    provideIcons({
      lucideEye,
      lucideZap,
      lucideGavel,
      lucideSend,
      lucideXCircle,
      hugeTickDouble02,
      saxTickCircleBold,
    }),
  ],
})
export class DirectivesLog implements OnInit, AfterViewInit {
  activatedRouter = inject(ActivatedRoute);
  directiveService = inject(DirectivesService);

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','))
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.directiveService.directives();
    });
  }

  unitStaffers = this.directiveService.unitStaffers;
  dataSource = new MatTableDataSource<DirectiveUi>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onPriorityLevelSelect($event: any) {
    throw new Error('Method not implemented.');
  }

  columnsToDisplay: string[] = ['id', 'heading', 'recipients', 'compliance', 'modifiedAt'];

  convertToCompliancePercentage(currentCount: number, expectedCount: number) {
    return (currentCount / expectedCount) * 100;
  }

  sideModalService = inject(SideModalService);
  directiveIdToFetchDetailsOn = signal<string>('');
  async seeDirectiveFullDetails(directiveId: string) {
    // open side nav
    this.sideModalService.open();

    this.directiveIdToFetchDetailsOn.set(directiveId);
  }

  closeSideNav() {
    // calling the exposed method of the side modal
    this.sideModalService.close()
  }

  broadcastDirectiveDetail = signal<DirectiveUi | null>({
    id: 'dir_9f3k2l8x',
    heading: 'Updated Remote Work Compliance Policy',
    recipients: [
      {
        id: 'staff_001',
        firstName: 'James',
        lastName: 'Samuel',
        role: 'Backend Developer',
      },
      {
        id: 'staff_002',
        firstName: 'Ada',
        lastName: 'Okafor',
        role: 'HR Manager',
      },
      {
        id: 'staff_003',
        firstName: 'Michael',
        lastName: 'Adeyemi',
        role: 'Operations Lead',
      },
    ],
    compliance: {
      seen: 3,
      acknowledged: 2,
    },
    modifiedAt: '2026-03-03T14:22:31.000Z',
  });
}
