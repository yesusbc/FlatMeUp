import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { routing, appRoutingProviders } from './app-routing.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MomentModule } from 'angular2-moment';

// Customs Model
import { MessagesModule } from './messages/messages.module';

// Components
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { PublicationComponent } from './components/publication/publication.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyReviewsComponent } from './components/myreviews/myreviews.component';
import { BuildingComponent } from './components/building/building.component';

// Services
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    PublicationComponent,
    ProfileComponent,
    MyReviewsComponent,
    BuildingComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MessagesModule,
    MomentModule,
    TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        })
  ],
  providers: [
  	appRoutingProviders,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
