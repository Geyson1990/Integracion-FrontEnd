import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LazyLoadEvent } from 'primeng';

@Component({
  selector: 'directory-organizations',
  templateUrl: 'directory-organizations.component.html',
  styleUrls: ['directory-organizations.component.css'],
  animations: [
    appModuleAnimation()
  ]
})
export class DirectoryOrganizationsComponent extends AppComponentBase {
  filterText: string;

  constructor(_injector: Injector, 
    private _fileDownloadService: FileDownloadService) {
    super(_injector);
}
  getData(event?: LazyLoadEvent) {}
  exportMatrizToExcel() {}
  createItem() {
    
  }
  selecionaColumnas(){
  }

}
