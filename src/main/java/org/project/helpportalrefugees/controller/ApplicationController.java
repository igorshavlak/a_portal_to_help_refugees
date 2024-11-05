package org.project.helpportalrefugees.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.project.helpportalrefugees.http.ApiResponse;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.model.HelpRequestDTO;
import org.project.helpportalrefugees.model.Volunteer;
import org.project.helpportalrefugees.service.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);
    ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@Validated @RequestBody HelpRequestDTO helpRequestDTO, Principal principal) {
        try {
            applicationService.save(helpRequestDTO, principal);
            return ResponseEntity.status(201).body(
                    new ApiResponse(true, "Запит створено успішно")
            );
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(400).body(
                    new ApiResponse(false, "Невірний формат додаткових даних")
            );
        } catch (Exception e) {
            System.out.println("error " + e.getMessage());
            return ResponseEntity.status(500).body(
                    new ApiResponse(false, "Сталася помилка при створенні запиту")
            );
        }
    }

    @GetMapping("/getUserApplications")
    public ResponseEntity<List<Application>> getUserApplications(Principal principal) {
        try {
            List<Application> applications = applicationService.getUserApplications(principal);
            return ResponseEntity.status(200).body(applications);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("error " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }


    @PostMapping("/getApplicationsByCategories")
    public ResponseEntity<List<Application>> getApplicationsByCategories(@RequestBody List<String> categoryList) {
        try {
            List<Application> applications = applicationService.getApplicationsByCategories(categoryList);
            return ResponseEntity.status(200).body(applications);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<?> accept(@PathVariable int requestId, Principal principal) {
        try {
            applicationService.accept(requestId, principal);
            return ResponseEntity.status(201).body(
                    new ApiResponse(true, "Заявка прийнята")
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ApiResponse(false, "Сталася помилка")
            );
        }
    }

}
