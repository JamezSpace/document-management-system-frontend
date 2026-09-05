import { Injectable, signal } from '@angular/core';
import type { WorkTask } from '../../../../models/ui/work-management/WorkTask.ui';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks = signal<WorkTask[]>([]);

  async fetchAllTasks() {}
  async fetchTaskById(taskId: string) {}
}
