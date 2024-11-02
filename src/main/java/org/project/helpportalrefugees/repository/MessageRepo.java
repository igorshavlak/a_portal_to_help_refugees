package org.project.helpportalrefugees.repository;


import org.project.helpportalrefugees.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


import java.security.Principal;

@Repository
public class MessageRepo {

    private final String sqlSave = "INSERT INTO MESSAGE (user_id, content) VALUES (?, ?)";
    JdbcTemplate jdbcTemplate;

    @Autowired
    public MessageRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Message message, int userId) {
        jdbcTemplate.update(sqlSave,userId,message.getMessage());
    }

}
