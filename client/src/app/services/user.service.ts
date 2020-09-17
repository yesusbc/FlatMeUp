import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
	public url:string;
	public identity;
	public token;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(user: User): Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json'); // Nodejs

		return this._http.post(this.url+'register', params, {headers: headers});

	}

	signup(user, gettoken = null): Observable<any>{
		if(gettoken != null){
			user.gettoken = gettoken;
		}

		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'login', params, {headers: headers});
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');
		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

	updateUser(user: User):Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
		return this._http.put(this.url+'update-user/'+user._id, params, {headers: headers});

	}

	getUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
		return this._http.get(this.url+'user/'+id, {headers: headers});

	}

	getUserPublicData(destUserId):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'userPublicData/'+destUserId, {headers: headers});
	}

}