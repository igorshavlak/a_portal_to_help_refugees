package org.project.helpportalrefugees.model;

import java.util.List;

public class Chat {
    private int id;
    private int refugeeId;
    private int volunteerId;
    private List<Message> messages;
    public Chat(int id, List<Message> messages) {
        this.id = id;
        this.messages = messages;
    }
    public Chat(int refugeeId, int volunteerId) {
        this.volunteerId = volunteerId;
        this.refugeeId = refugeeId;
    }
    public int getId() {
        return id;
    }
    public List<Message> getMessages() {
        return messages;
    }

    public void setId(int id) {
        this.id = id;
    }
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public int getRefugeeId() {
        return refugeeId;
    }

    public int getVolunteerId() {
        return volunteerId;
    }
}
