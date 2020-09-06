import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import  { Building } from '../../models/building';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	providers: [PublicationService]
})

export class HomeComponent implements OnInit{
	public title:string;
	public status:string;
	public page;
	public total;
	public pages;
	public buildings: Building[];
	public address;

	constructor(
		private _router: Router,
		private _publicationService: PublicationService
	){
		this.title = 'Welcome to FlatMeUp';
		this.page = 1;
	}

	ngOnInit(){
		console.log('home.component loaded');
		this.getBuildingsByPage(this.page);
	}

	getBuildingsByPage(page){
		this._publicationService.getBuildingsByPage(page).subscribe(
				response => {
					if(response.buildings){
						console.log(response);
						this.total = response.total;
						this.pages = response.pages;
						this.buildings = response.buildings;

						if (page > this.pages){
							this._router.navigate(['/home']);
						}
					}else{
						this.status = 'error';
					}
				},
				error => {
					var errorMessage = <any>error;
					console.log(errorMessage);
					if(errorMessage != null){
						this.status = 'error';
					}
				}
			);
	}
}