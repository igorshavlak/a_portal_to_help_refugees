package org.project.helpportalrefugees.DTO;

import javax.validation.constraints.*;
import java.time.LocalDate;

public class RegistrationRequestDTO {

    @NotBlank(message = "Ім'я є обов'язковим")
    private String name;

    @NotBlank(message = "Фамілія є обов'язковою")
    private String surname;

    @NotBlank(message = "Телефон є обов'язковим")
    private String phone;

    @NotBlank(message = "Місто є обов'язковим")
    private String city;

    @NotNull(message = "Дата народження є обов'язковою")
    @Past(message = "Дата народження повинна бути в минулому")
    private LocalDate birthDate;

    @Email(message = "Невірний формат електронної пошти")
    @NotBlank(message = "Електронна пошта є обов'язковою")
    private String email;

    @NotBlank(message = "Пароль є обов'язковим")
    private String password;

    @NotBlank(message = "Тип користувача є обов'язковим")
    private String userType;

    private String volunteerSkills;

    public RegistrationRequestDTO(String name, String surname, String phone, String city, LocalDate birthDate, String email, String password, String userType, String volunteerSkills) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.city = city;
        this.birthDate = birthDate;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.volunteerSkills = volunteerSkills;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUserType() {
        return userType;
    }

    public String getVolunteerSkills() {
        return volunteerSkills;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public void setVolunteerSkills(String volunteerSkills) {
        this.volunteerSkills = volunteerSkills;
    }
}