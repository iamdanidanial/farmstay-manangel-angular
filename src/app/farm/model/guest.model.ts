export interface Guest {
    id         : number;
    name       : string;
    guestimg   : string;
    email      : string;
    phoneNumber: string;
    countryId  : number;
  }

  export interface Country {
    id        : number;
    name      : string;
    capital   : string;
    googlemaps: string;
    flags     : string;
    region    : string;
    subregion : string;
    continents: string;
    population: number;
  }