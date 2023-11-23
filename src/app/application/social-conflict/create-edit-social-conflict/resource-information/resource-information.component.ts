import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { SocialConflictDto, SocialConflictManagementLocationDto, SocialConflictResourceDto } from '@shared/service-proxies/application/social-conflict-proxie';
import { TreeDragDropService, TreeNode, MenuItem } from "primeng/api";
import * as moment from 'moment';
import { SocialConflictResourceUpdateDto } from '../../../../../shared/service-proxies/application/social-conflict-proxie';

@Component({
    selector: 'resource-information-social-conflict',
    templateUrl: 'resource-information.component.html',
    styleUrls: [
        'resource-information.component.css'
    ]
})
export class ResourceInformationSocialConflictComponent {
    
    files!: TreeNode[];
    selectedFiles!: TreeNode[];


    nameFolder = '';
    showAddFolder = false;

    private _busy: boolean;
    private _socialConflict: SocialConflictDto;

    @Output() showEditResource: EventEmitter<{ value: SocialConflictDto, index: number }> = new EventEmitter<{ value: SocialConflictDto, index: number }>();
    @Output() deleteResources: EventEmitter<{ value: SocialConflictResourceDto[] }> = new EventEmitter<{ value: SocialConflictResourceDto[] }>();
    @Output() updateResources: EventEmitter<{ value: SocialConflictResourceDto[] }> = new EventEmitter<{ value: SocialConflictResourceDto[] }>();

    @Input() get busy(): boolean {
        return this._busy;
    }

    set busy(value: boolean) {
        this._busy = value;
    }

    @Input() get socialConflict(): SocialConflictDto {
        return this._socialConflict;
    }

    set socialConflict(value: SocialConflictDto) {
        this._socialConflict = value;
    }

    @Input() hasPermission: boolean;

    constructor() {
        
    }

    ngOnInit() {
        this.files = this.getFileSystemNodesData();

    }

    editResource(resource: SocialConflictDto, index: number) {
        this.showEditResource.emit({ value: resource, index: index });;
    }

    openEdit(){
        if(this.selectedFiles[0].icon == 'pi pi-fw pi-file'){
            this.editResource( this.selectedFiles[0].data,  0)
        }
    }

    deleteFile(){
        const data:SocialConflictResourceDto[]=[];
        this.selectedFiles.forEach(element => {
            const resource = new SocialConflictResourceDto();
            resource.id = +element.key;
            data.push(resource)
        });
        this.deleteResources.emit({ value: data});;
    }


    addFolder(){
        const selectedItem = this.selectedFiles[0];
        if(selectedItem.icon == 'pi pi-folder'){
           
            const node = {
                key: ''+moment.now(), label: this.nameFolder, icon: 'pi pi-folder' , children: []
            } ;

            for (let index = 0; index <  this.files.length; index++) {
                const element =  this.files[index];
                if(element.key === selectedItem.key){
                    element.children.push(node)
                }
                for (let y = 0; y <  element.children.length; y++) {
                    const elementY = element.children[y];
                    if(elementY.key === selectedItem.key){
                        elementY.children.push(node)
                    }
                }
                
            }        
            this.showAddFolder = false;
            this.nameFolder = '';   
        }
    }

    enableAddFolder() {
        this.showAddFolder = true;
        this.nameFolder = '';
    }

      
     buildTree(data: any[]): TreeNode[] {
        const tree: TreeNode[] = [];
      
        data.forEach((item) => {
          const pathSegments = item.sectionFolder.split('/');
          let currentNode = tree;
      
          for (const segment of pathSegments) {
            let existingNode = currentNode.find((node) => node.label === segment);
      
            if (!existingNode) {
              existingNode = { key: item.id+moment.now(), label: segment, icon: 'pi pi-folder' , children: []};
              currentNode.push(existingNode);
            }
      
            currentNode = existingNode.children || (existingNode.children = []);
          }
      
          if (item.name) {
            currentNode.push({ key: item.id, data: item, label: item.name, icon: 'pi pi-fw pi-file' });
          }
        });
        return tree;
      }

    getFileSystemNodesData() {
        const data = this.socialConflict.resources;

  

        return this.buildTree(data);
    }

    processFiles(files, parentLabel = '') {
        const processedData = [];
      
        files.forEach((file) => {
          if (file.icon === 'pi pi-fw pi-file') {
            const item = file.data;
            item.newSectionFolder = parentLabel ? `${parentLabel}/${file.label}` : file.label;
            processedData.push(item);
          } else if (file.children) {
            processedData.push(...this.processFiles(file.children, parentLabel ? `${parentLabel}/${file.label}` : file.label));
          }
        });
      
        return processedData;
      }

    eventDragAndDrop(event){
        const data = this.processFiles(this.files);

        this.updateResources.emit({ value: data});;
    }
}

/* interface TreeNode {
    path: string;
    type: 'folder' | 'file';
    file?: string;
    children?: TreeNode[];
  } */