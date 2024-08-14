import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EnvironmentPathService } from "../_services/environment-path.service";
import { JsonService } from "../_services/json.service";
import { TwitchService } from "../_services/twitch.service";
import * as moment from 'moment';
import 'moment-duration-format';

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
    public streamers: any;
    public streamersList: any;
    public loading: boolean = false;

    public charSelect: FormGroup;

    constructor(
        private json: JsonService,
        private url: EnvironmentPathService,
        private _twitchService: TwitchService
    ) { }

    ngOnInit() {
        this.loading = true;

        this.getStreamers();
    }

    getStreamers() {
        this.json.getJSON(this.url.getUrl("assets/resources/streamers.json"))
            .subscribe(async (data: any) => {
                this.streamersList = data;
                let userData = await this._twitchService
                    .getUserId(data);
                let userIds = [];
                for (let userDatum of userData.data) {
                    userIds.push(userDatum.id);
                }
                let userInfo = await this._twitchService
                    .getUserInfo(userIds);
                
                this.getStreamersDetails(userInfo);

                this.loading = false;
            });
    }

    getStreamersDetails(data: any) {
        let streamData = [];
        let twitchData: any[] = data.data;

        for (let streamer of this.streamersList) {
            let info = {
                name: streamer,
                live: "Offline",
                live_for: "",
                viewers: 0
            }
    
            let streamerData = twitchData.find(d => d.user_login == streamer);
            if (streamerData != undefined) {
                info.live = `Streaming ${streamerData.game_name}`;
                info.viewers = streamerData.viewer_count;
                info.live_for = moment.duration(new Date().getTime() - 
                    new Date(streamerData.started_at).getTime(), "milliseconds")
                    .format("hh:mm:ss");
            }

            streamData.push(JSON.parse(JSON.stringify(info)));
        }

        streamData.sort(this.textSort);
        this.streamers = streamData;
    }

    /**
     * Text sort
     */
    textSort(a, b) {
        if (a.viewers < b.viewers)
            return 1;
        else if (a.viewers > b.viewers)
            return -1;
        else if (a.name < b.name)
            return -1;
        else if (a.name > b.name)
            return 1;
        else
            return 0;
    }
}
