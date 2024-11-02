package org.project.helpportalrefugees.controller;


import org.project.helpportalrefugees.model.Message;
import org.project.helpportalrefugees.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class ChatController {

     MessageService messageService;

     @Autowired
     public ChatController(MessageService messageService) {
         this.messageService = messageService;
     }

    @MessageMapping("/message")
    @SendTo("/topic/response")
    public void receiveMessage(@Payload Message message, Principal principal) {
         try {
             messageService.save(message, principal);
         }catch (Exception e) {
             System.out.println(e.getMessage());
         }
    }
}
