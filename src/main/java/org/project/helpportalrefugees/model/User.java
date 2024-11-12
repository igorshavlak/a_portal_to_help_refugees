package org.project.helpportalrefugees.model;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public abstract class User {
        private String id;
        private String name;
        private String surname;
        private LocalDate dateOfBirth;
        private String phone;
        private String city;
        private String country;
        private byte[] profileImage;

    public User(String id, String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, byte[] profileImage) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.city = city;
        this.country = country;
        this.profileImage = profileImage;
    }
    public User(String id, String name, String surname, LocalDate dateOfBirth, String phone, String city, String country) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.city = city;
        this.country = country;

    }
    public User(String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, byte[] profileImage) {
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.city = city;
        this.country = country;
        this.profileImage = profileImage;
    }
    public User(String name, String surname, LocalDate dateOfBirth, String phone, String city, String country) {
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.city = city;
        this.country = country;
    }

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
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

    public void setId(String id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
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

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getSurname() {
        return surname;
    }

    public byte[] getProfileImage() {
        return profileImage;
    }
    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }

}
