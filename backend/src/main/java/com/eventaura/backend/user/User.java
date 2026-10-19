package com.eventaura.backend.user;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String fullName;
 @Column(nullable=false,unique=true,length=160) private String email;
 @Column(nullable=false) private String password;
 private String phone, city, address;
 @Column(nullable=false) private String role="USER";
 private LocalDateTime createdAt;
 @PrePersist public void onCreate(){createdAt=LocalDateTime.now();if(role==null||role.isBlank())role="USER";}
 public Long getId(){return id;} public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;} public String getPhone(){return phone;} public void setPhone(String v){phone=v;} public String getCity(){return city;} public void setCity(String v){city=v;} public String getAddress(){return address;} public void setAddress(String v){address=v;} public String getRole(){return role;} public void setRole(String v){role=v;} public LocalDateTime getCreatedAt(){return createdAt;}
}
