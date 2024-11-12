package org.project.helpportalrefugees.DTO;

public class ChatMessageDTO {
    private String message;
    private int chatId;

    public ChatMessageDTO() {}

    public ChatMessageDTO(String message, int chatId) {
        this.message = message;
        this.chatId = chatId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }
}
