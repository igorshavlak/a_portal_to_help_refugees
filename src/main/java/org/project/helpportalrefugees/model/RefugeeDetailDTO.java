package org.project.helpportalrefugees.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class RefugeeDetailDTO {


    @NotBlank(message = "Ім`я є обов`язковим")
    private String firstName;
    @NotBlank(message = "Фамілія є обов`язкова")
    private String lastName;
    @NotBlank(message = "Дата народження є обов`язкова")
    private LocalDate birthDate;
    @NotBlank(message = "Номер телефону є обов`язковим")
    private String phone;
    @NotBlank(message = "Гендер є обов`язковим")
    private String city;
    @NotBlank(message = "Країна є обов`язкова")
    private String country;

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getPhone() {
        return phone;
    }


    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }
}
