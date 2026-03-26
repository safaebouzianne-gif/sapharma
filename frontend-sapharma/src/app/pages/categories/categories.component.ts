import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { ProduitService } from '../../services/produit.service';
import { AuthService } from '../../services/auth.service';
import { Categorie } from '../../models/categorie.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categorieService = inject(CategorieService);
  produitService = inject(ProduitService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  categories: (Categorie & { count?: number })[] = [];

  // Modal State
  showModal = false;
  isEditMode = false;
  catForm!: FormGroup;
  currentCatId?: number;
  successMessage: string | null = null;
  loading = false;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.catForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  loadData() {
    forkJoin({
      cats: this.categorieService.getCategories(),
      prods: this.produitService.getProduits()
    }).subscribe({
      next: (res) => {
        this.categories = res.cats.map(c => ({
          ...c,
          count: res.prods.filter(p => p.categorie?.id === c.id).length
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        // Mock data
      }
    });
  }

  openModal(cat?: Categorie) {
    if (!this.authService.isAdmin()) return;
    // Always reset stale state before opening
    this.showModal = true;
    this.successMessage = null;
    this.loading = false;

    if (cat) {
      this.isEditMode = true;
      this.currentCatId = cat.id;
      this.catForm.patchValue({
        nom: cat.nom,
        description: cat.description
      });
    } else {
      this.isEditMode = false;
      this.currentCatId = undefined;
      this.catForm.patchValue({ nom: '', description: '' });
      this.catForm.markAsUntouched();
      this.catForm.markAsPristine();
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (this.catForm.invalid || this.loading) return;

    this.loading = true;
    this.successMessage = null;

    const observer = {
      next: (response: any) => {
        this.loading = false;
        this.successMessage = this.isEditMode ? "CATÉGORIE MODIFIÉE AVEC SUCCÈS" : "CATÉGORIE AJOUTÉE AVEC SUCCÈS";
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

    if (this.isEditMode && this.currentCatId) {
      this.categorieService.updateCategorie(this.currentCatId, this.catForm.value).subscribe(observer);
    } else {
      this.categorieService.createCategorie(this.catForm.value).subscribe(observer);
    }
  }

  deleteCategory(id?: number) {
    if (!id || !this.authService.isAdmin()) return;
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      // TRULY Optimistic update
      const originalCats = [...this.categories];
      this.categories = this.categories.filter(c => c.id !== id);
      this.cdr.detectChanges();

      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.categories = originalCats;
          this.cdr.detectChanges();
          const status = err.status ? `(Code: ${err.status})` : '';
          alert(`Erreur lors de la suppression ${status}.`);
        }
      });
    }
  }
}
