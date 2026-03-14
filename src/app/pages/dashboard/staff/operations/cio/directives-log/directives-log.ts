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
import { DirectiveDetail } from '../../../../../../components/dashboard-wide/operations/directive-detail/directive-detail';
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../../components/system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { DirectiveUi } from '../../../../../../interfaces/operations/cio/Directive.ui';
import { DirectivesService } from '../../../../../../services/page-wide/dashboard/operations/cio/directives/directives-service';

@Component({
  selector: 'nexus-directives-log',
  imports: [
    SpartanH3,
    SpartanP,
    HlmSelectImports,
    HlmAlertDialogImports,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    NgIcon,
    BrnAvatarImports,
    HlmSeparator,
    HlmTextareaImports,
    SpartanH4,
    SpartanMuted,
    MatTableModule,
    MatPaginatorModule,
    DirectiveDetail,
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

    this.directories.update((prev_directories) => [
      ...prev_directories,
      currentPath.replace(',', ' > '),
    ]);
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

  sideNavOpened = signal<boolean>(false);
  directiveIdToFetchDetailsOn = signal<string>('');
  async seeDirectiveFullDetails(directiveId: string) {
    // open side nav
    this.sideNavOpened.set(true);

    this.directiveIdToFetchDetailsOn.set(directiveId);
  }

  closeSideNav() {
    this.sideNavOpened.set(false);
  }
  closeSideNavOnBackdropClick(event: any) {
    const elFunction = event.target.dataset.function;

    if (elFunction === 'backdrop') this.closeSideNav();
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
