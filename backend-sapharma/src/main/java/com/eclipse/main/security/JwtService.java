package com.eclipse.main.security;

import java.util.Date;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;


@Service
public class JwtService {
		private final String SECRET =
		        "mysecretkeymysecretkeymysecretkey12345"; 
		
		private Key getSignKey() {
		    return Keys.hmacShaKeyFor(SECRET.getBytes());
		}
		
		public String generateToken(String username, String role) {
		
		    return Jwts.builder()
		            .setSubject(username)
		            .claim("role", role)
		            .setIssuedAt(new Date())
		            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
		            .signWith(getSignKey())
		            .compact();
		}

	    public String extractUsername(String token){
	        return Jwts.parserBuilder()
	                .setSigningKey(getSignKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .getSubject();
	    }

	    public String extractRole(String token){
	        return Jwts.parserBuilder()
	                .setSigningKey(getSignKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .get("role", String.class);
	    }
	
}