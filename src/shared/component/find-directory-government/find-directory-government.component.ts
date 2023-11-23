import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UtilityDepartmentDataDto, UtilityDirectoryGovernmentDto, UtilityDirectoryGovernmentSectorDto, UtilityDistrictDataDto, UtilityProvinceDataDto, UtilityServiceProxy } from '@shared/service-proxies/application/utility-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'find-directory-government',
    templateUrl: 'find-directory-government.component.html',
    styleUrls: [
        'find-directory-government.component.css'
    ]
})
export class FindDirectoryGovernmentComponent extends AppComponentBase {

    @ViewChild('findDataTable', { static: false }) dataTable: Table;
    @ViewChild('findPaginator', { static: false }) paginator: Paginator;

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<UtilityDirectoryGovernmentDto[]> = new EventEmitter<UtilityDirectoryGovernmentDto[]>();

    viewTypeState: boolean = false;
 
    active: boolean = false;

    advancedFiltersAreShown: boolean = false;

    name: string;
    shortName: string;

    departments: UtilityDepartmentDataDto[];

    selectedDepartments: UtilityDepartmentDataDto[];
    departmentId: number = -1;

    selectedProvinces: UtilityProvinceDataDto[];
    provinceId: number = -1;

    selectedDistricts: UtilityDistrictDataDto[];
    districtId: number = -1;

    sectorId: number = -1;
    sectors: UtilityDirectoryGovernmentSectorDto[];

    skippedDirectoryGovernmentsIds: number[];
    entity : UtilityDirectoryGovernmentDto  = new UtilityDirectoryGovernmentDto;
    selectCheckConflict : UtilityDirectoryGovernmentDto[] = [];
    selectConflict : UtilityDirectoryGovernmentDto[] = [];

    constructor(_injector: Injector, private _utilityServiceProxy: UtilityServiceProxy) {
        super(_injector);
        
    }
    show(skippedDirectoryGovernmentsIds?: number[], value?:boolean): void {
        this.selectCheckConflict = [];
        this.showMainSpinner('Cargando información, por favor espere...');
        this.skippedDirectoryGovernmentsIds = skippedDirectoryGovernmentsIds;
        this._utilityServiceProxy
            .getAllDirectoryGovermentFilters()
            .pipe(finalize(() => setTimeout(() => this.hideMainSpinner(), 1000)))
            .subscribe(response => {
                this.departments = response.departments;
                this.selectedDepartments = response.departments;
                this.sectors = response.sectors;
                this.active = true;
                this.modal.show();
            });
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._utilityServiceProxy.getAllDirectoryGoverments(
            this.advancedFiltersAreShown ? this.name : <any>undefined,
            this.advancedFiltersAreShown ? this.shortName : <any>undefined,
            this.advancedFiltersAreShown ? this.departmentId : <any>undefined,
            this.advancedFiltersAreShown ? this.provinceId : <any>undefined,
            this.advancedFiltersAreShown ? this.districtId : <any>undefined,
            this.advancedFiltersAreShown ? this.sectorId : <any>undefined,
            this.skippedDirectoryGovernmentsIds,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    onShown(): void {

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
    check() {
        this.selectConflict = [];
        if (this.selectCheckConflict.length == 0 || this.selectCheckConflict == undefined) {
            this.message.error(`Seleccione un elemento`, 'Aviso');
            return;
        }

        for(const a of this.selectCheckConflict) {
            this.entity = new UtilityDirectoryGovernmentDto;
            this.entity.additionalInformation = a?.additionalInformation,
            this.entity.address = a?.address,
            this.entity.directoryGovernmentSector= a?.directoryGovernmentSector,
            this.entity.district = a?.district,
            this.entity.enabled=a?.enabled,
            this.entity.id = a?.id,
            this.entity.name = a?.name,
            this.entity.phoneNumber = a?.phoneNumber,
            this.entity.shortName = a?.shortName,
            this.entity.url = a?.url
            this.selectConflict.push(this.entity);
        }

        this.modalSave.emit(this.selectConflict);
        this.active = false;
        this.modal.hide();
    }
    changeStatus(Checked, directoryGovernmentDto: UtilityDirectoryGovernmentDto) {
        if (Checked.checked == true) {
            this.selectCheckConflict.push(directoryGovernmentDto);
        } else {
            console.log(Checked, directoryGovernmentDto);
            console.log(this.selectCheckConflict);
            for (let a of this.selectCheckConflict) {
                if (a.id == directoryGovernmentDto.id) {
                    this.selectCheckConflict.splice(this.selectCheckConflict.indexOf(a), 1);
                }
            }
        }
    }
    selectSocialConflict(directoryGovernmentDto: UtilityDirectoryGovernmentDto) {        
        this.selectConflict = [];
        this.selectConflict.push(directoryGovernmentDto);
        console.log(this.selectConflict);
        this.modalSave.emit(this.selectConflict);
        this.close();
    }

    onDepartmentChange(event: any) {
        const departmentId: number = +event.target.value;
        const index: number = this.selectedDepartments.findIndex(p => p.id == departmentId);
        this.provinceId = -1;
        this.districtId = -1;
        this.selectedProvinces = [];
        this.selectedDistricts = [];

        if (index != -1)
            this.selectedProvinces = this.selectedDepartments[index].provinces;
    }

    onProvinceChange(event: any) {
        const provinceId: number = +event.target.value;
        const index: number = this.selectedProvinces.findIndex(p => p.id == provinceId);
        this.selectedDistricts = [];
        this.districtId = -1;
        this.selectedDistricts = this.selectedProvinces[index].districts;
    }

    resetFilters() {
        this.name = '';
        this.shortName = '';
        this.departmentId = -1;
        this.provinceId = -1;
        this.districtId = -1;
        this.sectorId = -1;
    }
}
