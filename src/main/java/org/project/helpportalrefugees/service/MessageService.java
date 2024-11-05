package org.project.helpportalrefugees.service;

import org.project.helpportalrefugees.model.Message;
import org.project.helpportalrefugees.repository.MessageRepo;
import org.project.helpportalrefugees.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class MessageService {

    MessageRepo messageRepo;
    UserRepo userRepo;

    @Autowired
    public MessageService(MessageRepo messageRepo, UserRepo userRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
    }
    public void save(Message message, Principal principal) {
        messageRepo.save(message,userRepo.getIdByUsername(principal.getName()));
    }
}
