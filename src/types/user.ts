export interface IUser {
  userName: string;
  email: string;
  password: string;
  organization: Organizaton;
  location?: Location;
}

export enum Organizaton {
  IDF = "IDF",
  Hezbollah = "Hezbollah",
  Hamas = "Hamas",
  IRGC = "IRGC",
  Houthis = "Houthis",
}
export enum Location {
  NORTH = "IDF - North",
  SOUTH = "IDF - South",
  CENTER = "IDF - Center",
  WEST_BANK = "IDF - West Bank",
}
export interface IMissile {
  name: string;
  amount: number;
  speed: number;
}
export interface IDefense {
  name: string;
  amount: number;
  interceptSpeed: number;
}
