import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { OfficeContextService } from '../../context/office-context.service';

@Component({
  selector: 'nexus-workbench-page',
  imports: [HlmCardImports],
  templateUrl: './workbench-page.html',
  styleUrl: './workbench-page.css',
})
export class WorkbenchPage {
  private readonly route = inject(ActivatedRoute);
  readonly office = inject(OfficeContextService).active;
  readonly title = computed(() => this.route.snapshot.data['title'] as string ?? this.office()?.definition.label ?? 'Office');
  readonly description = computed(() => this.route.snapshot.data['description'] as string ?? this.office()?.definition.summary ?? '');
  readonly status = computed(() => this.route.snapshot.data['status'] as string ?? 'Workspace');
}
