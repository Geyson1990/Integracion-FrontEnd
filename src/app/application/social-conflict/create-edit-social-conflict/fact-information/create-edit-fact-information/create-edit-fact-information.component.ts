import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictGeneralFactDto } from '@shared/service-proxies/application/social-conflict-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { TagsDto, tagsProxy } from '@shared/service-proxies/application/tags-proxie';

@Component({
    selector: 'create-edit-fact-information-social-conflict',
    templateUrl: 'create-edit-fact-information.component.html',
    styleUrls: [
        'create-edit-fact-information.component.css'
    ]
})
export class CreateEditFactInformationSocialConflictComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<{ value: SocialConflictGeneralFactDto, index: number }> = new EventEmitter<{ value: SocialConflictGeneralFactDto, index: number }>();

    rowIndex: number;
    item: SocialConflictGeneralFactDto = new SocialConflictGeneralFactDto();
    active: boolean;
    saving: boolean;
    factTime: Date;
    tags:TagsDto[];
    constructor(_injector: Injector , private _TagsService:tagsProxy) {
        super(_injector);
    }

    show(rowIndex: number, item: SocialConflictGeneralFactDto): void {
        this.rowIndex = rowIndex;
        this.saving = false;
        this.item = new SocialConflictGeneralFactDto(item);
        this.factTime = item?.factTime?.toDate();
        var insti = this.appSession.user.institutionId;
        this._TagsService.getAllForInstitution(insti).subscribe(result=>{
            this.tags = result.items;

            if (this.item?.tag && this.item.tag.id!= -1) {
                const managerIndex: number = this.tags.findIndex(p => p.id == this.item.tag.id);
                if (managerIndex == -1) {
                    this.tags.push(TagsDto.fromJS(this.item.tag));
                    
                    this.tags= this.tags.sort((a, b) => a.name.localeCompare(b.name));
                }
            }
            this.active = true;
            this.modal.show();
        })
        
    }

    onShown(): void {
        document.getElementById('FactDescription').focus();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        if (this.isNullEmptyOrWhiteSpace(this.item.description)) {
            this.message.error('Debe ingresar la descripción del hecho antes de agregarlo a la lista', 'Aviso');
            return;
        }
        if (!this.factTime || (<any>this.factTime == 'Invalid Date')) {
            this.message.error('Debe seleccionar la fecha del hecho antes de agregarlo a la lista', 'Aviso');
            return;
        }
        this.item.factTime = moment(this.formatDateISOString(this.factTime));
        this.modalSave.emit({ index: this.rowIndex, value: this.item });
        this.close();
    }
    onTagsChange(event: any) {

        const tagId: number = +event.target.value;
        const index: number = this.tags.findIndex(p => p.id == tagId);
        
        if (index != -1) {
            this.item.tag.name = this.tags[index].name;
        } else {
            this.item.tag.id = -1;
            this.item.tag.name = undefined;
        }
    }
}
