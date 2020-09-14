export class Building{
    constructor(
        public _id:string,
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
        public file:string[],
        public created_at:string,
        public reviewsCounter:number,
    ){}
}
