package org.project.helpportalrefugees.controller;

import org.project.helpportalrefugees.model.Refugee;
import org.project.helpportalrefugees.model.User;
import org.project.helpportalrefugees.DTO.UserDetailDTO;
import org.project.helpportalrefugees.model.Volunteer;
import org.project.helpportalrefugees.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
                                                  Principal principal){
        if (principal instanceof Authentication) {
            Authentication authentication = (Authentication) principal;
            GrantedAuthority authority = authentication.getAuthorities().stream().findFirst().orElse(null);
            assert authority != null;
            if (authority.toString().equals("ROLE_USER")) {
                if(userService.safeOrUpdateUser(new Refugee(dto.getFirstName(),dto.getLastName(),dto.getBirthDate(),dto.getPhone(),dto.getCity(),dto.getCountry()),principal)){
                    return ResponseEntity.ok("Дані успішно збереглися");
                } else {
                    return ResponseEntity.ok("Дані успішно оновилися");
                }

            } else if (authority.toString().equals("ROLE_VOLUNTEER")) {
               if(userService.safeOrUpdateUser(new Volunteer(dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhone(),  dto.getCity(), dto.getCountry(), dto.getSkillsAndExperience()),principal)){
                   return ResponseEntity.ok("Дані успішно збереглися");
               }else {
                   return ResponseEntity.ok("Дані успішно оновилися");
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

}
