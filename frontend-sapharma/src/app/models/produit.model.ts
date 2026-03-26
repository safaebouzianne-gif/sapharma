import { Categorie } from './categorie.model';

export interface Produit {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  dateExpiration: string; // From backend
  image?: string;
  categorie?: Categorie; // Backend returns full category object
}
