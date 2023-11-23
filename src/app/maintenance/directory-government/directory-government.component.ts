import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryGovernmentDto, DirectoryGovernmentServiceProxy } from '@shared/service-proxies/application/directory-government-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryGovernmentComponent } from './create-edit-directory-government/create-edit-directory-government';
import { CreateSelectColumnGovernmentComponent } from './create-select-column-government/create-select-column-government.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { AttachmentUploadDto } from '@shared/service-proxies/application/utility-proxie';
import { ResourceSizeType } from '@shared/component/file-uploader/file-uploader.component';

@Component({
    templateUrl: 'directory-government.component.html',
    styleUrls: [
        'directory-government.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryGovernmentComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryGovernment', { static: true }) createEditModalDirectoryGovernment: CreateEditDirectoryGovernmentComponent;
    @ViewChild('createEditModalColumnGovernment', { static: true }) createEditModalColumnGovernment: CreateSelectColumnGovernmentComponent;

    filterText: string;
    _verificationEnabled:boolean;    checkName: boolean = true;
    checkShortName: boolean = true;
    checkAddress: boolean = true;
    checkPhoneNumber: boolean = true;
    checkUrl: boolean = true;
    checkTipo: boolean = true;
    checkSector: boolean = true;
    checkHabilitado: boolean = true;
    
    size: ResourceSizeType = ResourceSizeType.MB1;
    
    constructor(_injector: Injector, private _directorygovernmentServiceProxy: DirectoryGovernmentServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryGovernment.show();
    }
    selecionaColumnas(){
        this.createEditModalColumnGovernment.showColumn();
    }

    editItem(directorygovernment: DirectoryGovernmentDto) {
        this.createEditModalDirectoryGovernment.show(directorygovernment.id);
    }

    deleteItem(directorygovernment: DirectoryGovernmentDto) {
        this.message.confirm(`¿Esta seguro de eliminar la entidad ${directorygovernment.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorygovernmentServiceProxy.delete(directorygovernment.id).subscribe(() => {
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
        this._directorygovernmentServiceProxy
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
        this._directorygovernmentServiceProxy
            .getMatrizToExcel(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
                this.primengTableHelper.getSkipCount(this.paginator, undefined),
                this.checkName,
                this.checkShortName,
                this.checkAddress,
                this.checkPhoneNumber,
                this.checkUrl,
                this.checkTipo,
                this.checkSector,
                this.checkHabilitado)
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
      this.checkShortName = valorCheck[1];
      this.checkAddress = valorCheck[2];
      this.checkPhoneNumber = valorCheck[3];
      this.checkUrl = valorCheck[4];
      this.checkTipo = valorCheck[5];
      this.checkSector = valorCheck[6];
      this.checkHabilitado = valorCheck[7];

    }
    saveAttach(attachment: AttachmentUploadDto) {
        //this.socialConflictAlert.uploadFiles.push(attachment);
    }

    
}