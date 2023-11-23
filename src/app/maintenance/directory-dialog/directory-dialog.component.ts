import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FindDirectoryGovernmentComponent } from '@shared/component/find-directory-government/find-directory-government.component';
import { DirectoryDialogDto, DirectoryDialogGovernmentDto, DirectoryDialogServiceProxy } from '@shared/service-proxies/application/directory-dialog-proxie';
import { UtilityDirectoryGovernmentDto } from '@shared/service-proxies/application/utility-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryDialogComponent } from './create-edit-directory-dialog/create-edit-directory-dialog.component';
import { CreateSelectColumnDirectoryDialogComponent } from './create-select-column-directory-dialog/create-select-column-directory-dialog.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-dialog.component.html',
    styleUrls: [
        'directory-dialog.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryDialogComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryDialog', { static: true }) createEditModalDirectoryDialog: CreateEditDirectoryDialogComponent;
    @ViewChild('findDirectoryGovernmentDialog', { static: true }) findDirectoryGovernmentDialog: FindDirectoryGovernmentComponent;
    @ViewChild('createEditModalColumnDirectoryDialog', { static: true }) createEditModalColumnDirectoryDialog: CreateSelectColumnDirectoryDialogComponent;

    filterText: string;
    _verificationEnabled:boolean;    checkName: boolean = true;
    checkLast_name: boolean = true;
    checkMothers_last_name: boolean = true;
    checkPost: boolean = true;
    checkEntity: boolean = true;
    checkWeb: boolean = true;
    checkLandline: boolean = true;
    checkCell_phone: boolean = true;
    checkEnabled: boolean = true;

    constructor(_injector: Injector, private _directorydialogServiceProxy: DirectoryDialogServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    findDirectoryGovernment() {
        this.findDirectoryGovernmentDialog.show();
    }

    selectDirectoryGovernment(directoryGovernment: UtilityDirectoryGovernmentDto) {
        this.createEditModalDirectoryDialog.selectDirectoryGovernment(DirectoryDialogGovernmentDto.fromJS(directoryGovernment));
    }

    createItem() {
        this.createEditModalDirectoryDialog.show();
    }

    editItem(directorydialog: DirectoryDialogDto) {
        this.createEditModalDirectoryDialog.show(directorydialog.id);
    }

    selecionaColumnas(){
        this.createEditModalColumnDirectoryDialog.showColumn();
    }
    deleteItem(directorydialog: DirectoryDialogDto) {
        this.message.confirm(`¿Esta seguro de eliminar el registro ${directorydialog.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorydialogServiceProxy.delete(directorydialog.id).subscribe(() => {
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
        this._directorydialogServiceProxy
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
        this._directorydialogServiceProxy
            .getMatrizToExcel(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
                this.primengTableHelper.getSkipCount(this.paginator, undefined),
                this.checkName,
                this.checkLast_name,
                this.checkMothers_last_name,
                this.checkPost,
                this.checkEntity,
                this.checkWeb,
                this.checkLandline,
                this.checkCell_phone,
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
        this.checkLast_name = valorCheck[1];
        this.checkMothers_last_name = valorCheck[2];
        this.checkPost = valorCheck[3];
        this.checkEntity = valorCheck[4];
        this.checkWeb = valorCheck[5];
        this.checkLandline = valorCheck[6];
        this.checkCell_phone = valorCheck[7];
        this.checkEnabled = valorCheck[8];

      }
}