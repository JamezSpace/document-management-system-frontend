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
  WritableSignal,
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
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { MemoBodyEditor } from '../../../../../components/editors/memo-body-editor/memo-body-editor';
import { MemoTemplate } from '../../../../../components/editors/templates/memo-template/memo-template';
import { LineLoader } from '../../../../../components/system-wide/loaders/line-loader/line-loader';
import { SpartanMuted } from '../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { GenericDashboardService } from '../../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { WorkspaceService } from '../../../../../services/page-wide/dashboard/workspace/workspace-service';
import { UtilService } from '../../../../../services/system-wide/util-service/util-service';
import { OrgUnitCategory } from '../../../../../enum/identity/unitCategory.enum';
import { DocumentsService } from '../../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { DocumentTypesService } from '../../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { ActivatedRoute } from '@angular/router';
import { DocumentApi } from '../../../../../interfaces/documents/Document.api';

@Component({
  selector: 'nexus-workspace',
  imports: [
    NgIcon,
    SpartanMuted,
    SpartanP,
    LineLoader,
    MemoTemplate,
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
      lucideZoomIn,
      lucideZoomOut,
    }),
  ],
})
export class Workspace implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  location = inject(Location);
  workspaceLoading = signal<boolean>(false);
  workspaceService = inject(WorkspaceService);
  genericDashboardService = inject(GenericDashboardService);
  utilService = inject(UtilService);
  private documentService = inject(DocumentsService);
  private docTypesService = inject(DocumentTypesService);

  sidebarClosed = signal<boolean>(false);
  isDocmentMetadataEditable = signal<boolean>(false);

  goToPreviousLocation() {
    this.location.back();
  }

  ngOnInit(): void {
    // this.workspaceService.getSignaturePlaceholder();

    // user refreshes a stale page
    const isThereAJustInitializedDocument = this.documentService.document();

    if (!isThereAJustInitializedDocument) {
      // get docId from param
      const segments = this.activatedRoute.snapshot.url;
      const docId = segments[segments.length - 1].path;

      this.documentService.fetchDocById(docId);
      return;
    }

    const typeId = this.documentService.document()!.classification.documentTypeId;

    this.docTypesService.fetchDocTypeById(typeId);
    this.document = this.documentService.document;
  }

  private workspaceInitEffect = effect(() => {
    // auto-close sidebar
    if (this.isMobile()) this.sidebarClosed.set(true);
    else this.sidebarClosed.set(false);

    // fetch document
    const documentFetchedById = this.documentService.document();

    if (!documentFetchedById) return;

    // fetch document type
    const typeId = this.documentService.document()!.classification.documentTypeId;

    this.docTypesService.fetchDocTypeById(typeId);
    this.document = this.documentService.document;
  });

  isMobile = this.utilService.isMobile;
  documentType = this.docTypesService.docType;
  document!: WritableSignal<DocumentApi | null>;

  memoDocument = computed(() => {
    const doc = this.document();
    
    return this.documentType()?.code === 'memo' && doc ? doc : null;
  });

  departments = this.genericDashboardService.departments;
  academicDepartments = computed(() =>
    this.departments().filter((dept) => dept.category === OrgUnitCategory.ACADEMIC),
  );
  nonAcademicDepartments = computed(() =>
    this.departments().filter((dept) => dept.category === OrgUnitCategory.NON_ACADEMIC),
  );

  //   correspondenceVolumes = this.genericDashboardService.correspondenceVolumes;

  fileUploaded = signal<File | null>(null);
  onUploadAttachment(event: any) {
    this.workspaceLoading.set(true);
    const uploadedFile = event.target.files[0];

    // perform check and scan on this document

    // update component with file uploaded
    this.fileUploaded.set(uploadedFile);
    this.workspaceLoading.set(false);
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
  //   filteredVolumes = computed(() => {
  //     const filterValue = this.searchVolValue().toLowerCase();

  //     return this.correspondenceVolumes().filter((vol) =>
  //       vol.name.toLowerCase().includes(filterValue),
  //     );
  //   });

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
    // store previous zoom level
    this.previousZoomLevel.set(this.zoomLevel());

    //reset zoom level
    this.resetZoom();

    // retrieve content as html
    const htmlContent = this.retrieveEditorContentsAsSpecificType('html') as string;

    this.editorHtmlContent.set(htmlContent);

    // checks if signature exists
    const signatureExists = this.signaturePlaceholderBounds().exists;

    this.isPrintPreview.set(true);
  }

  exitPreview() {
    // set current zoom level to the previous value
    this.zoomLevel.set(this.previousZoomLevel());

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

  signaturePlaceholder = this.workspaceService.signaturePlaceholder;
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

  // 1.0 is 100%, 0.5 is 50%, etc.
  zoomLevel = signal<number>(1.0);
  previousZoomLevel = signal<number>(1);

  // Compute the transform string for the template
  canvasTransform = computed(() => `scale(${this.zoomLevel()})`);

  zoomIn() {
    this.zoomLevel.update((z) => Math.min(z + 0.1, 2.0)); // Cap at 200%
  }

  zoomOut() {
    this.zoomLevel.update((z) => Math.max(z - 0.1, 0.5)); // Floor at 50%
  }

  resetZoom() {
    this.zoomLevel.set(1.0);
  }

  saveDocument() {
    const openedDocument = this.document()!
    const contentAsDelta = this.retrieveEditorContentsAsSpecificType('delta')

    this.documentService.saveDocument(
        openedDocument.id,
        {
            document: openedDocument,
            contentDelta: contentAsDelta
        }
    )
  }
}

interface SignatureBounds {
  exists: boolean;
  details?: {
    begin: number;
    end: number;
  };
}
