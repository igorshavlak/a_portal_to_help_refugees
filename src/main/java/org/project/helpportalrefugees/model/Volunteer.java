package org.project.helpportalrefugees.model;

import java.time.LocalDate;

public class Volunteer extends User{

    private String skillsOrExperience;

    public Volunteer(String id, String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, String skillsOrExperience) {
        super(id, name, surname,dateOfBirth,phone, city, country);
        this.skillsOrExperience = skillsOrExperience;
    }
    public Volunteer(String name, String surname, LocalDate dateOfBirth, String phone, String city, String country, String skillsOrExperience) {
        super(name,surname,dateOfBirth,phone,city,country);
        this.skillsOrExperience = skillsOrExperience;
    }
    public String getSkillsOrExperience() {
        return skillsOrExperience;
    }
    public void setSkillsOrExperience(String skillsOrExperience) {
        this.skillsOrExperience = skillsOrExperience;
    }
}
