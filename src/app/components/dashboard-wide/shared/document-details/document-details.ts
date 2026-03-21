import { Component, computed, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DocumentApi } from '../../../../interfaces/documents/Document.api';
import { SpartanLarge } from "../../../system-wide/typography/spartan-large/spartan-large";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideX } from '@ng-icons/lucide';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { SpartanP } from "../../../system-wide/typography/spartan-p/spartan-p";
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { RegistryService } from '../../../../services/page-wide/dashboard/documents-registry/registry/registry-service';
import { DocumentTypesService } from '../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { UnitMembersService } from '../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';


@Component({
  selector: 'nexus-document-details',
  imports: [MatTabsModule, SpartanLarge, NgIcon],
  templateUrl: './document-details.html',
  styleUrl: './document-details.css',
  providers: [
    provideIcons({lucideX})
  ]
})
export class DocumentDetails {
    registryService = inject(RegistryService)
    sideModalService = inject(SideModalService);
    utilService = inject(UtilService);
    bussFunctionService = inject(BusinessFunctionService);
    corrSubjectService = inject(CorrespondenceSubjectService);
    docTypesService = inject(DocumentTypesService)
    unitMembersService = inject(UnitMembersService);
    documentToShowFullDetails = input.required<DocumentApi>();

    businessFuntion = computed(() => {
        const bussFunctionId = this.documentToShowFullDetails().classification.functionCodeId;

        return this.bussFunctionService.bussFunctions().find(bussFunction => bussFunction.id === bussFunctionId)
    })

    corrService = computed(() => {
        const subjectId = this.documentToShowFullDetails().correspondence.subjectCodeId;

        return this.corrSubjectService.corrSubjects().find(corrSubject => corrSubject.id === subjectId)
    })

    docType = computed(() => {
        const typeId = this.documentToShowFullDetails().classification.documentTypeId;

        return this.docTypesService.allDocTypes().find(docType => docType.id === typeId)
    })

    addressedTo = computed(() => {
        const recipientId = this.documentToShowFullDetails().correspondence.recipientCode;

        return recipientId;
    })

    closeDocPane() {
        this.sideModalService.close()

        this.registryService.closeDocDetails()
    }
}
