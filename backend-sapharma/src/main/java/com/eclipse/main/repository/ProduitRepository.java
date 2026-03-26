package com.eclipse.main.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eclipse.main.entity.Produit;

public interface ProduitRepository 
        extends JpaRepository<Produit, Long> {

    List<Produit> findByNomContaining(String nom);

    List<Produit> findByCategorieId(Long id);

    List<Produit> findByQuantiteLessThanEqual(int q);

    List<Produit> findByDateExpirationBefore(LocalDate date);
}