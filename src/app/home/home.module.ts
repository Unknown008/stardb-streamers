import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { RouterModule } from "@angular/router";
import { HomeRoutes } from "./home.routing";
import { FooterModule } from "../_shared/footer/footer.module";
import { FormsModule } from "@angular/forms";
import { LoaderModule } from "../_shared/loader/loader.module";

@NgModule({
    imports: [
        CommonModule,
        FooterModule,
        FormsModule,
        RouterModule.forChild(HomeRoutes),
        LoaderModule
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
