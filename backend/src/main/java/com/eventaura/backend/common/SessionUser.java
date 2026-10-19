package com.eventaura.backend.common;
import com.eventaura.backend.user.*;
import jakarta.servlet.http.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
@Component
public class SessionUser {
 private final UserRepository users; public SessionUser(UserRepository users){this.users=users;}
 public User require(HttpServletRequest req){HttpSession s=req.getSession(false);if(s==null||!(s.getAttribute("userId") instanceof Long id))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please login first");return users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please login first"));}
}
