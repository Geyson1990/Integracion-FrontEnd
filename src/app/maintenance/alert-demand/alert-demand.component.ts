import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertDemandDto, AlertDemandServiceProxy } from '@shared/service-proxies/application/alert-demand-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditAlertDemandComponent } from './create-edit-alert-demand/create-edit-alert-demand.component';

@Component({
    templateUrl: 'alert-demand.component.html',
    styleUrls: [
        'alert-demand.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class AlertDemandComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalAlertDemand', { static: true }) createEditModalAlertDemand: CreateEditAlertDemandComponent;

    filterText: string;

    _verificationEnabled:boolean;

    constructor(_injector: Injector, private _alertdemandServiceProxy: AlertDemandServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalAlertDemand.show();
    }

    editItem(alertdemand: AlertDemandDto) {
        this.createEditModalAlertDemand.show(alertdemand.id);
    }

    deleteItem(alertdemand: AlertDemandDto) {
        this.message.confirm(`¿Esta seguro de eliminar el tipo de demanda ${alertdemand.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._alertdemandServiceProxy.delete(alertdemand.id).subscribe(() => {
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
        this._alertdemandServiceProxy
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