import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DirectiveUi } from '../../../../../../interfaces/operations/cio/Directive.ui';
import { NgIcon } from "@ng-icons/core";
import { TaskDetail } from "../../../../../../components/dashboard-wide/operations/task-detail/task-detail";
import { TasksService } from '../../../../../../services/page-wide/dashboard/operations/regular/tasks/tasks-service';
import { BrnAvatar } from "@spartan-ng/brain/avatar";
import { SpartanMuted } from "../../../../../../components/system-wide/typography/spartan-muted/spartan-muted";

@Component({
  selector: 'nexus-tasks-ledger',
  imports: [SpartanH3, SpartanP, HlmSeparator, NgIcon, TaskDetail, MatTableModule,
    MatPaginatorModule, BrnAvatar, SpartanMuted],
  templateUrl: './tasks-ledger.html',
  styleUrl: './tasks-ledger.css',
})
export class TasksLedger implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  directories = signal<string[]>([]);
  taskService = inject(TasksService)

  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [
      ...prev_directories,
      currentPath.replace(',', ' > '),
    ]);
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
