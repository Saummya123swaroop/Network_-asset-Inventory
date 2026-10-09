package network_inventory;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {

                User user = new User();

                user.setUsername("admin");

                user.setPassword(
                    passwordEncoder.encode("admin123")
                );

                user.setRole("ADMIN");

                userRepository.save(user);

                System.out.println("=================================");
                System.out.println("TEST USER CREATED");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("Role: ADMIN");
                System.out.println("=================================");

            }
        };
    }
}