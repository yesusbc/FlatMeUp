import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from  '@angular/router';
import { UserService } from './services/user.service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title:string;
  public identity;
  public id;

  constructor(
  	private _route: ActivatedRoute,
  	private _router: Router,
  	private _userService:UserService,
    private translate: TranslateService
  ){
  	this.title = "RateMyFlat";
    this.translate.use('en');
  }

  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  }

  ngDoCheck(){
  	this.identity = this._userService.getIdentity();
  }

  logout(){
  	localStorage.clear();
  	this.identity = null;
  	this._router.navigate(['/']);
  }

  useLanguage(language: string) {
    this.translate.use(language);
    moment.locale(language);
  }

}
