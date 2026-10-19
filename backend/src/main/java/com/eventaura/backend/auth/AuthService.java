package com.eventaura.backend.auth;
import com.eventaura.backend.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service
public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder;
 public AuthService(UserRepository users,PasswordEncoder encoder){this.users=users;this.encoder=encoder;}
 public User signup(AuthDtos.SignupRequest r){String e=r.email().trim().toLowerCase();if(users.existsByEmailIgnoreCase(e))throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already registered");User u=new User();u.setFullName(r.fullName().trim());u.setEmail(e);u.setPassword(encoder.encode(r.password()));u.setRole("USER");return users.save(u);}
 public User login(AuthDtos.LoginRequest r){User u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));if(!encoder.matches(r.password(),u.getPassword()))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");return u;}
 public AuthDtos.UserResponse response(User u){return new AuthDtos.UserResponse(u.getId(),u.getFullName(),u.getEmail(),u.getPhone(),u.getCity(),u.getAddress(),u.getRole());}
}
