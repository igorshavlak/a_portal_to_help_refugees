package org.project.helpportalrefugees.DTO;




import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

public class HelpRequestDTO {
   @NotBlank(message = "Тип допомоги є обов`язковим")
    private String type;
    @NotBlank(message = "Опис ситуації є обов'язковим")
    private String description;
    @NotNull(message = "Додаткові дані є обов'язковими")
    private String additionalData;
    @NotNull(message = "Додатковий документ є обов'язковим")
    private MultipartFile supportingDocument;

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getAdditionalData() {
        return additionalData;
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

    public MultipartFile getSupportingDocument() {
        return supportingDocument;
    }
    public void setSupportingDocument(MultipartFile supportingDocument) {
        this.supportingDocument = supportingDocument;
    }

}
