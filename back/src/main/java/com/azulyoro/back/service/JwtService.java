package com.azulyoro.back.service;

import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.EmpleadoResponseDto;
import com.azulyoro.back.mapper.Mapper;
import com.azulyoro.back.model.Empleado;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Autowired
    private Mapper<Empleado, RegisterRequest, EmpleadoResponseDto> empleadoMapper;

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public String getToken(Empleado empleado) {
        Map<String, Object> extraClaims = Map.of(
                "name", empleado.getNombre(),
                "lastName", empleado.getApellido(),
                "rol", empleado.getRol()
        );

        return getToken(extraClaims, empleado);
    }

    private String getToken(Map<String, Object> extraClaims, Empleado empleado) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(empleado.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, Empleado empleado) {
        final String email = getEmailFromToken(token);
        return (email.equals(empleado.getEmail()) && !isTokenExpired(token));
    }

    // quizas innecesaria
    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = getAllClaims(token);
        String role = claims.get("role", String.class);
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    private Claims getAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T getClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = getAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
}
