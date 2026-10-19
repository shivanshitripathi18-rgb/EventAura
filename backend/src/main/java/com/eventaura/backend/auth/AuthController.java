package com.eventaura.backend.auth;
import com.eventaura.backend.user.User;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService service; public AuthController(AuthService service){this.service=service;}
 @PostMapping("/signup") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> signup(@Valid @RequestBody AuthDtos.SignupRequest b,HttpServletRequest req){User u=service.signup(b);req.getSession(true).setAttribute("userId",u.getId());return Map.of("message","Account created successfully","user",service.response(u));}
 @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody AuthDtos.LoginRequest b,HttpServletRequest req){User u=service.login(b);req.getSession(true).setAttribute("userId",u.getId());return Map.of("message","Login successful","user",service.response(u));}
 @PostMapping("/logout") public Map<String,String> logout(HttpServletRequest req){HttpSession s=req.getSession(false);if(s!=null)s.invalidate();return Map.of("message","Logged out successfully");}
}
