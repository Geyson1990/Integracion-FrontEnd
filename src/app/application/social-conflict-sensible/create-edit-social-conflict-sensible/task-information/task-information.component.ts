import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictSensibleDto } from '@shared/service-proxies/application/social-conflict-sensible-proxie';
import { SocialConflictTaskManagementGetAllDto, SocialConflictTaskManagementServiceProxy, SocialConflictTaskManagementStatus } from '@shared/service-proxies/application/social-conflict-task-management-proxie';
import { ConflictSite } from '@shared/service-proxies/application/utility-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'task-information-social-conflict-sensible',
    templateUrl: 'task-information.component.html',
    styleUrls: [
        'task-information.component.css'
    ]
})
export class TaskInformationSocialConflictSensibleComponent extends AppComponentBase implements AfterViewInit {

    private _socialConflictSensible: SocialConflictSensibleDto;
    private _busy: boolean;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() get busy(): boolean {
        return this._busy;
    }

    set busy(value: boolean) {
        this._busy = value;
    }

    @Input() get socialConflictSensible(): SocialConflictSensibleDto {
        return this._socialConflictSensible;
    }

    set socialConflictSensible(value: SocialConflictSensibleDto) {
        this._socialConflictSensible = value;
    }

    @Output() socialConflictAlertChange: EventEmitter<SocialConflictSensibleDto> = new EventEmitter<SocialConflictSensibleDto>();

    conflictCode: string;
    conflictName: string;
    taskTitle: string;

    taskStatus = {
        none: SocialConflictTaskManagementStatus.None,
        pending: SocialConflictTaskManagementStatus.Pending,
        completed: SocialConflictTaskManagementStatus.Completed,
        nonCompleted: SocialConflictTaskManagementStatus.NonCompleted
    }

    sites = {
        conflict: ConflictSite.SocialConflict,
        alert: ConflictSite.SocialConflictAlert,
        sensible: ConflictSite.SocialConflictSensible
    }


    status: SocialConflictTaskManagementStatus = this.taskStatus.none;

    constructor(_injector: Injector, private _socialConflictTaskManagementServiceProxy: SocialConflictTaskManagementServiceProxy) {
        super(_injector);
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._socialConflictTaskManagementServiceProxy.getAllTask(
            this.socialConflictSensible.id,
            this.conflictCode,
            this.conflictName,
            this.taskTitle,
            this.status == this.taskStatus.none ? undefined : this.status,
            ConflictSite.SocialConflictSensible,
            ConflictSite.All,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        })
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    goToConflict(task: SocialConflictTaskManagementGetAllDto) {
        this.router.navigate(['/app/application/sc-task-managements'], { queryParams: { id: this.socialConflictSensible.id, site: this.sites.sensible, task: task.id } });
    }

    goTaskManagement() {
        this.router.navigate(['/app/application/sc-task-managements'], { queryParams: { id: this.socialConflictSensible.id, site: this.sites.sensible } });
    }
}