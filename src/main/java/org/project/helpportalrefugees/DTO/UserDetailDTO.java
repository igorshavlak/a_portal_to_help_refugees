package org.project.helpportalrefugees.DTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class UserDetailDTO {

    @NotBlank(message = "Ім'я є обов'язковим")
    private String firstName;

    @NotBlank(message = "Прізвище є обов'язковим")
    private String lastName;

    @NotNull(message = "Дата народження є обов'язковою")
    private LocalDate birthDate;

    @NotBlank(message = "Номер телефону є обов'язковим")
    private String phone;

    @NotBlank(message = "Місто є обов'язковим")
    private String city;

    @NotBlank(message = "Країна є обов'язковою")
    private String country;

    private String skillsAndExperience;


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

    public void setSkillsAndExperience(String skillsAndExperience) {
        this.skillsAndExperience = skillsAndExperience;
    }

    public String getSkillsAndExperience() {
        return skillsAndExperience;
    }
}
