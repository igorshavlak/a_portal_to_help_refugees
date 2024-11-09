package org.project.helpportalrefugees.service;

import org.project.helpportalrefugees.model.Chat;
import org.project.helpportalrefugees.model.Message;
import org.project.helpportalrefugees.repository.ApplicationsRepo;
import org.project.helpportalrefugees.repository.ChatRepo;
import org.project.helpportalrefugees.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ChatService {
    public ApplicationsRepo applicationsRepo;
    public ChatRepo chatRepository;
    public UserRepo userRepository;
    @Autowired
    public ChatService(ApplicationsRepo applicationsRepo, ChatRepo chatRepository,UserRepo userRepository) {
        this.applicationsRepo = applicationsRepo;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    public Chat getChatHistory(int applicationId){
        Integer chatId;
        List<Message> messages = List.of();
        List<Map<String, Object>> results = applicationsRepo.getApplicationUsersId(applicationId);
        Integer userId = 0;
        Integer volunteerId = 0;
        for (Map<String, Object> row : results) {
             userId = (Integer) row.get("user_id");
             volunteerId = (Integer) row.get("volunteer_id");
        }

        try {
            chatId = chatRepository.getChatIdByUsers(userId,volunteerId);
            messages = chatRepository.getChatMessages(chatId);
            for(Message message : messages){
                message.setSenderEmail(userRepository.getUsernameById(message.getUserId()));
            }
        }catch (EmptyResultDataAccessException e){
            chatId = chatRepository.createChat(userId,volunteerId);
        }
        return new Chat(chatId,messages);
    }
    public void saveChatMessage(int chatId, String message, Principal principal){
        chatRepository.saveChatMessage(chatId,new Message(userRepository.getIdByUsername(principal.getName()),message));
    }
    public Chat getChatById(int chatId){
        return chatRepository.getChatById(chatId);
    }
}
