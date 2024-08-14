import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: "root"
})
export class TwitchService {
    private token: string = "";

    constructor(
        private http: HttpClient
    ) { }

    private auth(): Observable<any> {
        let body = {};
        let headers: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        let httpParams: HttpParams = new HttpParams({ 
            fromObject: {
                client_id: environment.clientI,
                client_secret: environment.clientS,
                grant_type: "client_credentials"
            }
        });
        
        return this.http.post(
            "https://id.twitch.tv/oauth2/token",
            body,
            {
                headers: headers,
                params: httpParams
            }
        );
    }

    public async getUserId(usernames: string[]): Promise<any> {
        if (this.token == "") {
            let source$ = this.auth();
            let data = await firstValueFrom(source$);
            this.token = data.access_token;
            return this.retrieveUserId(usernames);
        } else {
            return this.retrieveUserId(usernames);
        }
    }

    private retrieveUserId(usernames: string[]): Promise<any> {
        let pieces = [];
        for (let username of usernames) {
            pieces.push(`login=${username}`);
        }
        let httpParams: HttpParams = new HttpParams({ 
            fromString: pieces.join("&")
        });

        let headers: HttpHeaders = new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            'Client-Id': environment.clientI
        });

        let source$ = this.http.get(
            "https://api.twitch.tv/helix/users",
            {
                headers: headers,
                params: httpParams
            }
        );
        return firstValueFrom(source$);
    }

    public async getUserInfo(userIds: number[]): Promise<any> {
        if (this.token == "") {
            let source$ = this.auth();
            let data = await firstValueFrom(source$);
            this.token = data.access_token;
            return this.retrieveUserInfo(userIds)
        } else {
            return this.retrieveUserInfo(userIds);
        }
    }

    private retrieveUserInfo(userIds: number[]): Promise<any> {
        let pieces = [];
        for (let userId of userIds) {
            pieces.push(`user_id=${userId}`);
        }
        let httpParams: HttpParams = new HttpParams({ 
            fromString: pieces.join("&")
        });

        let headers: HttpHeaders = new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            'Client-Id': environment.clientI
        });

        let source$ = this.http.get(
            "https://api.twitch.tv/helix/streams?",
            {
                headers: headers,
                params: httpParams
            }
        );
        return firstValueFrom(source$);
    }
}
