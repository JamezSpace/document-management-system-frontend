import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrnAvatar } from "@spartan-ng/brain/avatar";
import { NgIcon } from '@ng-icons/core';
import { TasksService } from '../../services/tasks/tasks-service';
import type { WorkTask } from '../../../../models/ui/work-management/WorkTask.ui';
import { TaskDetail } from '../../components/task-detail/task-detail';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import type { EmptyStateConfig } from '../../../../models/ui/global/EmptyState.ui';

@Component({
  selector: 'nexus-tasks-ledger',
  imports: [HlmSeparator, NgIcon, TaskDetail, MatTableModule,
    MatPaginatorModule, BrnAvatar, EmptyState],
  templateUrl: './tasks-ledger.html',
})
export class TasksLedger implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  directories = signal<string[]>([]);
  taskService = inject(TasksService);
  
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

  dataSource = new MatTableDataSource<WorkTask>([]);
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
  closeSideNavOnBackdropClick(event: MouseEvent) {
    const elFunction = (event.target as HTMLElement).dataset['function'];

    if (elFunction === 'backdrop') this.closeSideNav();
  }
}
