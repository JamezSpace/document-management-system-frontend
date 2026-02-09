import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideFile, lucideSave, lucideUserRound, lucidePlus } from '@ng-icons/lucide';
import { SpartanMuted } from '../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../components/system-wide/typography/spartan-p/spartan-p';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { StaffService } from '../../../services/page-wide/dashboard/document-workspace/staff/staff-service';
import { DepartmentCategory } from '../../../interfaces/departments/Department.entity';
import { HlmSeparator } from "@spartan-ng/helm/separator";

@Component({
  selector: 'nexus-workspace',
  imports: [NgIcon, SpartanMuted, SpartanP, HlmIcon, HlmSelectImports, BrnSelectImports, HlmSeparator],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideFile,
      lucideSave,
      lucideUserRound,
      lucidePlus
    }),
  ],
})
export class Workspace {
  staffService = inject(StaffService);

  document = {
    title: 'Q3 Financial Projection',
    folderLocation: '2026/iTCC/EXT-MEMO-001',
  };

  departments = this.staffService.departments;
  academicDepartments = computed(() => this.departments().filter(dept => dept.category === DepartmentCategory.ACADEMIC))
  nonAcademicDepartments = computed(() => this.departments().filter(dept => dept.category === DepartmentCategory.NON_ACADEMIC))

  correspondenceVolumes = this.staffService.correspondenceVolumes

  fileUploaded = signal<File | null>(null)
  onUploadAttachment(event: any) {
    const uploadedFile = event.target.files[0];
    
    // perform check and scan on this document

    // update component with file uploaded
    this.fileUploaded.set(uploadedFile)
  }
}
