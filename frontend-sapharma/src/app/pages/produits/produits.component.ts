import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';
import { Produit } from '../../models/produit.model';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produitService = inject(ProduitService);
  categorieService = inject(CategorieService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  produits: Produit[] = [];
  categories: Categorie[] = [];

  // UI State
  viewMode: 'list' | 'card' = 'card';
  searchQuery = '';
  selectedCategoryId: number | '' = '';

  // Modal State
  showModal = false;
  isEditMode = false;
  productForm!: FormGroup;
  selectedFile: File | null = null;
  currentProductId?: number;
  successMessage: string | null = null;
  loading = false;

  ngOnInit() {
    this.loadData();
    this.initForm();
  }

  loadData() {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      dateExpiration: ['', Validators.required],
      categorieId: ['', Validators.required],
      image: ['']
    });
  }

  get filteredProduits() {
    return this.produits.filter(p => {
      const matchName = p.nom.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchCat = this.selectedCategoryId === '' ? true : p.categorie?.id === Number(this.selectedCategoryId);
      return matchName && matchCat;
    });
  }

  isExpired(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  isOutOfStock(qte: number): boolean {
    return qte <= 0;
  }

  openModal(produit?: Produit) {
    if (!this.authService.isAdmin()) return;
    // Always reset stale state before opening
    this.showModal = true;
    this.selectedFile = null;
    this.successMessage = null;
    this.loading = false;

    if (produit) {
      this.isEditMode = true;
      this.currentProductId = produit.id;
      this.productForm.patchValue({
        nom: produit.nom,
        description: produit.description,
        prix: produit.prix,
        quantite: produit.quantite,
        dateExpiration: produit.dateExpiration ? new Date(produit.dateExpiration).toISOString().split('T')[0] : '',
        categorieId: produit.categorie?.id || ''
      });
    } else {
      this.isEditMode = false;
      this.currentProductId = undefined;
      // Use patchValue with defaults instead of reset() to avoid null values
      this.productForm.patchValue({
        nom: '',
        description: '',
        prix: 0,
        quantite: 0,
        dateExpiration: '',
        categorieId: ''
      });
      this.productForm.markAsUntouched();
      this.productForm.markAsPristine();
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveProduct() {
    if (this.productForm.invalid || this.loading) return;

    this.loading = true;
    this.successMessage = null;

    const formValues = this.productForm.value;
    const fd = new FormData();
    fd.append('nom', formValues.nom);
    fd.append('description', formValues.description);
    fd.append('prix', formValues.prix.toString());
    fd.append('quantite', formValues.quantite.toString());
    fd.append('dateExpiration', formValues.dateExpiration);
    fd.append('categorieId', formValues.categorieId.toString());

    if (this.selectedFile) {
      fd.append('image', this.selectedFile);
    }

    const observer = {
      next: (response: any) => {
        this.loading = false;
        this.successMessage = this.isEditMode ? "PRODUIT MODIFIÉ AVEC SUCCÈS" : "PRODUIT AJOUTÉ AVEC SUCCÈS";
        this.cdr.detectChanges();

        setTimeout(() => {
          this.showModal = false;
          this.successMessage = null;
          this.loadData();
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        alert("Erreur lors de l'enregistrement.");
      }
    };

    if (this.isEditMode && this.currentProductId) {
      this.produitService.updateProduit(this.currentProductId, fd).subscribe(observer);
    } else {
      this.produitService.createProduit(fd).subscribe(observer);
    }
  }

  deleteProduct(id?: number) {
    if (!id || !this.authService.isAdmin()) return;
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      // TRULY Optimistic update: remove immediately from local list
      const originalProduits = [...this.produits];
      this.produits = this.produits.filter(p => p.id !== id);
      this.cdr.detectChanges();

      this.produitService.deleteProduit(id).subscribe({
        next: () => {
          // Success, keep the filtered list and reload to be sure
          this.loadData();
        },
        error: (err) => {
          console.error('Delete error:', err);
          // Rollback on error
          this.produits = originalProduits;
          this.cdr.detectChanges();
          const status = err.status ? `(Code: ${err.status})` : '';
          alert(`Erreur lors de la suppression ${status}. Vérifiez si le produit n'est pas lié à d'autres données.`);
        }
      });
    }
  }
}
