package org.project.helpportalrefugees.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

public class Message {
    private int id;
    private int userId;
    private String message;
    private LocalDateTime dateTime;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String senderEmail;


    public Message(int id, int userId, String message) {
        this.id = id;
        this.userId = userId;
        this.message = message;
    }
    public Message(int userId, String message) {
        this.userId = userId;
        this.message = message;
    }
    public Message(int userId, String message,LocalDateTime dateTime) {
        this.userId = userId;
        this.message = message;
        this.dateTime = dateTime;
    }
    public void setId(int id) {
        this.id = id;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public int getId() {
        return id;
    }
    public int getUserId() {
        return userId;
    }
    public String getMessage() {
        return message;
    }
    public LocalDateTime getDateTime() {
        return dateTime;
    }
    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderEmail() {
        return senderEmail;
    }
}
