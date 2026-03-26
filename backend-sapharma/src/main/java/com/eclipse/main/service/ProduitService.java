package com.eclipse.main.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.eclipse.main.entity.Categorie;
import com.eclipse.main.entity.Produit;
import com.eclipse.main.repository.CategorieRepository;
import com.eclipse.main.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepo;
    private final CategorieRepository categorieRepository;
    @Value("${file.upload-dir}")
    private String uploadDir;
    public ProduitService(ProduitRepository produitRepo,CategorieRepository categorieRepository) {
		super();
		this.produitRepo = produitRepo;
		this.categorieRepository = categorieRepository;
	}
    
    public Produit ajouterAvecImage(Produit produit,
            MultipartFile file) throws IOException {

		if(file != null && !file.isEmpty()){
		
		String fileName = UUID.randomUUID()
		+ "_" + file.getOriginalFilename();
		
		Path path = Paths.get(uploadDir);
		if(!Files.exists(path)){
		Files.createDirectories(path);
		}
		
		Files.copy(file.getInputStream(),
		path.resolve(fileName),
		StandardCopyOption.REPLACE_EXISTING);
		
		produit.setImage(fileName);
		}
	
		return produitRepo.save(produit);
		}
	public Produit ajouter(Produit p){
        return produitRepo.save(p);
    }
	public Produit modifier(Long id, Produit nouveau) {

	    Produit existant = produitRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Produit introuvable"));

	    existant.setNom(nouveau.getNom());
	    existant.setDescription(nouveau.getDescription());
	    existant.setPrix(nouveau.getPrix());
	    existant.setQuantite(nouveau.getQuantite());
	    existant.setDateExpiration(nouveau.getDateExpiration());
	    existant.setImage(nouveau.getImage());
	    existant.setCategorie(nouveau.getCategorie());

	    return produitRepo.save(existant);
	}
	public Produit updateProduit(
	        Long id,
	        String nom,
	        String description,
	        Double prix,
	        Integer quantite,
	        LocalDate dateExpiration,
	        Long categorieId,
	        MultipartFile image) throws IOException {

	    Produit produit = produitRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

	    produit.setNom(nom);
	    produit.setDescription(description);
	    produit.setPrix(prix);
	    produit.setQuantite(quantite);
	    produit.setDateExpiration(dateExpiration);
	    Categorie categorie= categorieRepository.findById(categorieId)
	            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
	    produit.setCategorie(categorie);

	    // 🔥 Si nouvelle image
	    if (image != null && !image.isEmpty()) {

	        // Supprimer ancienne image
	        if (produit.getImage() != null) {
	            Path oldImagePath = Paths.get("uploads")
	                    .resolve(produit.getImage());
	            Files.deleteIfExists(oldImagePath);
	        }

	        // Sauvegarder nouvelle image
	        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

	        Path uploadPath = Paths.get("uploads");
	        Files.copy(image.getInputStream(),
	                uploadPath.resolve(fileName));

	        produit.setImage(fileName);
	    }

	    return produitRepo.save(produit);
	}
	public void supprimer(Long id){
	    produitRepo.deleteById(id);
	}
	public void deleteProduit(Long id) {

	    Produit produit = produitRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

	    // Supprimer image du dossier
	    if (produit.getImage() != null) {

	        Path imagePath = Paths.get("uploads")
	                .resolve(produit.getImage());

	        try {
	            Files.deleteIfExists(imagePath);
	        } catch (Exception e) {
	            System.out.println("Erreur suppression image");
	        }
	    }

	    produitRepo.delete(produit);
	}
    public List<Produit> getAll(){
        return produitRepo.findAll();
    }

    public List<Produit> rechercher(String nom){
        return produitRepo.findByNomContaining(nom);
    }

    public List<Produit> byCategorie(Long id){
        return produitRepo.findByCategorieId(id);
    }

    public List<Produit> rupture(){
        return produitRepo.findByQuantiteLessThanEqual(0);
    }

    public List<Produit> expires(){
        return produitRepo.findByDateExpirationBefore(LocalDate.now());
    }
    public long totalProduits(){
        return produitRepo.count();
    }

    public long totalRupture(){
        return produitRepo.findByQuantiteLessThanEqual(0).size();
    }

    public long totalExpires(){
        return produitRepo.findByDateExpirationBefore(
                java.time.LocalDate.now()).size();
    }
}