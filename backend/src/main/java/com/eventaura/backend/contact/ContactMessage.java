package com.eventaura.backend.contact;
import jakarta.persistence.*;import jakarta.validation.constraints.*;import java.time.LocalDateTime;
@Entity @Table(name="contact_messages")
public class ContactMessage {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;@NotBlank @Column(nullable=false) private String name;@NotBlank @Email @Column(nullable=false) private String email;private String phone;@NotBlank @Column(nullable=false,length=200) private String subject;@NotBlank @Column(nullable=false,length=4000) private String message;private LocalDateTime createdAt;
 @PrePersist public void onCreate(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;}public String getName(){return name;}public void setName(String v){name=v;}public String getEmail(){return email;}public void setEmail(String v){email=v;}public String getPhone(){return phone;}public void setPhone(String v){phone=v;}public String getSubject(){return subject;}public void setSubject(String v){subject=v;}public String getMessage(){return message;}public void setMessage(String v){message=v;}public LocalDateTime getCreatedAt(){return createdAt;}
}
