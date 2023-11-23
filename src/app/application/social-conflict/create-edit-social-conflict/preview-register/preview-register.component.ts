import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'preview-register-social-conflict',
    templateUrl: 'preview-register.component.html',
    styleUrls: [
        'preview-register.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class PreviewRegisterSocialConflictComponent extends AppComponentBase implements OnInit {
    loaded: boolean = false;
    returnUrl: string;
    typeSpaceDialog = -1;

    constructor(_injector: Injector) {
        super(_injector);
       
    }

    ngOnInit() {
      this.loaded = true;
    }


    backButtonPressed() {
        this.router.navigate(['/app/application/social-conflicts'], { queryParams: {} });
    }

   
    clickNext(){
        if(this.typeSpaceDialog == 2)
            this.router.navigate(['app/conflict-tools/dialog-space/create-dialog-space'], { state: {previewCase: true, typeSpaceDialog: this.typeSpaceDialog} });
        else
            this.router.navigate(['/app/application/create-social-conflict'], { state: {typeSpaceDialog: this.typeSpaceDialog} });
        
    }


}