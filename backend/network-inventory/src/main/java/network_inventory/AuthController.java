package network_inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ==========================================
    // REGISTER USER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        // Check username
        if (user.getUsername() == null ||
            user.getUsername().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Username is required.");
        }


        // Check password
        if (user.getPassword() == null ||
            user.getPassword().length() < 6) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must be at least 6 characters.");
        }


        String username =
                user.getUsername().trim();


        // Check if username already exists
        if (userRepository
                .findByUsername(username)
                .isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists.");
        }


        // Create new user
        User newUser = new User();

        newUser.setUsername(username);

        // Encrypt password
        newUser.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        // Give user ADMIN role
        newUser.setRole("ADMIN");


        // Save to MySQL
        userRepository.save(newUser);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Registration successful.");
    }
}