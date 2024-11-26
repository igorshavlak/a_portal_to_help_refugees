package org.project.helpportalrefugees.controller;

import org.project.helpportalrefugees.DTO.RegistrationRequestDTO;
import org.project.helpportalrefugees.model.Refugee;
import org.project.helpportalrefugees.model.User;
import org.project.helpportalrefugees.DTO.UserDetailDTO;
import org.project.helpportalrefugees.model.Volunteer;
import org.project.helpportalrefugees.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Base64;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {

    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;

    }

    @PostMapping("/updateVolunteerDetails")
    public ResponseEntity<String> saveVolunteerDetails(@Validated @RequestBody UserDetailDTO dto,
                                                  Principal principal) {
        if (principal instanceof Authentication) {
            Authentication authentication = (Authentication) principal;
            GrantedAuthority authority = authentication.getAuthorities().stream().findFirst().orElse(null);
            assert authority != null;

            byte[] imageBytes = null;
            String profileImageBase64 = dto.getProfileImage();
            if (profileImageBase64 != null && !profileImageBase64.isEmpty()) {

                try {
                    imageBytes = Base64.getDecoder().decode(profileImageBase64);
                    if (imageBytes.length > 5 * 1024 * 1024) { // 5MB
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Файл дуже великий");
                    }
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Невірний формат зображення");
                }

                if (authority.toString().equals("ROLE_USER")) {
                    if (userService.safeOrUpdateUser(new Refugee(dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhone(), dto.getCity(), dto.getCountry(), imageBytes), principal)) {
                        return ResponseEntity.ok("Дані успішно збереглися");
                    } else {
                        return ResponseEntity.ok("Дані успішно оновилися");
                    }

                } else if (authority.toString().equals("ROLE_VOLUNTEER")) {
                    if (userService.safeOrUpdateUser(new Volunteer(dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhone(), dto.getCity(), dto.getCountry(), dto.getSkillsAndExperience(), imageBytes), principal)) {
                        return ResponseEntity.ok("Дані успішно збереглися");
                    } else {
                        return ResponseEntity.ok("Дані успішно оновилися");
                    }
                }
            }
            }
            return ResponseEntity.status(500).build();

    }
    @GetMapping("/getUser")
    public ResponseEntity<String> getAuthenticatedUser(Principal principal){
        try {
            return ResponseEntity.ok(principal.getName());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/getUserDetails")
    public ResponseEntity<User> getAuthenticatedUserDetails(Principal principal){
        try {
            Authentication authentication = (Authentication) principal;
            GrantedAuthority authority = authentication.getAuthorities().stream().findFirst().orElse(null);
            assert authority != null;
            User user = userService.getUserDetails(principal,authority.toString());
            return ResponseEntity.ok(user);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationRequestDTO registrationRequestDTO, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Помилки валідації: " + bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        try {
            userService.register(registrationRequestDTO);
            return ResponseEntity.ok("Користувач зареєстрований");
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

    }

}
