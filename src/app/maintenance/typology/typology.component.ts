import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SubTypologyDto, SubTypologyServiceProxy } from '@shared/service-proxies/application/sub-typology-proxie';
import { TypologyDto, TypologyServiceProxy } from '@shared/service-proxies/application/typology-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditSubTypologyComponent } from './create-edit-sub-typology/create-edit-sub-typology.component';
import { CreateEditTypologyComponent } from './create-edit-typology/create-edit-typology.component';

@Component({
    templateUrl: 'typology.component.html',
    styleUrls: [
        'typology.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class TypologyComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalTypology', { static: true }) createEditModalTypology: CreateEditTypologyComponent;
    @ViewChild('createEditModalSubTypology', { static: true }) createEditModalSubTypology: CreateEditSubTypologyComponent;

    filterText: string;
    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _typologyServiceProxy: TypologyServiceProxy, private _subTypologyServiceProxy: SubTypologyServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalTypology.show();
    }

    editItem(typology: TypologyDto) {
        this.createEditModalTypology.show(typology.id);
    }

    deleteItem(typology: TypologyDto) {
        this.message.confirm(`¿Esta seguro de eliminar la tipología general ${typology.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._typologyServiceProxy.delete(typology.id).subscribe(() => {
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
        this._typologyServiceProxy
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

    createSubItem(typology: TypologyDto) {
        this.createEditModalSubTypology.show(typology);
    }

    editSubItem(typology: TypologyDto, subTypology: SubTypologyDto) {
        this.createEditModalSubTypology.show(typology, subTypology.id);
    }

    deleteSubItem(subTypology: SubTypologyDto) {
        this.message.confirm(`¿Esta seguro de eliminar la tipología detallada ${subTypology.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed) {
                this._subTypologyServiceProxy.delete(subTypology.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Eliminado satisfactoriamente');
                });
            }
        });
    }
}