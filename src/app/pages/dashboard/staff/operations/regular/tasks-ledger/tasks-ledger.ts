import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrnAvatar } from "@spartan-ng/brain/avatar";
import { NgIcon } from '@ng-icons/core';
import { TasksService } from '../../../../../../core/services/page-wide/dashboard/operations/regular/tasks/tasks-service';
import { DirectiveUi } from '../../../../../../models/api/directive/Directive.ui';
import { TaskDetail } from '../../../../../../shared/components/dashboard-wide/operations/task-detail/task-detail';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import type { EmptyStateConfig } from '../../../../../../models/ui/global/EmptyState.ui';

@Component({
  selector: 'nexus-tasks-ledger',
  imports: [HlmSeparator, NgIcon, TaskDetail, MatTableModule,
    MatPaginatorModule, BrnAvatar, EmptyState],
  templateUrl: './tasks-ledger.html',
  styleUrl: './tasks-ledger.css',
})
export class TasksLedger implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  directories = signal<string[]>([]);
  taskService = inject(TasksService)
  readonly emptyState: EmptyStateConfig = {
    kind: 'no-data',
    iconName: 'lucideListTodo',
    title: 'No assignments are waiting',
    description:
      'Directives and document actions assigned to you will appear here with their deadlines and compliance status.',
  };

  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [
      ...prev_directories,
      currentPath.replace(',', ' > '),
    ]);
    void this.taskService.fetchAllTasks();
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.taskService.tasks();
    });
  }

  dataSource = new MatTableDataSource<DirectiveUi>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columnsToDisplay: string[] = ['id', 'heading'];

  sideNavOpened = signal<boolean>(false);
  taskIdToFetchDetailsOn = signal<string>('');

  async seeTaskFullDetails(taskId: string) {
    // open side nav
    this.sideNavOpened.set(true);

    this.taskIdToFetchDetailsOn.set(taskId);
  }

  closeSideNav() {
    this.sideNavOpened.set(false);
  }
  closeSideNavOnBackdropClick(event: any) {
    const elFunction = event.target.dataset.function;

    if (elFunction === 'backdrop') this.closeSideNav();
  }
}
