package org.project.helpportalrefugees.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.project.helpportalrefugees.http.ApiResponse;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.DTO.HelpRequestDTO;
import org.project.helpportalrefugees.model.Chat;
import org.project.helpportalrefugees.model.Notification;
import org.project.helpportalrefugees.service.ApplicationService;
import org.project.helpportalrefugees.service.NotificationService;
import org.project.helpportalrefugees.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.BindingResult;
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
    private final NotificationService notificationService;
    ApplicationService applicationService;
    SimpMessagingTemplate messagingTemplate;
    UserService userService;

    @Autowired
    public ApplicationController(ApplicationService applicationService, SimpMessagingTemplate messagingTemplate, UserService userService, NotificationService notificationService) {
        this.applicationService = applicationService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    @PostMapping("/save")
    public ResponseEntity<?> save(@Validated @ModelAttribute HelpRequestDTO helpRequestDTO, BindingResult bindingResult, Principal principal) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(400).body(
                    new ApiResponse(false, "Помилка валідації: " + bindingResult.getAllErrors().get(0).getDefaultMessage())
            );
        }
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
    public ResponseEntity<String> accept(@PathVariable int requestId, Principal principal) {
        try {
            String receiver = userService.getUsernameById(applicationService.getRefugeeByApplicationId(requestId));
            applicationService.accept(requestId, principal);
            Notification notification =  new Notification("Волонтер : " + principal.getName() + "прийняв вашу заявку. Номер заявки №" + requestId,false, userService.getIdByUsername(receiver), LocalDateTime.now(), "accept");
            notificationService.createNotification(notification);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notifications",
                   notification);
            return ResponseEntity.status(200).body("Заявка прийнята");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/getConsiderationApplications")
    public ResponseEntity<List<Application>> getConsiderationApplications(){
        try {
            return ResponseEntity.status(200).body(applicationService.getConsiderationApplications());
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<String> approveApplication(@PathVariable int requestId) {
        try {
            String receiver = userService.getUsernameById(applicationService.getRefugeeByApplicationId(requestId));
            Notification notification = new Notification("Ваша заявка була підтверджена. Номер заявки №" + requestId,false, userService.getIdByUsername(receiver), LocalDateTime.now(),"confirm");
            applicationService.approve(requestId);
            notificationService.createNotification(notification);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notifications",
                    notification );
            return ResponseEntity.status(200).body("Заявка підтверджена");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<String> rejectApplication(@PathVariable int requestId) {
        try {

            String receiver = userService.getUsernameById(applicationService.getRefugeeByApplicationId(requestId));
            applicationService.reject(requestId);
            Notification notification = new Notification("Ваша заявка була відхилина. Номер заявки №" + requestId,false, userService.getIdByUsername(receiver), LocalDateTime.now(),"reject");
            notificationService.createNotification(notification);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notifications",
                    notification);
            return ResponseEntity.status(200).body("Заявка відхилена");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/complete/{requestId}")
    public ResponseEntity<String> completeApplication(@PathVariable int requestId, Principal principal) {
        try {
            String receiver = userService.getUsernameById(applicationService.getRefugeeByApplicationId(requestId));
            Notification notification = new Notification("Волонтер : " + principal.getName() + " відправив запит для завершення заявка. Номер заявки №" + requestId,false, userService.getIdByUsername(receiver), LocalDateTime.now(),"finish");
            notificationService.createNotification(notification);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notifications",
                    notification );
            return ResponseEntity.status(200).body("Запит відпралено");
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/{requestId}/acceptFinishApplication")
    public ResponseEntity<String> acceptFinishApplication(@PathVariable int requestId) {
        try{
            applicationService.finishApplication(requestId);
            return ResponseEntity.ok("заявка оброблена");
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/{requestId}/rejectFinishApplication")
    public ResponseEntity<String> rejectFinishApplication(@PathVariable int requestId, Principal principal) {
        try{
            String receiver = userService.getUsernameById(applicationService.getVolunteerByApplicationId(requestId));
            Notification notification = new Notification("Біженець : " + principal.getName() + " відхилив завершення заявки. Номер заявки №" + requestId,false, userService.getIdByUsername(receiver), LocalDateTime.now(),"reject");
            notificationService.createNotification(notification);
            messagingTemplate.convertAndSendToUser(receiver, "/queue/notifications",
                    notification );
            return ResponseEntity.ok("заявка оброблена");
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
