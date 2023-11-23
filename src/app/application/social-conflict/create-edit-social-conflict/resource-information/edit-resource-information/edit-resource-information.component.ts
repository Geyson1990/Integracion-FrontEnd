import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictManagementDto, SocialConflictManagementLocationDto, SocialConflictPersonDto, SocialConflictResourceDto } from '@shared/service-proxies/application/social-conflict-proxie';
import { AttachmentUploadDto } from '@shared/service-proxies/application/utility-proxie';
import { PersonType } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'edit-resource-information-social-conflict',
    templateUrl: 'edit-resource-information.component.html',
    styleUrls: [
        'edit-resource-information.component.css'
    ]
})
export class EditResourceInformationSocialConflictComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<{ value: SocialConflictResourceDto, index: number }> = new EventEmitter<{ value: SocialConflictResourceDto, index: number }>();

   

    item: SocialConflictResourceDto = new SocialConflictResourceDto();
    managementTime: Date;
    active: boolean;
    saving: boolean;
    rowIndex: number;

    ngOnInit() {
        this.item.newName = this.item.name;
    }

 
    constructor(_injector: Injector) {
        super(_injector);
    }

    show(rowIndex: number, item: SocialConflictResourceDto): void {
        this.item = item;
        this.item.newName = this.item.name;
        this.item.updatePath = false;
        this.saving = false;
        this.active = true;
        this.modal.show();
    }



    onShown(): void {

    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

 

    save(): void {
        this.modalSave.emit({ index: this.rowIndex, value: this.item });
        this.close();
    }

    removeResource(resource: SocialConflictResourceDto, index: number) {
        resource.remove = true;
    }

    restoreResource(resource: SocialConflictResourceDto) {
        resource.remove = false;
    }
}
