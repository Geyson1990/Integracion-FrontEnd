import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SectorRoleDto } from '@shared/service-proxies/application/sector-role-proxie';
import { SectorRoleServiceProxy } from '@shared/service-proxies/application/sector-role-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditSectorRoleComponent } from './create-edit-sector-role/create-edit-sector-role.component';

@Component({
    templateUrl: 'sector-role.component.html',
    styleUrls: [
        'sector-role.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class SectorRoleComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalSectorRole', { static: true }) createEditModalSectorRole: CreateEditSectorRoleComponent;

    filterText: string;

    constructor(_injector: Injector, private _sectorServiceRoleProxy: SectorRoleServiceProxy) {
        super(_injector);
    }

    createItem() {
        this.createEditModalSectorRole.show();
    }

    editItem(sector: SectorRoleDto) {
        this.createEditModalSectorRole.show(sector.id);
    }

    deleteItem(sector: SectorRoleDto) {
        this.message.confirm(`¿Esta seguro de eliminar el sector responsable ${sector.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._sectorServiceRoleProxy.delete(sector.id).subscribe(() => {
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
        this.primengTableHelper.showLoadingIndicator();
        this._sectorServiceRoleProxy
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
            });
    }
}