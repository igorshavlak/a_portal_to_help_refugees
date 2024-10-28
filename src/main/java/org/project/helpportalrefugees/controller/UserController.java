package org.project.helpportalrefugees.controller;

import org.springframework.context.annotation.Role;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.core.io.ClassPathResource;


@Controller
@RequestMapping("/user")
public class UserController {
    @GetMapping("/home")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> getUserPage(){
        Resource resource = new ClassPathResource("static/refugee.html");
        if(!resource.exists()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(resource);
        }
    }
}
