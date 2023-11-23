import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictActorLocationDto, SocialConflictActorMovementDto, SocialConflictActorTypeDto } from '@shared/service-proxies/application/social-conflict-proxie';
import { userReniecSunatProxy } from '@shared/service-proxies/application/user-reniec-sunar-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ListTagsDto, TagsDto, tagsProxy } from '@shared/service-proxies/application/tags-proxie';
import { result } from 'lodash';

@Component({
    selector: 'edit-actor-information-social-conflict',
    templateUrl: 'edit-actor-information.component.html',
    styleUrls: [
        'edit-actor-information.component.css'
    ]
})
export class EditActorInformationSocialConflictComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<{ index: number, value: SocialConflictActorLocationDto }> = new EventEmitter<{ index: number, value: SocialConflictActorLocationDto }>();

    rowIndex: number;
    item: SocialConflictActorLocationDto = new SocialConflictActorLocationDto();
    actorTypes: SocialConflictActorTypeDto[];
    actorMovements: SocialConflictActorMovementDto[];
    politic: string = 'false';
    active: boolean;
    saving: boolean;
    RucDocument: string;
    tags:TagsDto[];
    constructor(_injector: Injector,private _userInformation : userReniecSunatProxy, private _TagsService: tagsProxy ) {
        super(_injector);
    }

    show(rowIndex: number, item: SocialConflictActorLocationDto, actorTypes: SocialConflictActorTypeDto[], actorMovements: SocialConflictActorMovementDto[]): void {
        this.rowIndex = rowIndex;
        this.item = new SocialConflictActorLocationDto(item);
        this.politic = item && item.isPoliticalAssociation ? 'true' : 'false';
        this.actorTypes = Object.assign([], actorTypes);
        this.actorMovements = Object.assign([], actorMovements);

        if (this.item?.actorType && this.item.actorType.id != -1) {
            const managementIndex: number = this.actorTypes.findIndex(p => p.id == this.item.actorType.id);

            if (managementIndex == -1) {
                this.actorTypes.push(SocialConflictActorTypeDto.fromJS(this.item.actorType));
                this.actorTypes = this.actorTypes.sort((a, b) => a.name.localeCompare(b.name));
            }
        }

        if (this.item?.actorMovement && this.item.actorMovement.id != -1) {
            const managerIndex: number = this.actorMovements.findIndex(p => p.id == this.item.actorMovement.id);

            if (managerIndex == -1) {
                this.actorMovements.push(SocialConflictActorMovementDto.fromJS(this.item.actorMovement));
                this.actorMovements = this.actorMovements.sort((a, b) => a.name.localeCompare(b.name));
            }
        }
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

    onActorTypeChange(event: any) {
        const actorTypeId: number = +event.target.value;
        const index: number = this.actorTypes.findIndex(p => p.id == actorTypeId);

        if (index != -1) {
            this.item.actorType.name = this.actorTypes[index].name;
            this.item.actorType.showDetail = this.actorTypes[index].showDetail;
            this.item.actorType.showMovement = this.actorTypes[index].showMovement;
        } else {
            this.item.actorType.id = -1;
            this.item.actorType.name = undefined;
            this.item.actorType.showDetail = false;
        }
    }

    onActorMovementChange(event: any) {
        const actorMovementId: number = +event.target.value;
        const index: number = this.actorMovements.findIndex(p => p.id == actorMovementId);

        if (index != -1) {
            this.item.actorMovement.name = this.actorMovements[index].name;
        } else {
            this.item.actorMovement.id = -1;
            this.item.actorMovement.name = undefined;
        }
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

    onShown(): void {
        document.getElementById('ActorName').focus();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        if (this.isNullEmptyOrWhiteSpace(this.item.name)) {
            this.message.info('Debe ingresar el nombre y apellido del actor antes de continuar');
            return;
        }
        if (this.item.actorType.id == -1) {
            this.message.info('Debe seleccionar el tipo de actor antes de continuar');
            return;
        }
        if (this.item.actorType.showMovement && this.item.actorMovement.id == -1) {
            this.message.info('Debe seleccionar la capacidad de movilización del actor antes de continuar');
            return;
        }
        if (this.isNullEmptyOrWhiteSpace(this.item.community)) {
            this.message.info('Debe ingresar la institución del actor antes de continuar');
            return;
        }
        if (!this.isNullEmptyOrWhiteSpace(this.item.document) && this.item.document.length != 8) {
            this.message.info('El DNI debe tener 8 caracteres');
            return;
        }

        this.item.name = this.item.name ? this.item.name.toUpperCase() : <any>undefined;
        this.item.isPoliticalAssociation = this.politic == 'true';
        this.modalSave.emit({ index: this.rowIndex, value: this.item });
        this.close();
    }

    GetDNIDocument() {
        if(!this.item.document){
            this.message.info('Debe debe ingresar el numero de documento');
            return
        }
        if(this.item.document.length < 8 ){
            this.message.info('Debe debe ingresar un numero correcto de documento');
            return
        }
        
        
        this._userInformation.getDNIDcoument(this.item.document).subscribe(data => {
            
            
            this.item.name = data.paterno+ " " + data.materno+ " " + data.nombres;
        })
    }

    GetRUCDocument() {
        if(!this.RucDocument){
            this.message.info('Debe debe ingresar el numero de documento');
            return
        }
        if(this.RucDocument.length < 11 ){
            this.message.info('Debe debe ingresar un numero correcto de documento');
            return
        }
        
        this._userInformation.getRucDocument(this.RucDocument).subscribe(data => {
            
            
            this.item.name = data.razonSocial;
        })
    }
}
