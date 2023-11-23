import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, } from '@angular/core';
import { API_BASE_URL, blobToText, processComplete, throwException } from '../service-proxies';
import * as moment from 'moment';
import { ConflictVerificationState } from './utility-proxie';

@Injectable()
export class ReportServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    createSocialConflictAlert(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictAlert?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSocialConflictAlertResume(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictAlertResume?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }


    createDialogSpaceReport(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateDialogSpaceReport?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }
/* merge educode
    createSocialConflictHelpMemory(data: DownloadSocialConflict): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictHelpMemory?";

        let options_: any = {
            body: JSON.stringify({
                id: data.id,
                type: data.format,
                bolNameCase:  data.bolNameCase,
                bolLocation: data.bolLocation,
                bolBackground: data.bolBackground,
                bolDemand: data.bolDemand,
                bolAccions: data.bolAccions,
                bolCurrentSituation: data.bolCurrentSituation,
                bolRecommendations: data.bolRecommendations,
                bolCommitments: data.bolCommitments,
                bolSectors: data.bolSectors,
                bolRiskLevels: data.bolRiskLevels
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }*/
    createSocialConflictHelpMemory(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictHelpMemory?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSocialConflict(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflict?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSocialConflictReport(filter: string | undefined, verification: ConflictVerificationState, code: string | undefined, territorialUnit: number | undefined, startDate: moment.Moment | undefined, endDate: moment.Moment | undefined): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/ReportTeams?";

        let options_: any = {
            body: JSON.stringify({
                Filter: filter,
                Verification: verification,
                TerritorialUnitId: territorialUnit,
                StartTime: startDate,
                EndTime: endDate,
                Code: code
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSocialConflictSensible(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictSensible?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSocialConflictSensibleHelpMemory(data: DownloadSocialConflict): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSocialConflictSensibleHelpMemory?";

        let options_: any = {
            body: JSON.stringify({
                id: data.id,
                type: data.format,
                bolNameCase:  data.bolNameCase,
                bolLocation: data.bolLocation,
                bolBackground: data.bolBackground,
                bolDemand: data.bolDemand,
                bolAccions: data.bolAccions,
                bolCurrentSituation: data.bolCurrentSituation,
                bolRecommendations: data.bolRecommendations,
                bolRiskLevels: data.bolRiskLevels
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createCrisisCommittee(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateCrisisCommittee?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createInterventionPlan(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateInterventionPlan?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    createSectorMeetSession(id: number, type: ReportType): Observable<Blob> {
        let url_ = this.baseUrl + "/api/services/app/Report/CreateSectorMeetSession?";

        let options_: any = {
            body: JSON.stringify({
                id: id,
                type: type
            }),
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownload(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownload(<any>response_);
                } catch (e) {
                    return <Observable<Blob>><any>_observableThrow(e);
                }
            } else
                return <Observable<Blob>><any>_observableThrow(response_);
        }));
    }

    protected processDownload(response: HttpResponseBase): Observable<Blob> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;
        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return _observableOf(responseBlob);
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<Blob>(<any>null);
    }

}

export enum ReportType {
    PDF,
    XLSX,
    DOCX,
    HTML
}

export interface IDownloadSocialConflict {
    id: number;
    format: ReportType;
    bolNameCase: boolean;
    bolLocation: boolean;
    bolBackground: boolean;
    bolDemand: boolean;
    bolAccions: boolean;
    bolCurrentSituation: boolean;
    bolRecommendations: boolean;
    bolCommitments: boolean;
    bolSectors: boolean;
    bolRiskLevels: boolean;
    bolMeetings: boolean;
}

export class DownloadSocialConflict implements IDownloadSocialConflict {
    id: number;
    format: ReportType;
    bolNameCase: boolean;
    bolLocation: boolean;
    bolBackground: boolean;
    bolDemand: boolean;
    bolAccions: boolean;
    bolCurrentSituation: boolean;
    bolRecommendations: boolean;
    bolCommitments: boolean;
    bolSectors: boolean;
    bolRiskLevels: boolean;
    bolMeetings: boolean;

    constructor(data?: IDownloadSocialConflict) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        } 
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.format = data["format"];
            this.bolNameCase = data["bolNameCase"];
            this.bolLocation = data["bolLocation"];
            this.bolBackground = data["bolBackground"];
            this.bolDemand = data["bolDemand"];
            this.bolAccions = data["bolAccions"];
            this.bolCurrentSituation = data["bolCurrentSituation"];
            this.bolRecommendations = data["bolRecommendations"];
            this.bolCommitments = data["bolCommitments"];
            this.bolSectors = data["bolSectors"];
            this.bolRiskLevels = data["bolRiskLevels"];
            this.bolMeetings = data["bolMeetings"];
        }
    }

    static fromJS(data: any): DownloadSocialConflict {
        data = typeof data === 'object' ? data : {};
        let result = new DownloadSocialConflict();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["format"] = this.format;

        data["bolNameCase"] = this.bolNameCase;
        data["bolLocation"] = this.bolLocation;
        data["bolBackground"] = this.bolBackground;
        data["bolDemand"] = this.bolDemand;
        data["bolAccions"] = this.bolAccions;
        data["bolCurrentSituation"]  = this.bolCurrentSituation;
        data["bolRecommendations"] = this.bolRecommendations;
        data["bolCommitments"] = this.bolCommitments;
        data["bolSectors"] = this.bolSectors;
        data["bolRiskLevels"] = this.bolRiskLevels;
        data["bolMeetings"] = this.bolMeetings;
        return data;
    }
}

