import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { PublicationComponent } from './components/publication/publication.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyReviewsComponent } from './components/myreviews/myreviews.component';
import { BuildingComponent } from './components/building/building.component';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'home/:page', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'search', component: SearchComponent},
	{path: 'profile/edit', component: UserEditComponent},
	{path: 'profile/my-reviews', component: MyReviewsComponent},
	{path: 'profile/:id', component: ProfileComponent},
	{path: 'building/:buildingId', component: BuildingComponent},
	{path: 'write-a-review', component: PublicationComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
