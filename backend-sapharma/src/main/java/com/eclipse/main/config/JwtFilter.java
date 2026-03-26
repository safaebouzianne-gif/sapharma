package com.eclipse.main.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.eclipse.main.security.JwtService;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
		super();
		this.jwtService = jwtService;
	}

	@Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

		    String path = request.getServletPath();
	
		    // Autoriser les images sans JWT
		    if (path.startsWith("/api/products/uploads")) {
		        filterChain.doFilter(request, response);
		        return;
		    }


		    final String authHeader = request.getHeader("Authorization");

		    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
		        filterChain.doFilter(request, response);
		        return;
		    }

		    String token = authHeader.substring(7);

		    String username = jwtService.extractUsername(token);
		    String role = jwtService.extractRole(token);

		    if (username != null) {

		        SimpleGrantedAuthority authority =
		                new SimpleGrantedAuthority("ROLE_" + role);

		        UsernamePasswordAuthenticationToken authToken =
		                new UsernamePasswordAuthenticationToken(
		                        username,
		                        null,
		                        List.of(authority)
		                );

		        SecurityContextHolder.getContext()
		                .setAuthentication(authToken);
		    }

		    filterChain.doFilter(request, response);
		}
    }
