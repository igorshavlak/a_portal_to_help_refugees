package org.project.helpportalrefugees.controller;


import org.project.helpportalrefugees.model.Chat;
import org.project.helpportalrefugees.service.ChatService;
import org.project.helpportalrefugees.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Objects;

@RestController
@RequestMapping("/chat")
public class ChatController {


    ChatService chatService;
    UserService userService;
    SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    @MessageMapping("/sendMessage/{chatId}")
    public void sendMessage(@DestinationVariable int chatId, @Payload String message, Principal principal) {
        try {
            chatService.saveChatMessage(chatId, message, principal);
            messagingTemplate.convertAndSendToUser(Objects.requireNonNull(determineReceiver(chatId, principal.getName())), "/queue/messages", message);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }
    @GetMapping("/history/{applicationId}")
    public ResponseEntity<Chat> getChatHistory(@PathVariable int applicationId, Principal principal) {
        Chat chat;
        try {
            chat = chatService.getChatHistory(applicationId);
        if(chat.getMessages().isEmpty()){
            return ResponseEntity.ok(new Chat(chat.getId(), null));
        }
        return ResponseEntity.ok(new Chat(chat.getId(), chat.getMessages()));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    private String determineReceiver(int chatId, String sender) {
        Chat chat = chatService.getChatById(chatId);
        if (chat == null) {
            return null;
        }
        String refugee = userService.getUsernameById(chat.getRefugeeId());
        String volunteer = userService.getUsernameById(chat.getVolunteerId());

        if (refugee.equals(sender)) {
            return volunteer;
        } else if (volunteer.equals(sender)) {
            return refugee;
        } else {
            return null;
        }
    }

}
