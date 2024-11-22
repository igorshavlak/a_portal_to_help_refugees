package org.project.helpportalrefugees.controller;


import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminPageController {
    @GetMapping("/dashboard")
    public ResponseEntity<Resource> getAdminPage(){
        Resource resource = new ClassPathResource("static/admin.html");
        if(!resource.exists()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(resource);
        }

    }
}
