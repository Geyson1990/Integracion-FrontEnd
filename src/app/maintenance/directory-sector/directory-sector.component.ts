import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectorySectorDto, DirectorySectorServiceProxy } from '@shared/service-proxies/application/directory-sector-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectorySectorComponent } from './create-edit-sector/create-edit-directory-sector.component';
import { CreateSelectColumnDirectorySectorComponent } from './create-select-column-directory-sector/create-select-column-directory-sector.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-sector.component.html',
    styleUrls: [
        'directory-sector.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectorySectorComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectorySector', { static: true }) createEditModalDirectorySector: CreateEditDirectorySectorComponent;
    @ViewChild('createEditModalColumnDirectorySector', { static: true }) createEditModalColumnDirectorySector: CreateSelectColumnDirectorySectorComponent;
    filterText: string;
    _verificationEnabled:boolean;    
    checkName: boolean = true;
    checkEnabled: boolean = true;

    constructor(_injector: Injector, private _directorysectorServiceProxy: DirectorySectorServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectorySector.show();
    }
    selecionaColumnas(){
        this.createEditModalColumnDirectorySector   .showColumn();
    }

    editItem(directorysector: DirectorySectorDto) {
        this.createEditModalDirectorySector.show(directorysector.id);
    }

    deleteItem(directorysector: DirectorySectorDto) {
        this.message.confirm(`¿Esta seguro de eliminar el sector ${directorysector.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorysectorServiceProxy.delete(directorysector.id).subscribe(() => {
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
        this._directorysectorServiceProxy
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
        this._directorysectorServiceProxy
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