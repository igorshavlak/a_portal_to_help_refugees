package org.project.helpportalrefugees.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RefugeeRepo {

    private final String getIdByUsername = "SELECT id FROM users WHERE email = ?";
    JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int getIdByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject(getIdByUsername, (rs, rowNum) -> rs.getInt("id"), username);
        } catch (Exception e) {
            System.out.println("User not found for username: " + username);
            return 0;
        }
    }

}
