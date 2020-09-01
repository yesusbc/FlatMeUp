import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';


const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'profile/configuration', component: UserEditComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
