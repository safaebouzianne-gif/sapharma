package com.eclipse.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eclipse.main.entity.Utilisateur;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur,Long>{

    Optional<Utilisateur> findByUsername(String username);
}