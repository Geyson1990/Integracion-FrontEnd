import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProjectRiskDto, ProjectRiskServiceProxy } from '@shared/service-proxies/application/project-risk-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: 'project-risk.component.html',
    styleUrls: [
        'project-risk.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class ProjectRiskComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    filterText: string;
    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _projectRiskServiceProxy: ProjectRiskServiceProxy) {
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
        this._projectRiskServiceProxy
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
        this.router.navigate(['/app/management/project-risk/create']);
    }
    reportRiskProject() {
        this.router.navigate(['/app/management/project-risk/report-risk-project']);
    }

    editItem(item: ProjectRiskDto) {
        this.router.navigate(['/app/management/project-risk/edit', `${item.id}`]);
    }

    deleteItem(item: ProjectRiskDto) {
        this.message.confirm(`¿Esta seguro de eliminar el proyecto ${item.name}, el proceso es irreversible?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._projectRiskServiceProxy.delete(item.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Etapa de proyecto eliminada satisfactoriamente');
                });
        });
    }
}