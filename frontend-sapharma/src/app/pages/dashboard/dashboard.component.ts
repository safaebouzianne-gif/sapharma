import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  private produitService = inject(ProduitService);
  private categorieService = inject(CategorieService);
  private platformId = inject(PLATFORM_ID);

  barChart: any;
  pieChart: any;

  // Data
  categoriesData: number[] = [];
  categoriesLabels: string[] = [];
  stockData: number[] = [0, 0, 0]; // [Bon, Faible, Rupture]

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDataAndDrawCharts();
    }
  }

  loadDataAndDrawCharts() {
    forkJoin({
      produits: this.produitService.getProduits(),
      categories: this.categorieService.getCategories()
    }).subscribe({
      next: (res) => {
        // Process Bar Chart (Products per category)
        this.categoriesLabels = res.categories.map(c => c.nom);
        this.categoriesData = res.categories.map(c => {
          return res.produits.filter(p => p.categorie?.id === c.id || p.categorie?.id === c.id).length;
        });

        // Process Pie Chart (Stock status)
        let bon = 0, faible = 0, rupture = 0;
        res.produits.forEach(p => {
          if (p.quantite === 0) rupture++;
          else if (p.quantite <= 10) faible++;
          else bon++;
        });
        this.stockData = [bon, faible, rupture];

        this.initBarChart();
        this.initPieChart();
      },
      error: () => {
        console.warn('Backend unavailable, using mock data for charts');
        this.categoriesLabels = ['Soins Visage', 'Compléments', 'Hygiène', 'Bébé'];
        this.categoriesData = [45, 30, 60, 25];
        this.stockData = [120, 25, 5];

        this.initBarChart();
        this.initPieChart();
      }
    });
  }

  initBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const ctx = this.barChartRef.nativeElement.getContext('2d');

    // Create blue/green gradient for bars
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#00CC99'); // Green
    gradient.addColorStop(1, '#0066FF'); // Blue

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.categoriesLabels,
        datasets: [{
          label: 'Produits par Catégorie',
          data: this.categoriesData,
          backgroundColor: gradient,
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  initPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Stock Normal', 'Stock Faible', 'Rupture'],
        datasets: [{
          data: this.stockData,
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
