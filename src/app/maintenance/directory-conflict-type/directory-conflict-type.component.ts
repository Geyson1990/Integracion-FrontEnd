import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryConflictTypeDto, DirectoryConflictTypeServiceProxy } from '@shared/service-proxies/application/directory-conflict-type-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryConflictTypeComponent } from './create-edit-conflict-type/create-edit-directory-conflict-type.component';
import { CreateSelectColumnDirectoryConflictTypeComponent } from './create-select-column-directory-conflict-type/create-select-column-directory-conflict-type.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-conflict-type.component.html',
    styleUrls: [
        'directory-conflict-type.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryConflictTypeComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryConflictType', { static: true }) createEditModalDirectoryConflictType: CreateEditDirectoryConflictTypeComponent;
    @ViewChild('createEditModalColumnDirectoryConflictType', { static: true }) createEditModalColumnDirectoryConflictType: CreateSelectColumnDirectoryConflictTypeComponent;
    filterText: string;
    _verificationEnabled:boolean;    checkName: boolean = true;
    checkEnabled: boolean = true;

    constructor(_injector: Injector, private _directoryconflicttypeServiceProxy: DirectoryConflictTypeServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryConflictType.show();
    }
    selecionaColumnas(){
        this.createEditModalColumnDirectoryConflictType.showColumn();
    }

    editItem(directoryconflicttype: DirectoryConflictTypeDto) {
        this.createEditModalDirectoryConflictType.show(directoryconflicttype.id);
    }

    deleteItem(directoryconflicttype: DirectoryConflictTypeDto) {
        this.message.confirm(`¿Esta seguro de eliminar el registro ${directoryconflicttype.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directoryconflicttypeServiceProxy.delete(directoryconflicttype.id).subscribe(() => {
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
        this._directoryconflicttypeServiceProxy
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
        this._directoryconflicttypeServiceProxy
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