import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryResponsibleDto, DirectoryResponsibleServiceProxy } from '@shared/service-proxies/application/directory-responsible-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryResponsibleComponent } from './create-edit-directory-responsible/create-edit-directory-responsible.component';
import { CreateSelectColumnDirectoryResponsibleComponent } from './create-select-column-directory-responsible/create-select-column-directory-responsible.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-responsible.component.html',
    styleUrls: [
        'directory-responsible.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryResponsibleComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryResponsible', { static: true }) createEditModalDirectoryResponsible: CreateEditDirectoryResponsibleComponent;
    @ViewChild('createEditModalColumnDirectoryResponsible', { static: true }) createEditModalColumnDirectoryResponsible: CreateSelectColumnDirectoryResponsibleComponent;
    filterText: string;
    _verificationEnabled:boolean;    
    checkName: boolean = true;
    checkEnabled: boolean = true;
    constructor(_injector: Injector, private _directoryresponsibleServiceProxy: DirectoryResponsibleServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryResponsible.show();
    }

    selecionaColumnas(){
        this.createEditModalColumnDirectoryResponsible.showColumn();
    }

    editItem(directoryresponsible: DirectoryResponsibleDto) {
        this.createEditModalDirectoryResponsible.show(directoryresponsible.id);
    }

    deleteItem(directoryresponsible: DirectoryResponsibleDto) {
        this.message.confirm(`¿Esta seguro de eliminar el responsable ${directoryresponsible.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directoryresponsibleServiceProxy.delete(directoryresponsible.id).subscribe(() => {
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
        this._directoryresponsibleServiceProxy
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
        this._directoryresponsibleServiceProxy
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