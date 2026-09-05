import { Component, inject, input, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks/tasks-service';

@Component({
  selector: 'nexus-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
})
export class TaskDetail implements OnInit {
  taskId = input<string>('');
  taskService = inject(TasksService);

  async ngOnInit(): Promise<void> {
    if (this.taskId().length !== 0)
      await this.taskService.fetchTaskById(this.taskId());
  }
}
