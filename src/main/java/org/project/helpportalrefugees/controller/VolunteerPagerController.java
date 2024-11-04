package org.project.helpportalrefugees.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/volunteer")
public class VolunteerPagerController {

    @GetMapping("/home")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<Resource> getHome() throws IOException {
        Resource resource = new ClassPathResource("static/volunteer.html");
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }
}
