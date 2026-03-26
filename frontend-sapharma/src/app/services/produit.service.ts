import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/products';

  constructor() { }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}?t=${Date.now()}`);
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduit(formData: FormData): Observable<Produit> {
    // Note: When sending FormData, do not set Content-Type header. Angular sets it automatically to multipart/form-data with boundary.
    return this.http.post<Produit>(`${this.apiUrl}/upload`, formData);
  }

  updateProduit(id: number, formData: FormData): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/upload/${id}`, formData);
  }

  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  searchProduits(nom: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search?nom=${nom}`);
  }

  getProduitsByCategorie(id: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/categorie/${id}`);
  }

  getProduitsRupture(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/rupture`);
  }

  getProduitsExpires(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/expires`);
  }
}
