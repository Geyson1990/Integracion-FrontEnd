import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertSectorDto, AlertSectorServiceProxy } from '@shared/service-proxies/application/alert-sector-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditAlertSectorComponent } from './create-edit-alert-sector/create-edit-alert-sector.component';

@Component({
    templateUrl: 'alert-sector.component.html',
    styleUrls: [
        'alert-sector.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class AlertSectorComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalAlertSector', { static: true }) createEditModalAlertSector: CreateEditAlertSectorComponent;

    filterText: string;

    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _alertsectorServiceProxy: AlertSectorServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalAlertSector.show();
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        setTimeout(() => {
            this.showMainSpinner('Cargando información. Por favor espere...');
        this.primengTableHelper.showLoadingIndicator();
        this._alertsectorServiceProxy
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

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
    
    editItem(alertSector: AlertSectorDto) {
        this.createEditModalAlertSector.show(alertSector.id);
    }

    deleteItem(alertSector: AlertSectorDto) {
        this.message.confirm(`¿Esta seguro de eliminar el sector ${alertSector.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._alertsectorServiceProxy.delete(alertSector.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Eliminado satisfactoriamente');
                });
        });
    }
}