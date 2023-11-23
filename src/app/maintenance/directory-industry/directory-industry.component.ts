import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryIndustryDto, DirectoryIndustryServiceProxy } from '@shared/service-proxies/application/directory-industry-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateEditDirectoryIndustryComponent } from './create-edit-directory-industry/create-edit-directory-industry.component';
import { CreateSelectColumnDirectoryIndustryComponent } from './create-select-column-directory-industry/create-select-column-directory-industry.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: 'directory-industry.component.html',
    styleUrls: [
        'directory-industry.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DirectoryIndustryComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditModalDirectoryIndustry', { static: true }) createEditModalDirectoryIndustry: CreateEditDirectoryIndustryComponent;
    @ViewChild('createSelectColumnDirectoryIndustry', { static: true }) createSelectColumnDirectoryIndustry: CreateSelectColumnDirectoryIndustryComponent;
    
    filterText: string;
    _verificationEnabled:boolean;    
    checkNameEmpresa: boolean = true;
    checkSector: boolean = true;
    checkDireccion: boolean = true;
    checkTelefono: boolean = true;
    checkPaginaWeb: boolean = true;
    checkDepartamento: boolean = true;
    checkProvincia: boolean = true;
    checkDistrito: boolean = true;
    checkHabilitado: boolean = true;
    checkTotal : boolean = false;

    constructor(_injector: Injector, private _directoryindustryServiceProxy: DirectoryIndustryServiceProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
        this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
    }

    createItem() {
        this.createEditModalDirectoryIndustry.show();
    }

    selecionaColumnas(){
        this.createSelectColumnDirectoryIndustry.showColumn();
    }

    editItem(directoryindustry: DirectoryIndustryDto) {
        this.createEditModalDirectoryIndustry.show(directoryindustry.id);
    }

    deleteItem(directoryindustry: DirectoryIndustryDto) {
        this.message.confirm(`¿Esta seguro de eliminar la entidad ${directoryindustry.name}?`, 'Aviso', (isConfirmed) => {
            if (isConfirmed)
                this._directoryindustryServiceProxy.delete(directoryindustry.id).subscribe(() => {
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
        this._directoryindustryServiceProxy
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
        this._directoryindustryServiceProxy
            .getMatrizToExcel(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, undefined),
                this.primengTableHelper.getSkipCount(this.paginator, undefined),
                this.checkNameEmpresa,
                this.checkSector,
                this.checkDireccion,
                this.checkTelefono,
                this.checkPaginaWeb,
                this.checkDepartamento,
                this.checkProvincia,
                this.checkDistrito,
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
  
        this.checkNameEmpresa = valorCheck[0];
        this.checkSector = valorCheck[1];
        this.checkDireccion = valorCheck[2];
        this.checkTelefono = valorCheck[3];
        this.checkPaginaWeb = valorCheck[4];
        this.checkDepartamento = valorCheck[5];
        this.checkProvincia = valorCheck[6];
        this.checkDistrito = valorCheck[7];
        this.checkHabilitado = valorCheck[8];
  
      }
}