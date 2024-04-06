export interface IOpération {
  Date: Date;
  User: String;
  Détail: string;
  Temps: number;
  Pièces: {
    Désignation: string;
    Quantité: number;
    Prix: number;
  };
}
