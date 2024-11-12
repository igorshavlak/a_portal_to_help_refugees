package org.project.helpportalrefugees.controller;

import org.project.helpportalrefugees.model.Notification;
import org.project.helpportalrefugees.service.NotificationService;
import org.project.helpportalrefugees.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    NotificationService notificationService;
    UserService userService;
    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }
    @GetMapping("/getNotification")
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        List<Notification> notifications = notificationService.getNotifications(userService.getIdByUsername(principal.getName()));
        return ResponseEntity.ok(notifications);
    }
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable int id) {
        boolean success = notificationService.markAsRead(id);
        if (success) {
            return ResponseEntity.ok("Повідомлення прочитано.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Помилка.");
        }
    }

}
