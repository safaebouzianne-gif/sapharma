package com.eclipse.main.config;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.eclipse.main.entity.Role;
import com.eclipse.main.entity.Utilisateur;
import com.eclipse.main.repository.*;
import java.time.LocalDate;

import com.eclipse.main.entity.Categorie;
import com.eclipse.main.entity.Produit;
//import com.eclipse.main.entity.Produit;


@Component
public class Datainitializer implements CommandLineRunner {

    

	private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;

    public Datainitializer(UtilisateurRepository userRepository, PasswordEncoder passwordEncoder,
			CategorieRepository categorieRepository,ProduitRepository produitRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.categorieRepository = categorieRepository;
		this.produitRepository = produitRepository;
	}

	@Override
   
    public void run(String... args) {

        createUserIfNotExists("admin", "admin123", Role.ADMIN);
        createUserIfNotExists("employe", "employe123", Role.EMPLOYE);

        createCategoriesIfNotExists();
        createProduitIfNotExists();

        System.out.println("✅ Default data checked");
    }

    private void createUserIfNotExists(String username, String password, Role role) {

        if (userRepository.findByUsername(username).isEmpty()) {

            Utilisateur user = new Utilisateur();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            

            userRepository.save(user);

            System.out.println("✔ User created: " + role.name());
        }
    }
    
    private void createCategoriesIfNotExists() {

        if(categorieRepository.count() == 0){

            Categorie c1 = new Categorie();
            c1.setNom("Cosmetique");
            c1.setDescription("soins aprofondie du corps");

            Categorie c2 = new Categorie();
            c2.setNom("Complement alimentaire");
            c2.setDescription("vitamine et gellule naturelle");

            Categorie c3 = new Categorie();
            c3.setNom("Bebe");
            c3.setDescription("produit pour nouveau né");

            categorieRepository.save(c1);
            categorieRepository.save(c2);
            categorieRepository.save(c3);

            System.out.println("✔ Categories created");
        }
    }

      private void createProduitIfNotExists() {

                if(produitRepository.count() == 0){

                    Categorie cosmetique = categorieRepository.findAll().get(0);
                    Categorie complement = categorieRepository.findAll().get(1);

                    Produit p1 = new Produit();
                    p1.setNom("Vitamine C");
                    p1.setDescription("Booster immunité");
                    p1.setPrix(80.0);
                    p1.setQuantite(10);
                    p1.setDateExpiration(LocalDate.of(2026,12,1));
                    p1.setImage("vitamine.jpg");
                    p1.setCategorie(complement);

                    Produit p2 = new Produit();
                    p2.setNom("Creme hydratante");
                    p2.setDescription("Pour peau seche");
                    p2.setPrix(120.0);
                    p2.setQuantite(0); // 🔥 rupture
                    p2.setDateExpiration(LocalDate.of(2027,5,10));
                    p2.setImage("creme.jpg");
                    p2.setCategorie(cosmetique);

                    produitRepository.save(p1);
                    produitRepository.save(p2);

                    System.out.println("✔ Produits created");
                }
            }
           
    
}