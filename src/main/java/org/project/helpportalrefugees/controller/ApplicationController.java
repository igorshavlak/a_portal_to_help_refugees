package org.project.helpportalrefugees.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.project.helpportalrefugees.http.ApiResponse;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.DTO.HelpRequestDTO;
import org.project.helpportalrefugees.model.Chat;
import org.project.helpportalrefugees.model.Notification;
import org.project.helpportalrefugees.service.ApplicationService;
import org.project.helpportalrefugees.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);
    ApplicationService applicationService;
    SimpMessagingTemplate messagingTemplate;
    UserService userService;

    @Autowired
    public ApplicationController(ApplicationService applicationService, SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.applicationService = applicationService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
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
            String receiver = userService.getUsernameById(applicationService.getRefugeeByApplicationId(requestId));
            applicationService.accept(requestId, principal);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notification",
                    new Notification("Волонтер : " + principal.getName() + "прийняв вашу заявку",false, userService.getIdByUsername(receiver), LocalDateTime.now()));
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
