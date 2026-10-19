package com.eventaura.backend.contact;
import jakarta.validation.Valid;import org.springframework.http.HttpStatus;import org.springframework.web.bind.annotation.*;import java.util.Map;
@RestController @RequestMapping("/api/contact") public class ContactController {private final ContactMessageRepository messages;public ContactController(ContactMessageRepository m){messages=m;}@PostMapping @ResponseStatus(HttpStatus.CREATED) public Map<String,String> send(@Valid @RequestBody ContactMessage m){messages.save(m);return Map.of("message","Your message has been submitted successfully");}}
