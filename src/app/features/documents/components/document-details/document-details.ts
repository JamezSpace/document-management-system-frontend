import { Component, computed, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideX } from '@ng-icons/lucide';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { SideModalService } from '../../../../core/services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { DocumentApi } from '../../../../models/api/documents/Document.api';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { BusinessFunctionService } from '../../service/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../service/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../../service/document-types/document-types-service';
import { MinutesService } from '../../service/minutes/minutes-service';
import { RegistryService } from '../../service/registry/registry-service';
import { UnitMembersService } from '../../service/unit-members/unit-members-service';
import { OrganizationService } from '../../../shared/services/organization/organization-service';


@Component({
  selector: 'nexus-document-details',
  imports: [MatTabsModule, NgIcon, HlmSpinnerImports],
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
    organizationService = inject(OrganizationService);
    unitMembersService = inject(UnitMembersService);
    minutesService = inject(MinutesService);
    documentToShowFullDetails = input.required<DocumentApi>();

    minuteServiceInOperation = this.minutesService.loading;
    minutes = this.minutesService.minutes;

    ngOnInit() {
        const documentId = this.documentToShowFullDetails().id;

        // fetch deps
        this.minutesService.fetchMinutesForCorrespondence(documentId);
    }

    recipientUnit = computed(() => {
        const recipientUnitId = this.documentToShowFullDetails().correspondence.recipientUnitId;

        if(!recipientUnitId) return;

        return this.organizationService.units().find(unit => unit.id === recipientUnitId)
    })

    businessFuntion = computed(() => {
        const bussFunctionId = this.documentToShowFullDetails().classification.functionCodeId;

        return this.bussFunctionService.bussFunctions().find(bussFunction => bussFunction.id === bussFunctionId)
    })

    corrSubject = computed(() => {
        const subjectId = this.documentToShowFullDetails().correspondence.subjectCodeId;

        return this.corrSubjectService.corrSubjects().find(corrSubject => corrSubject.id === subjectId)
    })

    docType = computed(() => {
        const typeId = this.documentToShowFullDetails().classification.documentTypeId;

        return this.docTypesService.allDocTypes().find(docType => docType.id === typeId)
    })

    addressedTo = computed(() => {
        console.log(this.documentToShowFullDetails());
        
        const recipients = this.documentToShowFullDetails().addressees;

        let addressees = recipients.map(addr => {            
            return this.unitMembersService.data().find(member => member.designation.id === addr.addressedToDesignationId)?.designation.title;
        })

        console.log(addressees);
        
        return addressees;
    })

    closeDocPane() {
        this.sideModalService.close()

        this.registryService.closeDocDetails()
    }

    resolveStaffDesignationTitle(staffId: string) {
        this.unitMembersService.data().find(member => member.id === staffId)?.designation.title;
    }
}
