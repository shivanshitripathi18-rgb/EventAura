package com.eventaura.backend.profile;
import com.eventaura.backend.auth.*;import com.eventaura.backend.common.SessionUser;import com.eventaura.backend.user.*;
import jakarta.servlet.http.HttpServletRequest;import jakarta.validation.Valid;import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;import org.springframework.web.bind.annotation.*;import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/profile")
public class ProfileController {
 private final SessionUser session;private final AuthService auth;private final UserRepository users;
 public ProfileController(SessionUser s,AuthService a,UserRepository u){session=s;auth=a;users=u;}
 public record ProfileUpdate(@NotBlank @Size(max=100) String fullName,@NotBlank @Email @Size(max=160) String email,String phone,String city,String address){}
 @GetMapping public AuthDtos.UserResponse get(HttpServletRequest req){return auth.response(session.require(req));}
 @PutMapping public AuthDtos.UserResponse update(@Valid @RequestBody ProfileUpdate b,HttpServletRequest req){User u=session.require(req);if(!u.getEmail().equalsIgnoreCase(b.email().trim()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email change is not supported in this version");u.setFullName(b.fullName().trim());u.setPhone(b.phone());u.setCity(b.city());u.setAddress(b.address());return auth.response(users.save(u));}
}
