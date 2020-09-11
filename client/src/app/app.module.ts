import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app-routing.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

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
    HttpClientModule
  ],
  providers: [
  	appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
