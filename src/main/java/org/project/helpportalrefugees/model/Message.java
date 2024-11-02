package org.project.helpportalrefugees.model;

public class Message {
    private int id;
    private int userId;
    private String message;
    public Message(int id, int userId, String message) {
        this.id = id;
        this.userId = userId;
        this.message = message;
    }
    public Message(int userId, String message) {
        this.userId = userId;
        this.message = message;
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
}
