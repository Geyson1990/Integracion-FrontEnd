import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, OptionDto, PersonType, UserAlertResponsibleDto, Institution } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityPersonDto } from '@shared/service-proxies/application/utility-proxie';
import { userReniecSunatProxy } from '@shared/service-proxies/application/user-reniec-sunar-proxie';
import { InstitutionComponent } from '@app/admin/institution/institution.component';

@Component({
    selector: 'create-edit-user',
    templateUrl: 'create-edit-user.component.html',
    styleUrls: [
        'create-edit-user.component.css'
    ]
})
export class CreateEditUserModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() findPerson: EventEmitter<boolean> = new EventEmitter<any>();

    active: boolean = false;
    saving: boolean = false;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    responsibles: UserAlertResponsibleDto[];
    institutions: Institution[];
    profilePicture: string;
    passwordComplexityInfo = '';
    userPasswordRepeat = '';

    userTypes: OptionDto[] = [
        { name: 'Administrativo', value: PersonType.None },
        { name: 'Coordinador', value: PersonType.Coordinator },
        { name: 'Gestor', value: PersonType.Manager },
        { name: 'Analista', value: PersonType.Analyst }
    ]

    types = {
        adminitrative: PersonType.None,
        coordinator: PersonType.Coordinator,
        manager: PersonType.Manager,
        analyst: PersonType.Analyst
    }

    get userTypeSearch() {
        return (this.user.type == PersonType.Coordinator ? 'Buscar coordinador' :
            this.user.type == PersonType.Manager ? 'Buscar gestor' :
                this.user.type == PersonType.Analyst ? 'Buscar analista' : '');
    }

    get userTypeSelected() {
        return (this.user.type == PersonType.Coordinator ? 'Coordinador' :
            this.user.type == PersonType.Manager ? 'Gestor' :
                this.user.type == PersonType.Analyst ? 'Analista' : '');
    }

    constructor(injector: Injector, private _userService: UserServiceProxy, private _profileService: ProfileServiceProxy, private  _userInformation : userReniecSunatProxy) {
        super(injector);
    }

    show(userId?: number): void {
        this._userService.getUserForEdit(userId).subscribe(userResult => {
            this.user = userResult.user;
            this.roles = userResult.roles;
            this.responsibles = userResult.responsibles;
            this.institutions= userResult.institutions;

        if (this.user?.institution && this.user.institution.id!= -1) {
        const managerIndex: number = this.institutions.findIndex(p => p.id == this.user.institution.id);
        if (managerIndex == -1) {
            this.institutions.push(Institution.fromJS(this.user.institution));
            
            this.institutions = this.institutions.sort((a, b) => a.name.localeCompare(b.name));
          }
        }

            if (!this.user.id)
                this.user.generatePerson = true;
            this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
                this.active = true;
                this.modal.show();
            });
        });
    }

    onSectorsChange(event: any) {
        const SectorId: number = +event.target.value;
        const index: number = this.institutions.findIndex(p => p.id == SectorId);
        
        if (index != -1) {
            this.user.institution.name = this.institutions[index].name;
        } else {
            this.user.institution.id = -1;
            this.user.institution.name = undefined;
        }
    }

    savePerson(person: UtilityPersonDto) {
        this.user.person = person;
    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    onShown(): void {
        document.getElementById('Name').focus();
    }

    save(): void {
        let input = new CreateOrUpdateUserInput();

        input.user = this.user;
        input.assignedRoleNames = _.map(_.filter(this.roles, { isAssigned: true, inheritedFromOrganizationUnit: false }), role => role.roleName);

        if (input.user.blankPassword) {
            input.user.password = this.appSession.codeText(this.user.blankPassword);
        }
        this.user.institutionId =this.user.institution.id;
        
        this.saving = true;
        this._userService.createOrUpdateUser(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.userPasswordRepeat = '';
        this.modal.hide();
    }

    getAssignedRoleCount(): number {
        return _.filter(this.roles, { isAssigned: true }).length;
    }
    GetDNIDocument(){
        if(!this.user.document){
            this.message.info('Debe debe ingresar el numero de documento');
            return
        }
        if(this.user.document.length < 8 ){
            this.message.info('Debe debe ingresar un numero correcto de documento');
            return
        }
        
        
        this._userInformation.getDataDni(this.user.document).subscribe(data => {
            
            this.user.surname = data.paterno;
            this.user.surname2 = data.materno;
            this.user.name = data.nombres;
        })
    }
}
