import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertResponsibleDto, AlertResponsibleServiceProxy } from '@shared/service-proxies/application/alert-responsible-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditAlertResponsibleComponent } from './create-edit-alert-responsible/create-edit-alert-responsible.component';

@Component({
    templateUrl: 'alert-responsible.component.html',
    styleUrls: [
        'alert-responsible.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class AlertResponsibleComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalAlertResponsible', { static: true }) createEditModalAlertResponsible: CreateEditAlertResponsibleComponent;

    filterText: string;
    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _alertresponsibleServiceProxy: AlertResponsibleServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalAlertResponsible.show();
    }

    editItem(alertResponsible: AlertResponsibleDto) {
        this.createEditModalAlertResponsible.show(alertResponsible.id);
    }

    deleteItem(alertResponsible: AlertResponsibleDto) {
        this.message.confirm(`¿Esta seguro de eliminar la subsecretaría responsable ${alertResponsible.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._alertresponsibleServiceProxy.delete(alertResponsible.id).subscribe(() => {
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
        this._alertresponsibleServiceProxy
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