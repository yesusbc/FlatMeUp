export class Publication{
	constructor(
		public _id:string,
		public user:string,
        public buildingId:string,
		public address: {
			country:string,
	        state:string,
	        city:string,
	        street:string,
	        buildingNumber:string,
	        apartment:string,
	        zip:string
    	},
        public typeOfBuilding:number,
    	public text:string,
    	public file:string[],
    	public created_at:string,
    	public rate:number,
    	public noise:number,
    	public priceBenefit:number,
    	public landlordSupport:number,
    	public maintenance:number,
    	public votesCounter:number,
    	public canBeContacted:number,
    	public interactionWithBuilding:number,
    	public timeOfInteraction:number,
	){}
}
