import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CrisisCommitteeDirectoryGovernmentRelationDto, CrisisCommitteeDto, CrisisCommitteeFocalPoint, CrisisCommitteeSectorLocationDto } from '@shared/service-proxies/application/crisis-committee-proxie';
import { UtilityDirectoryGovernmentDto } from '@shared/service-proxies/application/utility-proxie';
import { FindDirectoryGovernmentComponent } from '@shared/component/find-directory-government/find-directory-government.component';

@Component({
    selector: 'create-edit-sector-information-crisis-committee',
    templateUrl: 'create-edit-sector-information.component.html',
    styleUrls: [
        'create-edit-sector-information.component.css'
    ]
})
export class CreateEditSectorInformationCrisisCommitteeComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('ViewSectorModal', { static: true }) ViewSectorModal: FindDirectoryGovernmentComponent;
    @Output() modalSave: EventEmitter<{ value: CrisisCommitteeSectorLocationDto, index: number }> = new EventEmitter<{ value: CrisisCommitteeSectorLocationDto, index: number }>();
    @Output() showFindDirectoryGovernment: EventEmitter<void> = new EventEmitter<void>();
    
    risks: CrisisCommitteeDto[];
    item: CrisisCommitteeSectorLocationDto = new CrisisCommitteeSectorLocationDto();
    
    riskTime: Date;
    rowIndex: number;

    active: boolean;
    saving: boolean;

    SectorContacName: string;
    SectorContacCargo: string;
    SectorContacEmail: string;
    SectorContacPhone: string;
    name = "";
    entity : CrisisCommitteeDirectoryGovernmentRelationDto  = new CrisisCommitteeDirectoryGovernmentRelationDto;
    entityArray : CrisisCommitteeDirectoryGovernmentRelationDto[];

    get activityDirectoryGovernmentText(): string {

        //return this.item.directoryGovernment ? this.item.directoryGovernment.name : 'Buscar Entidad del Estado Peruano...';
        this.name = "";
        //console.log(this.item, 'item_get');
            if (this.item.directoryGovernment != undefined) {
                for(const a of this.item.directoryGovernment) {
                    if (a.name != undefined) {
                        this.name = this.name + " " + a.name + "\n";
                    }
                }
            }
        return this.name;
    }

    constructor(_injector: Injector) {
        super(_injector);
    }

    show(rowIndex: number, item: CrisisCommitteeSectorLocationDto): void {
        this.rowIndex = rowIndex;
        this.saving = false;

        this.item = CrisisCommitteeSectorLocationDto.fromJS(item);
        
        
        if (this.item.sectorContacFocal) {
            
            this.SectorContacName = this.item.sectorContacFocal.name;
            this.SectorContacCargo = this.item.sectorContacFocal.cargo;
            this.SectorContacPhone = this.item.sectorContacFocal.phoneNumber;
            this.SectorContacEmail = this.item.sectorContacFocal.emailAddress;
        } else {
            
            this.SectorContacName = ""
            this.SectorContacCargo = "";
            this.SectorContacPhone = "";
            this.SectorContacEmail = "";
        }
        this.active = true;
        this.modal.show();
    }

    findDirectoryGovernmentEvent() {
        this.showFindDirectoryGovernment.emit();
    }

    addOrUpdateDirectoryGovernmentItem(event: UtilityDirectoryGovernmentDto[]) {
        if (this.item.directoryGovernment == undefined) {
            this.item.directoryGovernment = [];
        }
        this.entityArray = [];
        for (const a of event) {
            this.entity = new CrisisCommitteeDirectoryGovernmentRelationDto;
            this.entity.additionalInformation = a?.additionalInformation,
            this.entity.address = a?.address,
            this.entity.directoryGovernmentSector= a?.directoryGovernmentSector,
            this.entity.id = a?.id,
            this.entity.name = a?.name,
            this.entity.phoneNumber = a?.phoneNumber,
            this.entity.shortName = a?.shortName,
            this.entity.url = a?.url
            this.entityArray.push(this.entity);
            if (this.item.id == undefined) {
                this.item.directoryGovernment.push(this.entity);
            } else {
                this.item.directoryGovern = this.entityArray;
                this.item.directoryGovernment = this.entityArray;
            }
        }
    }

    removeDirectoryGovernment() {
        this.message.confirm('¿Esta seguro de eliminar la entidad del estado peruano?', 'Aviso', (confirmation) => {
            if (confirmation) {
                //this.item.directoryGovernment = undefined;
                this.item.directoryGovernment = [];
            }
        });
    }

    onShown(): void {
        document.getElementById('SectorDescription')?.focus();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        if (!this.item.directoryGovernment) {
            this.message.info('Debe seleccionar la entidad responsable antes de guardar los cambios', 'Aviso');
            return;
        }
        if (this.isNullEmptyOrWhiteSpace(this.SectorContacName)) {
            this.message.info('Debe ingresar los nombre y apellido antes de continuar');
            return;
        }
        if (this.isNullEmptyOrWhiteSpace(this.SectorContacCargo)) {
            this.message.info('Debe ingresar un cargo antes de continuar');
            return;
        }
        if (this.isNullEmptyOrWhiteSpace(this.SectorContacPhone)) {
            this.message.info('Debe ingresar un numero de contacto');
            return;
        }
        if (this.isNullEmptyOrWhiteSpace(this.SectorContacEmail)) {
            this.message.info('Debe ingresar un email');
            return;
        }
        if(this.item.sectorContacFocal){
            this.item.sectorContacFocal = new CrisisCommitteeFocalPoint({
                id: this.item.sectorContacFocal.id,
                name: this.SectorContacName,
                cargo: this.SectorContacCargo,
                phoneNumber: this.SectorContacPhone,
                emailAddress: this.SectorContacEmail,
                index: this.rowIndex,
                remove: false,
            });
        }else{
            this.item.sectorContacFocal = new CrisisCommitteeFocalPoint({
                id: -1,
                name: this.SectorContacName,
                cargo: this.SectorContacCargo,
                phoneNumber: this.SectorContacPhone,
                emailAddress: this.SectorContacEmail,
                index: this.rowIndex,
                remove: false,
            });
        }
        this.modalSave.emit({ index: this.rowIndex, value: this.item });
        this.close();
    }
}
