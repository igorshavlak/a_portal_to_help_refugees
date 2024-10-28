package org.project.helpportalrefugees.model;




import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

public class HelpRequestDTO {
   @NotBlank(message = "Тип допомоги є обов`язковим")
    private String type;
    @NotBlank(message = "Опис ситуації є обов'язковим")
    private String description;
    @NotNull(message = "Додаткові дані є обов'язковими")
    private Map<String,Object> additionalData;

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public Map<String, Object> getAdditionalData() {
        return additionalData;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAdditionalData(Map<String, Object> additionalData) {
        this.additionalData = additionalData;
    }
}
