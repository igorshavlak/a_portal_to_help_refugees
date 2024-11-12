package org.project.helpportalrefugees.model;

import java.time.LocalDateTime;

public class Notification {
    private int id;
    private String message;
    private boolean read = false;
    private int recipientId;
    private LocalDateTime timestamp;

    public Notification(String message, boolean read, int recipientId, LocalDateTime timestamp) {
        this.message = message;
        this.read = read;
        this.recipientId = recipientId;
        this.timestamp = timestamp;
    }
    public Notification(int id,String message, boolean read, int recipientId, LocalDateTime timestamp) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.recipientId = recipientId;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }
    public boolean isRead() {
        return read;
    }
    public int getRecipient() {
        return recipientId;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setRead(boolean read) {
        this.read = read;
    }

    public void setRecipientUsername(int recipientId) {
        this.recipientId = recipientId;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
