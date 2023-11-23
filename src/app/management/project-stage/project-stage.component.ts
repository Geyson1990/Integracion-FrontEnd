import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProjectStageDto, ProjectStageServiceProxy } from '@shared/service-proxies/application/project-stage-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: 'project-stage.component.html',
    styleUrls: [
        'project-stage.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class ProjectStageComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    filterText: string;
    _verificationEnabled : boolean;
    constructor(_injector: Injector, private _projectStageServiceProxy: ProjectStageServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    ngOnInit() { }

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
        this._projectStageServiceProxy
            .getAll(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.appSession.user.institutionId)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
                setTimeout(() => this.hideMainSpinner(), 1000);
            });
        }, 500);  
    }

    createItem() {
        this.router.navigate(['/app/management/project-stage/create']);
    }

    editItem(item: ProjectStageDto) {
        this.router.navigate(['/app/management/project-stage/edit', `${item.id}`]);
    }

    deleteItem(item: ProjectStageDto) {
        this.message.confirm(`¿Esta seguro de eliminar la etapa de proyecto ${item.name}, el proceso es irreversible?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._projectStageServiceProxy.delete(item.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Etapa de proyecto eliminada satisfactoriamente');
                });
        });
    }

    enableItem(item: ProjectStageDto) {
        this.message.confirm(`¿Esta seguro de habilitar la etapa de proyecto ${item.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed) {
                this._projectStageServiceProxy.enable(item.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success('Etapa de proyecto habilitada satisfactoriamente');
                });
            }
        });
    }

    disableItem(item: ProjectStageDto) {
        this.message.confirm(`¿Esta seguro de inabilitar la etapa de proyecto ${item.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed) {
                this.showMainSpinner('Procesando informaciíon, por favor espere...');
                this._projectStageServiceProxy.disable(item.id).pipe(finalize(() => setTimeout(() => this.hideMainSpinner(), 1000))).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Etapa de proyecto inhabilitada satisfactoriamente');
                });
            }
        });
    }

}