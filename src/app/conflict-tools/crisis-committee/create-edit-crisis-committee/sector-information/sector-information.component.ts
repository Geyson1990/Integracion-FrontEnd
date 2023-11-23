import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CrisisCommitteeDirectoryGovernmentRelationDto, CrisisCommitteeDto, CrisisCommitteeFocalPoint,  CrisisCommitteeSectorLocationDto } from '@shared/service-proxies/application/crisis-committee-proxie';
import { forEach, values } from 'lodash';
import { LazyLoadEvent, Paginator } from 'primeng';
import { of } from 'rxjs';

@Component({
    selector: 'sector-information-crisis-committee',
    templateUrl: 'sector-information.component.html',
    styleUrls: [
        'sector-information.component.css'
    ]
})
export class SectorInformationCrisisCommitteeComponent extends AppComponentBase implements OnInit {

    private _busy: boolean;
    private _crisisCommittee: CrisisCommitteeDto;

    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() get busy(): boolean {
        return this._busy;
    }

    set busy(value: boolean) {
        this._busy = value;
    }

    @Input() get crisisCommittee(): CrisisCommitteeDto {
        return this._crisisCommittee;
    }

    set crisisCommittee(value: CrisisCommitteeDto) {
        this._crisisCommittee = value;
    }

    @Output() addSector: EventEmitter<void> = new EventEmitter<void>();
    @Output() editSector: EventEmitter<{ index: number, value: CrisisCommitteeSectorLocationDto }> = new EventEmitter<{ index: number, value: CrisisCommitteeSectorLocationDto }>();
    id: number;
    editIdSector = undefined;

    private skipCount: number;
    private maxResultCount: number;

    sectorContac: CrisisCommitteeFocalPoint;
    constructor(_injector: Injector) {
        super(_injector);
        this.primengTableHelper.defaultRecordsCountPerPage = 5;
        this.skipCount = 0;
        this.maxResultCount = this.primengTableHelper.defaultRecordsCountPerPage;
    }

    ngOnInit(): void {      
        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    getData(event?: LazyLoadEvent) {
        this.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    removeItem(sector: CrisisCommitteeSectorLocationDto, index: number) {
        if (sector.id) {
            sector.remove = true;
            if(sector.sectorContacFocal){
            sector.sectorContacFocal.remove = true;
            }
            this.notify.warn('Se ha marcado para eliminar el sector identificado seleccionado');
        } else {
            this.crisisCommittee.sectors.splice(index, 1);
            this.formatPagination(this.skipCount, this.maxResultCount);
        }
    }

    cancelRemove(risk: CrisisCommitteeSectorLocationDto) {
        risk.remove = false;
        risk.sectorContacFocal.remove= false
        this.notify.success('Se deshizo el marcado de eliminar del sector identificado seleccionado');
    }

    addEvent() {
        this.addSector.emit();
    }

    editEvent(value: CrisisCommitteeSectorLocationDto, index: number ) {
        
        this.editIdSector = value?.directoryGovernment[0]?.id;
        this.editSector.emit({ index: index, value: value });
    }

    addOrUpdateItem(event: { value: CrisisCommitteeSectorLocationDto, index: number }) {

        let ValidaDatos : CrisisCommitteeDirectoryGovernmentRelationDto[] = [];
        for(const data of this.crisisCommittee.sectors) {
                for(const subdate of data.directoryGovernment) {
                    let datos : CrisisCommitteeDirectoryGovernmentRelationDto = new CrisisCommitteeDirectoryGovernmentRelationDto();           
                    datos.id = subdate.id,
                    ValidaDatos.push(datos);
                }
        }


            for (const value of ValidaDatos) {
                for (const data of event.value.directoryGovernment) {
                        if (value.id == data.id) {
                            this.message.error(`El sector identificado ${data.name} ya esta agregado`, 'Aviso');
                            return;
                    }
                }
            } 


        if (this.editIdSector != undefined) {
            if (event.value.directoryGovernment.length > 1) {
                for(const data of event.value.directoryGovernment) {
                    let datos : CrisisCommitteeSectorLocationDto = new CrisisCommitteeSectorLocationDto();
                    datos.directoryGovernment = [];
                    datos.directoryGovern = [];
                    let directory : CrisisCommitteeDirectoryGovernmentRelationDto = new CrisisCommitteeDirectoryGovernmentRelationDto();
    
                    directory.id = data.id,
                    directory.directoryGoverment = data.directoryGoverment
                    directory.directoryGovernmentSector = data.directoryGovernmentSector,
                    directory.name = data.name,
                    directory.phoneNumber = data.phoneNumber,
                    directory.additionalInformation = data.additionalInformation,
                    directory.address = data.address,
                    directory.alias = data.alias,
                    directory.shortName = data.shortName,
                    directory.url = data.url
    
                    datos.id = data.id,
                    datos.directoryGovernment.push(directory),
                    datos.directoryGovern.push(directory),
                    datos.isHidden = false,
                    datos.remove = false
                    this.crisisCommittee.sectors.push(datos);
                }    
                    
            } else {
                this.crisisCommittee.sectors[event.index] = event.value;
            }
        } else {
            for(const data of event.value.directoryGovernment) {
                let datos : CrisisCommitteeSectorLocationDto = new CrisisCommitteeSectorLocationDto();
                datos.directoryGovernment = [];
                datos.directoryGovern = [];
                let directory : CrisisCommitteeDirectoryGovernmentRelationDto = new CrisisCommitteeDirectoryGovernmentRelationDto();

                directory.id = data.id,
                directory.directoryGoverment = data.directoryGoverment
                directory.directoryGovernmentSector = data.directoryGovernmentSector,
                directory.name = data.name,
                directory.phoneNumber = data.phoneNumber,
                directory.additionalInformation = data.additionalInformation,
                directory.address = data.address,
                directory.alias = data.alias,
                directory.shortName = data.shortName,
                directory.url = data.url

                datos.id = data.id,
                datos.directoryGovernment.push(directory),
                datos.directoryGovern.push(directory),
                datos.isHidden = false,
                datos.remove = false
                this.crisisCommittee.sectors.push(datos);
            }    
        }

        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    private formatPagination(skipCount: number, maxResultCount: number) {
        this.relacionSctorContac()
        let index: number = 0;
        let result: number = 0;    
        for (let item of this.crisisCommittee.sectors) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }

    relacionSctorContac(){
        
        for (let i = 0; i < this._crisisCommittee.sectors.length; i++) {

            for (let Contac of this._crisisCommittee.sectorContacFocal) {
                if (Contac.index == i) {
                    this._crisisCommittee.sectors[i].sectorContacFocal = Contac;
                    break;
                } else {
                    this._crisisCommittee.sectors[i].sectorContacFocal = null;
                }
            }
        }
    }
}