# EventAura Backend
Java 21, Spring Boot 3.5.3, Maven, MySQL. Payment is intentionally excluded.

1. Open this folder in IntelliJ as a project and select JDK 21.
2. Start MySQL and change `spring.datasource.password=CHANGE_ME` in `src/main/resources/application.properties` to your local MySQL password.
3. Reload Maven projects, then run `EventAuraApplication`.
4. The source ZIP does not include Maven Wrapper scripts; use IntelliJ Maven panel or installed Maven.

Endpoints:
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET/PUT `/api/profile`
- POST/GET `/api/bookings`
- POST `/api/contact`

Session-based login: frontend fetch calls should use `credentials: "include"`. CORS allows localhost ports 5500, 3000, and 3002. Tables are created/updated by Hibernate. Passwords are BCrypt hashed. This is a development starter; secure it further before production.

Signup JSON: `{"fullName":"Test User","email":"test@example.com","password":"password123"}`
Booking JSON: `{"fullName":"Test User","email":"test@example.com","phone":"9876543210","eventType":"Birthday","eventDate":"2027-01-15","guests":50,"city":"Ayodhya","venue":"Example Hall","budget":50000,"packageName":"Premium","details":"Decor and catering"}`
