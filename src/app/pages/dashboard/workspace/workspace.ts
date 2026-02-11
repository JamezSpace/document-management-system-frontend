import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideFile,
  lucideLock,
  lucideLockOpen,
  lucidePanelLeftClose,
  lucidePanelRightClose,
  lucidePlus,
  lucideSave,
  lucideUserRound,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { Delta } from 'quill';
import { MemoBodyEditor } from '../../../components/editors/memo-body-editor/memo-body-editor';
import { ExternalMemoTemplate } from '../../../components/editors/templates/external-memo-template/external-memo-template';
import { LineLoader } from '../../../components/system-wide/loaders/line-loader/line-loader';
import { SpartanMuted } from '../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../components/system-wide/typography/spartan-p/spartan-p';
import { DepartmentCategory } from '../../../interfaces/departments/Department.entity';
import { StaffService } from '../../../services/page-wide/dashboard/document-workspace/staff/staff-service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GenericDashboardService } from '../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'nexus-workspace',
  imports: [
    NgIcon,
    SpartanMuted,
    SpartanP,
    LineLoader,
    ExternalMemoTemplate,
    MemoBodyEditor,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HlmIcon,
    HlmSeparator,
    HlmButtonImports,
    HlmSelectImports,
    HlmDropdownMenuImports,
  ],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideFile,
      lucideSave,
      lucideUserRound,
      lucidePlus,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      lucideLock,
      lucideLockOpen,
    }),
  ],
})
export class Workspace implements OnInit {
  location = inject(Location);
  loading = signal<boolean>(false);
  staffService = inject(StaffService);
  genericDashboardService = inject(GenericDashboardService);

  sidebarClosed = signal<boolean>(false);
  isDocmentMetadataEditable = signal<boolean>(false);

  goToPreviousLocation() {
    this.location.back();
  }

  ngOnInit(): void {
    // this.staffService.getSignaturePlaceholder();
  }

  constructor() {
    effect(() => {
      if (this.isMobile()) this.sidebarClosed.set(true);
      else this.sidebarClosed.set(false);
    });
  }

  private breakpointObserver = inject(BreakpointObserver);
  // Create a signal that is true when we are on a small screen (e.g., Handset)
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  document = {
    title: 'Q3 Financial Projection',
    folderLocation: '2026/iTCC/EXT-MEMO-001',
  };

  departments = this.staffService.departments;
  academicDepartments = computed(() =>
    this.departments().filter((dept) => dept.category === DepartmentCategory.ACADEMIC),
  );
  nonAcademicDepartments = computed(() =>
    this.departments().filter((dept) => dept.category === DepartmentCategory.NON_ACADEMIC),
  );

  correspondenceVolumes = this.staffService.correspondenceVolumes;

  fileUploaded = signal<File | null>(null);
  onUploadAttachment(event: any) {
    this.loading.set(true);
    const uploadedFile = event.target.files[0];

    // perform check and scan on this document

    // update component with file uploaded
    this.fileUploaded.set(uploadedFile);
    this.loading.set(false);
  }

  documentMetadata = new FormGroup({
    department: new FormControl(''),
    volume: new FormControl(''),
  });

  searchDeptValue = signal<string>('');
  searchVolValue = signal<string>('');

  filteredDepartments = computed(() => {
    const filterValue = this.searchDeptValue().toLowerCase();
    return this.departments().filter((dept) => dept.label.toLowerCase().includes(filterValue));
  });
  filteredVolumes = computed(() => {
    const filterValue = this.searchVolValue().toLowerCase();
    return this.correspondenceVolumes().filter((vol) =>
      vol.name.toLowerCase().includes(filterValue),
    );
  });

  updateDeptSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchDeptValue.set(value);
  }
  updateVolSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchVolValue.set(value);
  }

  // scans for signature placeholder
  signaturePlaceholderBounds = computed(() => this.scanForSignaturePlaceholderAndReturnBounds());

  isPrintPreview = signal(false);
  editorHtmlContent = signal<string>('');

  previewDocument() {
    // retrieve content as html
    const htmlContent = this.retrieveEditorContentsAsSpecificType('html') as string;

    this.editorHtmlContent.set(htmlContent);

    // checks if signature exists
    const signatureExists = this.signaturePlaceholderBounds().exists;

    this.isPrintPreview.set(true);
  }

  exitPreview() {
    this.paperViewControls.set(false);
    this.isPrintPreview.set(false);
  }

  paperViewControls = signal<boolean>(false);
  @ViewChild('workspaceRoot')
  workspaceRoot!: ElementRef<HTMLDivElement>;

  onMouseEnter() {
    if (this.isPrintPreview()) {
      this.paperViewControls.set(true);
    }
  }

  onMouseLeave() {
    if (this.isPrintPreview()) {
      this.paperViewControls.set(false);
    }
  }

  retrieveEditorContentsAsSpecificType(desiredType: 'delta' | 'text' | 'html') {
    const quillEditorContent = this.genericDashboardService.quillEditorContent();

    if (desiredType === 'delta') return quillEditorContent.deltaContent;
    else if (desiredType === 'html') return quillEditorContent.htmlContent;
    else if (desiredType === 'text') return quillEditorContent.textContent;

    return '';
  }

  signaturePlaceholder = this.staffService.signaturePlaceholder;
  scanForSignaturePlaceholderAndReturnBounds(): SignatureBounds {
    const editorContentText = this.genericDashboardService.quillEditorContent().textContent;

    const signaturePlaceholderFormat = this.signaturePlaceholder().format;

    const beginIndexOfPlaceholder = editorContentText.indexOf(signaturePlaceholderFormat);

    if (beginIndexOfPlaceholder < 0) return { exists: false };

    return {
      exists: true,
      details: {
        begin: beginIndexOfPlaceholder,
        end: beginIndexOfPlaceholder + signaturePlaceholderFormat.length - 1,
      },
    };
  }
}

interface SignatureBounds {
  exists: boolean;
  details?: {
    begin: number;
    end: number;
  };
}
