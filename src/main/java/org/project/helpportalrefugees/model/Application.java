package org.project.helpportalrefugees.model;

import java.time.LocalDateTime;

public class Application {
    private int id;
    private int refugeeId;
    private String type;
    private String description;
    private String additionalData;
    private String status;
    private LocalDateTime createdAt;

    public Application(int id, int refugeeId, String type, String description, String additionalData, String status, LocalDateTime createdAt) {
        this.id = id;
        this.refugeeId = refugeeId;
        this.type = type;
        this.description = description;
        this.additionalData = additionalData;
        this.status = status;
        this.createdAt = createdAt;
    }
    public Application(int refugeeId, String type, String description, String additionalData, String status) {
        this.refugeeId = refugeeId;
        this.type = type;
        this.description = description;
        this.additionalData = additionalData;
        this.status = status;
    }
    public Application(int id,int refugeeId, String type, String description, String additionalData, String status) {
        this.id = id;
        this.refugeeId = refugeeId;
        this.type = type;
        this.description = description;
        this.additionalData = additionalData;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public int getRefugeeId() {
        return refugeeId;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getAdditionalData() {
        return additionalData;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setRefugeeId(int refugeeId) {
        this.refugeeId = refugeeId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAdditionalData(String additionalData) {
        this.additionalData = additionalData;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
