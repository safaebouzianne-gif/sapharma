package com.eclipse.main.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import com.eclipse.main.entity.Categorie;
import com.eclipse.main.entity.Produit;
import com.eclipse.main.service.ProduitService;
import com.eclipse.main.service.FileStorageService;

import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProduitController {

    private final ProduitService produitService;
    private final FileStorageService fileStorageService;

    
    // =========================
    // AJOUT PRODUIT AVEC IMAGE
    // =========================

    public ProduitController(ProduitService produitService, FileStorageService fileStorageService) {
		super();
		this.produitService = produitService;
		this.fileStorageService = fileStorageService;
	}

	@PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Produit ajouterAvecImage(

            @RequestParam String nom,
            @RequestParam String description,
            @RequestParam Double prix,
            @RequestParam int quantite,
            @RequestParam String dateExpiration,
            @RequestParam Long categorieId,
            @RequestParam("image") MultipartFile image

    ) throws Exception {

        String fileName = fileStorageService.save(image);

        Produit p = new Produit();
        p.setNom(nom);
        p.setDescription(description);
        p.setPrix(prix);
        p.setQuantite(quantite);
        p.setDateExpiration(LocalDate.parse(dateExpiration));
        p.setImage(fileName);

        Categorie c = new Categorie();
        c.setId(categorieId);
        p.setCategorie(c);

        return produitService.ajouter(p);
    }

   
    // =========================
    // UPDATE PRODUIT
    // =========================

    @PutMapping("/upload/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduit(

            @PathVariable Long id,
            @RequestParam String nom,
            @RequestParam String description,
            @RequestParam Double prix,
            @RequestParam Integer quantite,
            @RequestParam String dateExpiration,
            @RequestParam Long categorieId,
            @RequestParam(required = false) MultipartFile image

    ) throws IOException {

        Produit updated = produitService.updateProduit(
                id,
                nom,
                description,
                prix,
                quantite,
                LocalDate.parse(dateExpiration),
                categorieId,
                image
        );

        return ResponseEntity.ok(updated);
    }

    // =========================
    // DELETE PRODUIT
    // =========================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduit(@PathVariable Long id) {

        produitService.deleteProduit(id);

        return ResponseEntity.ok("Produit supprimé avec succès");
    }

    // =========================
    // GET ALL PRODUITS
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYE')")
    @GetMapping
    public List<Produit> getAll(){
        return produitService.getAll();
    }

    // =========================
    // SEARCH PRODUIT
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYE')")
    @GetMapping("/search")
    public List<Produit> search(@RequestParam String nom){
        return produitService.rechercher(nom);
    }

    // =========================
    // PRODUITS PAR CATEGORIE
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYE')")
    @GetMapping("/categorie/{id}")
    public List<Produit> byCategorie(@PathVariable Long id){
        return produitService.byCategorie(id);
    }

    // =========================
    // PRODUITS EN RUPTURE
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYE')")
    @GetMapping("/rupture")
    public List<Produit> rupture(){
        return produitService.rupture();
    }

    // =========================
    // PRODUITS EXPIRES
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYE')")
    @GetMapping("/expires")
    public List<Produit> expires(){
        return produitService.expires();
    }

}