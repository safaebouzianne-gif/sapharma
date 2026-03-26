package com.eclipse.main.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    private final JwtFilter jwtFilter;
    public SecurityConfig(JwtFilter jwtFilter) {
           this.jwtFilter = jwtFilter;

    }

    	@Bean
    	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    	    http.cors(cors -> {})
    	        .csrf(csrf -> csrf.disable())
    	        .authorizeHttpRequests(auth -> auth

    	            // AUTH & Preflight & Static Resources
    	            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    	            .requestMatchers("/api/auth/**").permitAll()
    	            .requestMatchers("/uploads/**").permitAll()
    	            // PRODUITS
    	            .requestMatchers(HttpMethod.GET, "/api/products/**")
    	                .hasAnyRole("ADMIN","EMPLOYE")

    	            .requestMatchers(HttpMethod.POST, "/api/products/**")
    	                .hasRole("ADMIN")

    	            .requestMatchers(HttpMethod.PUT, "/api/products/**")
    	                .hasRole("ADMIN")

    	            .requestMatchers(HttpMethod.DELETE, "/api/products/**")
    	                .hasRole("ADMIN")

    	            // CATEGORIES
    	            .requestMatchers(HttpMethod.GET, "/api/categories/**")
    	                .hasAnyRole("ADMIN","EMPLOYE")

    	            .requestMatchers(HttpMethod.POST, "/api/categories/**")
    	                .hasRole("ADMIN")

    	            .requestMatchers(HttpMethod.PUT, "/api/categories/**")
    	                .hasRole("ADMIN")

    	            .requestMatchers(HttpMethod.DELETE, "/api/categories/**")
    	                .hasRole("ADMIN")

    	            .anyRequest().authenticated()
    	        )

    	        .sessionManagement(session ->
    	            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    	        )

    	        .addFilterBefore(
    	            jwtFilter,
    	            UsernamePasswordAuthenticationFilter.class
    	        );

    	    return http.build();
    	}
   
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}