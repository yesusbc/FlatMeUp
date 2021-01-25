// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import {HttpClient} from '@angular/common/http';

// Routes
import { MessagesRoutingModule } from './messages-routing.module';

// Components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

// Services
import { UserService } from '../services/user.service';
import { UserGuard } from '../services/user.guard';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


@NgModule({
	declarations: [
	MainComponent,
	AddComponent,
	ReceivedComponent,
	SentComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MessagesRoutingModule,
		MomentModule,
		TranslateModule.forRoot({
		loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	exports: [
		MainComponent,
		AddComponent,
		ReceivedComponent,
		SentComponent
	],
	providers: [
	UserService,
	UserGuard
	]
})

export class MessagesModule{}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
