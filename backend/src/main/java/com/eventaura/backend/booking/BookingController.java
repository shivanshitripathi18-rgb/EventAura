package com.eventaura.backend.booking;
import com.eventaura.backend.common.SessionUser;import com.eventaura.backend.user.User;import jakarta.servlet.http.HttpServletRequest;import jakarta.validation.Valid;import org.springframework.http.HttpStatus;import org.springframework.web.bind.annotation.*;import java.util.List;
@RestController @RequestMapping("/api/bookings")
public class BookingController {
 private final BookingRepository bookings;private final SessionUser session;public BookingController(BookingRepository b,SessionUser s){bookings=b;session=s;}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Booking create(@Valid @RequestBody Booking b,HttpServletRequest req){User u=session.require(req);b.setUserId(u.getId());b.setStatus("PENDING");return bookings.save(b);}
 @GetMapping public List<Booking> mine(HttpServletRequest req){return bookings.findByUserIdOrderByCreatedAtDesc(session.require(req).getId());}
}
