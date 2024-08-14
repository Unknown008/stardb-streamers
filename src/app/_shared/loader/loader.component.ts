import { Component } from "@angular/core";
import { EnvironmentPathService } from "src/app/_services/environment-path.service";

@Component({
    selector: "app-loader",
    templateUrl: "./loader.component.html",
    styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent {
    public path: string;

    constructor(
        private url: EnvironmentPathService
    ) { }

    ngOnInit() {
        this.path = this.url
            .getUrl("./../../assets/resources/loading.gif", true);
    }
}
