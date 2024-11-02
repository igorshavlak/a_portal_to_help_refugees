package org.project.helpportalrefugees.service;

import org.project.helpportalrefugees.model.Message;
import org.project.helpportalrefugees.repository.MessageRepo;
import org.project.helpportalrefugees.repository.RefugeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class MessageService {

    MessageRepo messageRepo;
    RefugeeRepo refugeeRepo;

    @Autowired
    public MessageService(MessageRepo messageRepo, RefugeeRepo refugeeRepo) {
        this.messageRepo = messageRepo;
        this.refugeeRepo = refugeeRepo;
    }
    public void save(Message message, Principal principal) {
        messageRepo.save(message,refugeeRepo.getIdByUsername(principal.getName()));
    }
}
