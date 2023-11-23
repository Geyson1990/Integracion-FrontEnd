import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryGovernmentTypeDto, DirectoryGovernmentTypeServiceProxy } from '@shared/service-proxies/application/directory-government-type-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryGovernmentTypeComponent } from './create-edit-directory-government-type/create-edit-directory-government-type.component';
import { CreateSelectColumnDirectoryGovernmentTypeComponent } from './create-select-column-directory-government-type/create-select-column-directory-government-type.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-government-type.component.html',
    styleUrls: [
        'directory-government-type.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryGovernmentTypeComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryGovernmentType', { static: true }) createEditModalDirectoryGovernmentType: CreateEditDirectoryGovernmentTypeComponent;
    @ViewChild('createEditModalColumnDirectoryGovernmentType', { static: true }) createEditModalColumnDirectoryGovernmentType: CreateSelectColumnDirectoryGovernmentTypeComponent;
    filterText: string;
    checkName: boolean = true;
    checkEnabled: boolean = true;

    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _directorygovernmenttypeServiceProxy: DirectoryGovernmentTypeServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryGovernmentType.show();
    }

    selecionaColumnas(){
        this.createEditModalColumnDirectoryGovernmentType.showColumn();
    }

    editItem(directorygovernmenttype: DirectoryGovernmentTypeDto) {
        this.createEditModalDirectoryGovernmentType.show(directorygovernmenttype.id);
    }

    deleteItem(directorygovernmenttype: DirectoryGovernmentTypeDto) {
        this.message.confirm(`¿Esta seguro de eliminar el tipo de gestión ${directorygovernmenttype.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorygovernmenttypeServiceProxy.delete(directorygovernmenttype.id).subscribe(() => {
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
        this._directorygovernmenttypeServiceProxy
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
        this._directorygovernmenttypeServiceProxy
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