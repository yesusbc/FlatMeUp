import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { PublicationComponent } from './components/publication/publication.component';


const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'profile/configuration', component: UserEditComponent},
	{path: 'write-a-review', component: PublicationComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
