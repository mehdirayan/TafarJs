export type User = {
  _id: string;
  nom: string;
};

export type Activité = {
  _id: string;
  désignation: string;
};

export type Client = {
  _id?: string;
  nom: string;
  activité: string;
  adresse: string;
  rc: string;
  ai: string;
  nif: string;
  nis: string;
  contacts: Contact[]
  __v?: number
}

export type Contact = {
  nom: string;
  téléphone: string;
  email: string;
}


export type Equipement = {
  _id?: string;
  idClient: string | null;
  nomClient?: string;
  désignation: string;
  marque: string;
  modele: string;
  numSerie: string;
}

export type DT = {
  _id?:string
  date: Date
  idClient?:string | null
  idEquipement: string
  panne: string
  état: eEtat
  test: eTest
  urgence: boolean
  opérations: Opération[]
  observation: string
  class?:string
  __v?:number
}

export type Opération = {
  date:Date
  user:string
  lieu:string
  détail:string
  temps:number | null
  pièces:Pièce[]

}

export type Pièce = {
  désignation:string
  référence:string
  quantité:number
  prix:number
}

export enum eEtat {
  nonCommence = "Non Commencée",
  enCours = "En Cours",
  achevée = "Achevée",
  livré="livré",
  terminée = "Terminée"

}
export enum eTest {
  pasFini = "Pas Fini",
  abandonée="Pas réparable",
  aTester="A tester chez le client",
  ok = "Test OK"
}

export type Livraison = {
  _id?:string
  date:Date
  client:string
  dts:DT[]
  lien:string
}
