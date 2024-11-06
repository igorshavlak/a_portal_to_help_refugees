package org.project.helpportalrefugees.repository;

import org.project.helpportalrefugees.model.Refugee;
import org.project.helpportalrefugees.model.User;
import org.project.helpportalrefugees.model.Volunteer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepo {

    private final String getIdByUsernameSql = "SELECT id FROM users WHERE email = ?";
    private final String saveRefugeeDetailsSql = "INSERT INTO refugees (user_id,first_name, last_name, birth_date, phone_number, city,country) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";
    private final String saveVolunteerDetailsSql = "INSERT INTO volunteer (user_id, first_name, last_name, birth_date, skills_or_experience, phone_number, city,country) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    private final String updateRefugeeDetailsSql = "UPDATE refugees SET first_name = ?, last_name = ?, birth_date = ?, phone_number = ?, city = ?,country = ? WHERE user_id = ?";
    private final String updateVolunteerDetailsSql = "UPDATE volunteer SET first_name = ?, last_name = ?, birth_date = ?, skills_or_experience = ?, phone_number = ?, city = ?,country = ? WHERE user_id = ?";


    JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int getIdByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject(getIdByUsernameSql, (rs, rowNum) -> rs.getInt("id"), username);
        } catch (Exception e) {
            System.out.println("User not found for username: " + username);
            return 0;
        }
    }

    public boolean saveOrUpdateUserDetails(User user, int id) {
        if (user instanceof Refugee) {
            Refugee refugee = (Refugee) user;

            String checkSql = "SELECT COUNT(*) FROM refugees WHERE user_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, id);
            if (count != null && count > 0) {

                jdbcTemplate.update(updateRefugeeDetailsSql,
                        refugee.getName(),
                        refugee.getSurname(),
                        refugee.getDateOfBirth(),
                        refugee.getPhone(),
                        refugee.getCity(),
                        refugee.getCountry(),
                        id);
                return false;
            } else {
                jdbcTemplate.update(saveRefugeeDetailsSql,
                        id,
                        refugee.getName(),
                        refugee.getSurname(),
                        refugee.getDateOfBirth(),
                        refugee.getPhone(),
                        refugee.getCity(),
                        refugee.getCountry(),
                        refugee.getCity());
                return true;
            }
        } else if (user instanceof Volunteer) {
            Volunteer volunteer = (Volunteer) user;
            String checkSql = "SELECT COUNT(*) FROM volunteer WHERE user_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, id);
            if (count != null && count > 0) {

                jdbcTemplate.update(updateVolunteerDetailsSql,
                        volunteer.getName(),
                        volunteer.getSurname(),
                        volunteer.getDateOfBirth(),
                        volunteer.getSkillsOrExperience(),
                        volunteer.getPhone(),
                        volunteer.getCity(),
                        volunteer.getCountry(),
                        id);
                return false;
            } else {
                jdbcTemplate.update(saveVolunteerDetailsSql,
                        id,
                        volunteer.getName(),
                        volunteer.getSurname(),
                        volunteer.getDateOfBirth(),
                        volunteer.getSkillsOrExperience(),
                        volunteer.getPhone(),
                        volunteer.getCity(),
                        volunteer.getCountry());
                return true;
            }
        } else {
            throw new IllegalArgumentException("Unsupported user type: " + user.getClass().getName());
        }
    }
}


