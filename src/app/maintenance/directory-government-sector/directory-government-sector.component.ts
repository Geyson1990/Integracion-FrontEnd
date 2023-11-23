import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryGovernmentSectorDto, DirectoryGovernmentSectorServiceProxy } from '@shared/service-proxies/application/directory-government-sector';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryGovernmentSectorComponent } from './create-edit-government-sector/create-edit-government-sector.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { CreateSelectColumnDirectoryGovernmentSectorComponent } from './create-select-column-directory-government-sector/create-select-column-directory-government-sector.component';

@Component({
    templateUrl: 'directory-government-sector.component.html',
    styleUrls: [
        'directory-government-sector.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryGovernmentSectorComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryGovernmentSector', { static: true }) createEditModalDirectoryGovernmentSector: CreateEditDirectoryGovernmentSectorComponent;
    @ViewChild('createSelectModalColumnDirectoryGovernmentSector', { static: true }) createSelectModalColumnDirectoryGovernmentSector: CreateSelectColumnDirectoryGovernmentSectorComponent;

    filterText: string;
    checkName: boolean = true;
    checkEnabled: boolean = true;


    _verificationEnabled:boolean;
    constructor(_injector: Injector, private _directorygovernmentsectorServiceProxy: DirectoryGovernmentSectorServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryGovernmentSector.show();
    }

    selecionaColumnas(){
        this.createSelectModalColumnDirectoryGovernmentSector.showColumn();
    }

    editItem(directorygovernmentsector: DirectoryGovernmentSectorDto) {
        this.createEditModalDirectoryGovernmentSector.show(directorygovernmentsector.id);
    }

    deleteItem(directorygovernmentsector: DirectoryGovernmentSectorDto) {
        this.message.confirm(`¿Esta seguro de eliminar el sector ${directorygovernmentsector.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directorygovernmentsectorServiceProxy.delete(directorygovernmentsector.id).subscribe(() => {
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
        this._directorygovernmentsectorServiceProxy
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
        this._directorygovernmentsectorServiceProxy
            .getMatrizToExcel(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
                this.primengTableHelper.getSkipCount(this.paginator, undefined),
                this.checkName,
                this.checkEnabled)
            .pipe(finalize(() => {
                this.primengTableHelper.hideLoadingIndicator();
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