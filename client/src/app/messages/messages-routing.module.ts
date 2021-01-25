import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

// Services
import { UserGuard } from '../services/user.guard';

// Translate
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';

const messagesRoutes: Routes = [
	{
		path: 'profile/messages',
		component: MainComponent,
		children: [
			{ path: '', redirectTo: 'received/1', pathMatch: 'full'},
			{ path: 'send', component: AddComponent, canActivate:[UserGuard] },
			{ path: 'received', component: ReceivedComponent, canActivate:[UserGuard] },
			{ path: 'received/:page', component: ReceivedComponent, canActivate:[UserGuard] },
			{ path: 'sent', component: SentComponent, canActivate:[UserGuard] },
			{ path: 'sent/:page', component: SentComponent, canActivate:[UserGuard] }
		] 
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(messagesRoutes)
	],
	exports: [
		RouterModule
	]
})

export class MessagesRoutingModule{}

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
