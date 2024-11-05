package org.project.helpportalrefugees.model;

import java.time.LocalDate;

public class Refugee extends User{
    private String status;
    public Refugee(String id, String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, String status) {
        super(id, name, surname,dateOfBirth, phone, city, country);
        this.status = status;
    }
    public Refugee(String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, String status) {
        super(name, surname,dateOfBirth, phone, city, country);
        this.status = status;
    }
    public Refugee(String name, String surname, LocalDate dateOfBirth, String phone, String city, String country) {
        super(name, surname,dateOfBirth, phone, city, country);
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
