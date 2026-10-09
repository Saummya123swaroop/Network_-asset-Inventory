package network_inventory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // =========================
                // LOGIN PAGE + STATIC FILES
                // =========================
                .requestMatchers(
                    "/",
                    "/logiin.html",
                    "/login",
                    "/script.js",
                    "/style.css",

                    // =========================
                    // REGISTER PAGE
                    // =========================
                    "/register.html",
                    "/register.css",
                    "/register.js",

                    // =========================
                    // ADD DEVICE
                    // =========================
                    "/add-device.html",
                    "/add-device.css",
                    "/add-device.js",

                    // =========================
                    // DASHBOARD
                    // =========================
                    "/dashboard.html",
                    "/dashboard.css",
                    "/dashboard.js",

                    // =========================
                    // EDIT DEVICE
                    // =========================
                    "/edit-device.html",
                    "/edit-device.css",
                    "/edit-device.js",

                    // =========================
                    // SEARCH DEVICE
                    // =========================
                    "/search-device.html",
                    "/search-device.css",
                    "/search-device.js",

                    // =========================
                    // IMAGES
                    // =========================
                    "/b1.png",
                    "/background.png",
                    "/dvc-logo.png",
                    "/Dvc logo.png"
                )
                .permitAll()

                // =========================
                // API
                // =========================
                .requestMatchers("/api/**").authenticated()

                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest().authenticated()
            )

            // =========================
            // LOGIN
            // =========================
            .formLogin(form -> form

                .loginPage("/logiin.html")

                .loginProcessingUrl("/login")

                .defaultSuccessUrl("/dashboard.html", true)

                .failureUrl("/logiin.html?error=true")

                .permitAll()
            )

            // =========================
            // LOGOUT
            // =========================
            .logout(logout -> logout

                .logoutSuccessUrl("/logiin.html")

                .permitAll()
            );

        return http.build();
    }
}