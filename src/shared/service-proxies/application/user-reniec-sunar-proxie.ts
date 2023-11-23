import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { PersonType, API_BASE_URL, blobToText, throwException, processComplete, EntityDto } from '../service-proxies';
import * as moment from 'moment';
import { ResponsibleActorType } from './responsible-actor-proxie';
import { SocialConflictAlertActorLocationDto } from './social-conflict-alert-proxie';
import { url } from 'inspector';

@Injectable()
export class userReniecSunatProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    
    }
    getDataDni(dni: string ):Observable<ActorDNI>{
        let url_ = this.baseUrl + "/api/services/app/UserConsulData/GetUserDataDni?";
        if (dni === null)
            throw new Error("The parameter 'dni' cannot be null.");
        else if (dni!== undefined)
            url_ += "dni=" + encodeURIComponent("" + dni) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this.http.request("get",url_,options_).pipe(_observableMergeMap((response_: any)=>{
            return this.processGetDataDni(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetDataDni(<any>response_);
                } catch (e) {
                    return <Observable<ActorDNI>><any>_observableThrow(e);
                }
            } else
                return <Observable<ActorDNI>><any>_observableThrow(response_);
        }));
    } 
    protected  processGetDataDni(response:HttpResponseBase):Observable<ActorDNI> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);                  
                result200 = ActorDNI.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ActorDNI>(<any>null);
    }




    getDNIDcoument(DNI: string): Observable<ActorDNI> {
        //ejemplo para ver el flujo 
        var actor = new ActorDNI({
            paterno: "surnames1",
            materno: "surnames2",
            nombres: "name",
            dni: "111111",
        });

        return _observableOf(actor);
    }

    getRucDocument(_ruc: string): Observable<ActorRucDocument> {

        
        //ejemplo para ver el flujo
        var actor = new ActorRucDocument({
            ruc: "20131312955",
            razonSocial: "SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACION TRIBUTARIA - SUNAT",
            nombreComercial: null,
            telefonos: [],
            tipo: null,
            estado: "ACTIVO",
            condicion: "HABIDO",
            direccion: "AV. GARCILASO DE LA VEGA NRO. 1472 LIMA LIMA LIMA",
            departamento: "LIMA",
            provincia: "LIMA",
            distrito: "LIMA",
            fechaInscripcion: null,
            sistEmsion: null,
            sistContabilidad: null,
            actExterior: null,
            actEconomicas: [],
            cpPago: [],
            sistElectronica: [],
            fechaEmisorFe: null,
            cpeElectronico: [],
            fechaPle: null,
            padrones: [],
            fechaBaja: null,
            profesion: null,
            ubigeo: "150101",
            capital: "LIMA"
        });

        return _observableOf(actor);
    }
}
export interface IActorDNI {
    paterno: string;
    materno: string;
    nombres: string;
    dni: string;
}
export class ActorDNI implements IActorDNI {
    paterno: string;
    materno: string;
    nombres: string;
    dni: string;

    constructor(data?: IActorDNI) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    init(data?: any) {
        if (data) {
            this.nombres = data["nombres"];
            this.paterno = data["paterno"];
            this.materno = data["materno"];
            this.dni = data["dni"];
        }
    }
    static fromJS(data: any): ActorDNI {
        data = typeof data === 'object' ? data : {};
        let result = new ActorDNI;
        result.init(data);
        return result;
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["nombres"] = this.nombres;
        data["paterno"] = this.paterno;
        data["materno"] = this.materno;
        data["dni"] = this.dni;
        return data;
    }
}

export interface IGetActorDNIDocument {
    success: boolean;
    mesage: string;
    data: ActorDNI;
}
export class GetActorDNIDocument implements IGetActorDNIDocument {
    success: boolean;
    mesage: string;
    data: ActorDNI;

    constructor(data?: GetActorDNIDocument) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        } else {

        }
    }
    init(data?: any) {
        if (data) {
            this.success = data["success"];
            this.mesage = data["mesage"];
            this.data = data["data"];
        }
    }
    static fromJS(data: any): GetActorDNIDocument {
        data = typeof data === 'object' ? data : {};
        let result = new GetActorDNIDocument;
        result.init(data);
        return result;
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["success"] = this.success;
        data["mesage"] = this.mesage;
        data["data"] = this.data;
        return data;
    }

}

export interface IActorRucDocument {
    ruc: string;
    razonSocial: string;
    nombreComercial: string;
    telefonos: string[];
    tipo: string;
    estado: string;
    condicion: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    fechaInscripcion: string;
    sistEmsion: string;
    sistContabilidad: string;
    actExterior: string;
    actEconomicas: string[];
    cpPago: string[];
    sistElectronica: string[];
    fechaEmisorFe: string;
    cpeElectronico: string[];
    fechaPle: string;
    padrones: string[];
    fechaBaja: string;
    profesion: string;
    ubigeo: string;
    capital: string;
}
export class ActorRucDocument implements IActorRucDocument {
    ruc: string;
    razonSocial: string;
    nombreComercial: string;
    telefonos: string[];
    tipo: string;
    estado: string;
    condicion: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    fechaInscripcion: string;
    sistEmsion: string;
    sistContabilidad: string;
    actExterior: string;
    actEconomicas: string[];
    cpPago: string[];
    sistElectronica: string[];
    fechaEmisorFe: string;
    cpeElectronico: string[];
    fechaPle: string;
    padrones: string[];
    fechaBaja: string;
    profesion: string;
    ubigeo: string;
    capital: string;

    constructor(data?: ActorRucDocument) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        } else {

        }
    }
}
