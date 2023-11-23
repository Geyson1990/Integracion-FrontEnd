import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MilestoneServiceProxy } from '@shared/service-proxies/application/milestone-proxie';
import { PhaseDto, PhaseMilestoneDto, PhaseServiceProxy } from '@shared/service-proxies/application/phase-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditMilestoneModalComponent } from './create-edit-milestone/create-edit-milestone.component';
import { CreateEditPhaseModalComponent } from './create-edit-phase/create-edit-phase.component';

@Component({
    templateUrl: 'phase.component.html',
    styleUrls: [
        'phase.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class PhaseComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalPhase', { static: true }) createEditModalPhase: CreateEditPhaseModalComponent;
    @ViewChild('createEditModalMilestone', { static: true }) createEditModalMilestone: CreateEditMilestoneModalComponent;

    filterText: string;
    _verificationEnabled :boolean;
    constructor(
        _injector: Injector,
        private _phaseServiceProxy: PhaseServiceProxy,
        private _milestoneServiceProxy: MilestoneServiceProxy) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalPhase.show();
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        setTimeout(() => {
            this.showMainSpinner('Cargando información. Por favor espere...');
        this.primengTableHelper.showLoadingIndicator();
        this._phaseServiceProxy
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

    editItem(phase: PhaseDto) {
        this.createEditModalPhase.show(phase.id);
    }

    createSubItem(phase: PhaseDto) {
        this.createEditModalMilestone.show(undefined, phase);
    }

    editSubItem(phase: PhaseDto, milestone: PhaseMilestoneDto) {
        this.createEditModalMilestone.show(milestone.id, phase);
    }

    deleteSubItem(milestone: PhaseMilestoneDto) {
        this.message.confirm(`¿Esta seguro de eliminar la etapa ${milestone.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._milestoneServiceProxy.delete(milestone.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Eliminado satisfactoriamente');
                });
        });
    }

    deleteItem(phase: PhaseDto) {
        this.message.confirm(`¿Esta seguro de eliminar la fase ${phase.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._phaseServiceProxy.delete(phase.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.error('Eliminado satisfactoriamente');
                });
        });
    }
}