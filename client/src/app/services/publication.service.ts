import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService{
	public url: string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addPublication(token, publication):Observable<any>{
		let params = JSON.stringify(publication);
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

		return this._http.post(this.url+'write-a-review', params, {headers: headers});

	}

	// Create building '/create-building',

	getBuildingsByPage(page=1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'get-buildings/'+page, {headers: headers});
	}

	// get Building by ID  /get-building/:buildingId',

	getBuildingsByAddress(page=1, address):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url+'get-building-loc/'+page, address,{headers: headers});
	}

	// get review '/review/:id',

	// delete review  '/review/:id',
}