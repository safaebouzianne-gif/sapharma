import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  produitService = inject(ProduitService);
  categorieService = inject(CategorieService);

  searchQuery = '';

  // Quick Stats
  totalProduits = 0;
  totalCategories = 0;
  produitsExpirant = 0;
  produitsRupture = 0;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        this.totalProduits = produits.length;
        this.produitsRupture = produits.filter(p => p.quantite === 0).length;

        const today = new Date();
        this.produitsExpirant = produits.filter(p => {
          if (!p.dateExpiration) return false;
          const expDate = new Date(p.dateExpiration);
          return expDate < today;
        }).length;
      },
      error: () => {
        // Silently fail if backend is down during development
        console.warn('Could not load products for stats');
      }
    });

    this.categorieService.getCategories().subscribe({
      next: (cats) => {
        this.totalCategories = cats.length;
      },
      error: () => {
        console.warn('Could not load categories for stats');
      }
    });
  }

  onSearch() {
    // Optionally trigger a global state update or redirect
    console.log('Searching for:', this.searchQuery);
  }
}
