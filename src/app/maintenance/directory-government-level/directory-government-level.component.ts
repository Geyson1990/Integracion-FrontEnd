import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryGovernmentLevelDto, DirectoryGovernmentLevelServiceProxy } from '@shared/service-proxies/application/directory-government-level-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryGovernmentLevelComponent } from './create-edit-government-level/create-edit-directory-government-level.component';
import { CreateSelectColumnDirectoryGovernmentLevelComponent } from './create-select-column-directory-government-level/create-select-column-directory-government-level.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-government-level.component.html',
    styleUrls: [
        'directory-government-level.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryGovernmentLevelComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryGovernmentLevel', { static: true }) createEditModalDirectoryGovernmentLevel: CreateEditDirectoryGovernmentLevelComponent;
    @ViewChild('createEditModalColumnDirectoryGovernmentLevel', { static: true }) createEditModalColumnDirectoryGovernmentLevel: CreateSelectColumnDirectoryGovernmentLevelComponent;
    filterText: string;
    _verificationEnabled :boolean;
    checkName: boolean = true;
    checkEnabled: boolean = true;

    constructor(_injector: Injector, private _directorygovernmentlevelServiceProxy: DirectoryGovernmentLevelServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryGovernmentLevel.show();
    }

    selecionaColumnas(){
        this.createEditModalColumnDirectoryGovernmentLevel.showColumn();
    }

    editItem(directorygovernmentlevel: DirectoryGovernmentLevelDto) {
        this.createEditModalDirectoryGovernmentLevel.show(directorygovernmentlevel.id);
    }

    deleteItem(directorygovernmentlevel: DirectoryGovernmentLevelDto) {
        this.message.confirm(`¿Esta seguro de eliminar el registro ${directorygovernmentlevel.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorygovernmentlevelServiceProxy.delete(directorygovernmentlevel.id).subscribe(() => {
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
        this._directorygovernmentlevelServiceProxy
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

    exportMatrizToExcel() {
        this.primengTableHelper.showLoadingIndicator();
        this._directorygovernmentlevelServiceProxy
            .getMatrizToExcel(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
                this.primengTableHelper.getSkipCount(this.paginator, undefined),
                this.checkName,
                this.checkEnabled)
            .pipe(finalize(() => {
                this.primengTableHelper.hideLoadingIndicator();
                //this.fileDownloadRequest.hide();
            })).subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    recibeValorName(valorCheck : any[]){
      let i = 0;

      this.checkName = valorCheck[0];
      this.checkEnabled = valorCheck[1];

    }
}