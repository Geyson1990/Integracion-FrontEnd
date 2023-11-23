import { AfterViewInit, Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FindConflictComponent } from '@shared/component/find-conflict/find-conflict.component';
import { FindDirectoryGovernmentComponent } from '@shared/component/find-directory-government/find-directory-government.component';
import { HelpMemoryDto, HelpMemoryServiceProxy } from '@shared/service-proxies/application/help-memory-proxie';
import { ConflictSite, UtilityConflictListGetAllDto, UtilityDirectoryGovernmentDto } from '@shared/service-proxies/application/utility-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { FileDownloadRequestComponent } from '@shared/component/file-download-request/file-download-request.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
import { ReportServiceProxy, ReportType } from '@shared/service-proxies/application/report-proxie';

@Component({
    templateUrl: 'help-memory.component.html',
    styleUrls: [
        'help-memory.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class HelpMemoryComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('findConflictModal', { static: true }) findConflictModal: FindConflictComponent;
    @ViewChild('findDirectoryGovernmentModal', { static: true }) findDirectoryGovernmentModal: FindDirectoryGovernmentComponent;
    @ViewChild('fileDownloadRequest', { static: true }) fileDownloadRequest: FileDownloadRequestComponent;

    advancedFiltersAreShown: boolean = false;

    helpMemoryRequest: string;
    conflict: UtilityConflictListGetAllDto;
    directoryGovernment: UtilityDirectoryGovernmentDto;


    get conflictTitle(): string {
        if (!this.conflict)
            return 'Buscar...';

        return this.conflict.code + " - " + this.conflict.name;
    }

    get directoryGovernmentTitle(): string {
        if (!this.directoryGovernment)
            return 'Buscar...';

        return this.directoryGovernment.name;
    }
    
    reports = {
        socialConflict: 0,
        helpMemory: 1
    }

    sites = {
        all: ConflictSite.All,
        socialConflict: ConflictSite.SocialConflict,
        socialConflictAlert: ConflictSite.SocialConflictAlert,
        socialConflictSensible: ConflictSite.SocialConflictSensible
    };
    _verificationEnabled :boolean;

    constructor(injector: Injector, 
        private _helpMemoryServiceProxy: HelpMemoryServiceProxy,
        private _reportServiceProxy: ReportServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getData(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        setTimeout(() => {
            this.showMainSpinner('Cargando información. Por favor espere...');
        this.primengTableHelper.showLoadingIndicator();
        
       
        this._helpMemoryServiceProxy.getAll(
            this.advancedFiltersAreShown && this.conflict && this.conflict.site == this.sites.socialConflict ? this.conflict.id : <any>undefined,
            this.advancedFiltersAreShown && this.conflict && this.conflict.site == this.sites.socialConflictSensible ? this.conflict.id : <any>undefined,
            this.advancedFiltersAreShown && this.directoryGovernment ? this.directoryGovernment.id : <any>undefined,
            this.advancedFiltersAreShown ? this.helpMemoryRequest : <any>undefined,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)

        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            setTimeout(() => this.hideMainSpinner(), 1000);
        }); 
        
    }, 500);
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createHelpMemory(): void {
        this.router.navigate(['/app/application/create-help-memory']);
    }

    editHelpMemory(helpMemory: HelpMemoryDto): void {
        this.router.navigate(['/app/application/edit-help-memory', helpMemory.id]);
    }

    deleteHelpMemory(item: HelpMemoryDto): void {
        this.message.confirm(`¿Esta seguro de eliminar la ayuda memoria Nº ${item.code}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed) {
                this.showMainSpinner('Actualizando información, por favor espere...');
                this._helpMemoryServiceProxy
                    .delete(item.id)
                    .pipe(finalize(() => setTimeout(() => this.hideMainSpinner(), 500)))
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.error('Eliminado satisfactoriamente');
                    });
            }
        });
    }

    showSelectConflict() {
        this.findConflictModal.show();
    }

    selectConflict(conflict: UtilityConflictListGetAllDto) {
        this.conflict = conflict;
    }

    removeConflict() {
        this.conflict = undefined;
    }

    showDirectoryGovernment() {
        this.findDirectoryGovernmentModal.show();
    }

    selectDirectoryGovernment(directoryGovernment: UtilityDirectoryGovernmentDto) {
        this.directoryGovernment = directoryGovernment;
    }

    removeDirectoryGovernment() {
        this.directoryGovernment = undefined;
    }

    resetFilters() {
        this.conflict = undefined;
        this.directoryGovernment = undefined;
        this.helpMemoryRequest = undefined;
    }
    ReportHelpMemory() {
        this.fileDownloadRequest.show();
        this._helpMemoryServiceProxy.getExportHelpMemory(
            this.advancedFiltersAreShown && this.conflict && this.conflict.site == this.sites.socialConflict ? this.conflict.id : <any>undefined,
            this.advancedFiltersAreShown && this.conflict && this.conflict.site == this.sites.socialConflictSensible ? this.conflict.id : <any>undefined,
            this.advancedFiltersAreShown && this.directoryGovernment ? this.directoryGovernment.id : <any>undefined,
            this.advancedFiltersAreShown ? this.helpMemoryRequest : <any>undefined,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
            this.primengTableHelper.getSkipCount(this.paginator, undefined)
        ).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
            this.fileDownloadRequest.hide();
        })).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
    
    completeDownload(event: { format: ReportType, parameter: { item: HelpMemoryDto, type: number } }) {
        this.showMainSpinner('Generando reporte, por favor espere...');

        if (event.parameter.type == this.reports.helpMemory) {
            this.fileDownloadRequest.show();
            this._reportServiceProxy
                .createSocialConflictHelpMemory(event.parameter.item.id, event.format)
                .pipe(finalize(() => {
                    this.hideMainSpinner();
                    this.fileDownloadRequest.hide();
                })).subscribe((response) => {
                    const fileURL: any = URL.createObjectURL(response);
                    const a = document.createElement("a");
                    a.href = fileURL;
                    a.download = "Ayuda memoria";
                    a.click();
                });
        } else {
            this.fileDownloadRequest.show();
            this._reportServiceProxy
                .createSocialConflict(event.parameter.item.id, event.format)
                .pipe(finalize(() => {
                    this.hideMainSpinner();
                    this.fileDownloadRequest.hide();
                })).subscribe((response) => {
                    const fileURL: any = URL.createObjectURL(response);
                    const a = document.createElement("a");
                    a.href = fileURL;
                    a.download = "Report";
                    a.click();
                });
        }
    }
}
