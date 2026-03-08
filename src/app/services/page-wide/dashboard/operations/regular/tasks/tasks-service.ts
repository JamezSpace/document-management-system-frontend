import { Injectable, signal } from '@angular/core';
import { DirectiveUi } from '../../../../../../interfaces/operations/cio/Directive.ui';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
    // create a custom interface for tasks, never use the directive ui as it is a chief level interface, you can extend the DirectiveUi and omit every chief level property
  tasks = signal<DirectiveUi[]>([])
    // taskDetail = signal<TaskDetailApi | null>(null);

    async fetchAllTasks() {}
  async fetchTaskById(taskId: string) {}
}
