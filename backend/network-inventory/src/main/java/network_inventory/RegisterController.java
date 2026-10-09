package network_inventory;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RegisterController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        // Check empty fields
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Username is required"));
        }

        if (password == null || password.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        username = username.trim();

        // Check whether username already exists
        if (userRepository.findByUsername(username).isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Username already exists"));
        }

        // Create new user
        User user = new User();

        user.setUsername(username);

        // NEVER store the password as plain text
        user.setPassword(
                passwordEncoder.encode(password)
        );

        // New registered users get VIEWER role
        user.setRole("VIEWER");

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Registration successful"
                )
        );
    }
}
