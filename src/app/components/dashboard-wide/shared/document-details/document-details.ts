import { Component, computed, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideX } from '@ng-icons/lucide';
import { DocumentApi } from '../../../../interfaces/api/documents/Document.api';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { OrgUnitsService } from '../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { RegistryService } from '../../../../services/page-wide/dashboard/documents-registry/registry/registry-service';
import { UnitMembersService } from '../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { SpartanLarge } from "../../../system-wide/typography/spartan-large/spartan-large";
import { SpartanMuted } from "../../../system-wide/typography/spartan-muted/spartan-muted";
import { MinutesService } from '../../../../services/page-wide/dashboard/documents-registry/minutes/minutes-service';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';


@Component({
  selector: 'nexus-document-details',
  imports: [MatTabsModule, SpartanLarge, NgIcon, SpartanMuted, HlmSpinnerImports],
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
    unitService = inject(OrgUnitsService);
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

        return this.unitService.units().find(unit => unit.id === recipientUnitId)
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
