import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SectorDto, SectorServiceProxy } from '@shared/service-proxies/application/sector-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditSectorComponent } from './create-edit-sector/create-edit-sector.component';

@Component({
    templateUrl: 'sector.component.html',
    styleUrls: [
        'sector.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class SectorComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalSector', { static: true }) createEditModalSector: CreateEditSectorComponent;

    filterText: string;
    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _sectorServiceProxy: SectorServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalSector.show();
    }

    editItem(sector: SectorDto) {
        this.createEditModalSector.show(sector.id);
    }

    deleteItem(sector: SectorDto) {
        this.message.confirm(`¿Esta seguro de eliminar el sector responsable ${sector.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._sectorServiceProxy.delete(sector.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Eliminado satisfactoriamente');
                });
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        setTimeout(() => {
            this.showMainSpinner('Cargando información. Por favor espere...');
        this.primengTableHelper.showLoadingIndicator();
        this._sectorServiceProxy
            .getAll(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
                setTimeout(() => this.hideMainSpinner(), 1000);
            });
        }, 500); 
    }
}