package org.project.helpportalrefugees.http;

public class ApiResponse {
    private boolean success;
    private String message;
    private Long requestId;

    public ApiResponse(boolean success, String message, Long requestId) {
        this.success = success;
        this.message = message;
        this.requestId = requestId;
    }
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;

    }


    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }
}
