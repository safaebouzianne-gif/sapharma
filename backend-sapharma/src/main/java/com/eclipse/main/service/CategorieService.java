
package com.eclipse.main.service;
import org.springframework.stereotype.Service;

import com.eclipse.main.entity.Categorie;
import com.eclipse.main.repository.CategorieRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }
    
   //ajouter
    public Categorie addCategorie(Categorie categorie){
        return categorieRepository.save(categorie);
    }
    // modifier
    public Categorie updateCategorie(Long id, Categorie categorieDetails){

        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categorie non trouvée"));

        categorie.setNom(categorieDetails.getNom());
        categorie.setDescription(categorieDetails.getDescription());

        return categorieRepository.save(categorie);
    }

    // supprimer
    public void deleteCategorie(Long id){
        categorieRepository.deleteById(id);
    }
    //affichage
    public List<Categorie> getAllCategories(){
        return categorieRepository.findAll();
    }
}