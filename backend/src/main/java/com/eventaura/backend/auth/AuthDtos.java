package com.eventaura.backend.auth;
import jakarta.validation.constraints.*;
public final class AuthDtos {
 private AuthDtos(){}
 public record SignupRequest(@NotBlank @Size(max=100) String fullName,@NotBlank @Email @Size(max=160) String email,@NotBlank @Size(min=8,max=72) String password){}
 public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
 public record UserResponse(Long id,String fullName,String email,String phone,String city,String address,String role){}
}
