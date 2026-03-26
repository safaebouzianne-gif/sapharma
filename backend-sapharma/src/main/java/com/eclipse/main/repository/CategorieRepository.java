package com.eclipse.main.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.eclipse.main.entity.Categorie;


public interface CategorieRepository 
        extends JpaRepository<Categorie, Long> {

    boolean existsByNom(String nom);
}
