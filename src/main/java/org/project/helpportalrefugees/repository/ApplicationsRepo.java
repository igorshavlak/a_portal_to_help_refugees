package org.project.helpportalrefugees.repository;


import org.project.helpportalrefugees.model.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ApplicationsRepo {
    private final String saveRequest = "INSERT INTO applications (user_id,type,description,additional_data,status) VALUES (?,?,?,?,?)";
    private final String getAllRequest = "SELECT * FROM applications WHERE user_id=?";


    JdbcTemplate jdbcTemplate;

    @Autowired
    public ApplicationsRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    public void save(Application application) {
         jdbcTemplate.update(saveRequest,application.getRefugeeId(),application.getType(),application.getDescription(),application.getAdditionalData(),application.getStatus());
    }
    public List<Application> getUserApplications(int id) {
        return jdbcTemplate.query(getAllRequest,(rs, rowNum) -> new Application(
                 rs.getInt("id"),
                 rs.getInt("user_id"),
                 rs.getString("type"),
                 rs.getString("description"),
                 rs.getString("additional_data"),
                 rs.getString("status")
         ),id);

    }
}
