package org.project.helpportalrefugees.repository;


import org.project.helpportalrefugees.model.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

@Repository
public class ApplicationsRepo {
    private final String saveRequest = "INSERT INTO applications (user_id,type,description,additional_data,status) VALUES (?,?,?,?,?)";
    private final String getAllRequest = "SELECT * FROM applications WHERE user_id=?";
    private final String acceptRequest = "UPDATE applications SET status=?, volunteer_id=? WHERE id=?";




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
                 rs.getString("status"),
                 rs.getDate("created_at").toLocalDate().atStartOfDay()

         ),id);

    }
    public List<Application> getAllApplicationsByCategories(List<String> categories) {
        String sql = "SELECT * FROM applications WHERE type IN (" +
                String.join(",", Collections.nCopies(categories.size(), "?")) + ") AND status = ?";
        Object[] params = new Object[categories.size() + 1];
        System.arraycopy(categories.toArray(), 0, params, 0, categories.size());
        params[params.length - 1] = "pending";
        return jdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new Application(
                        rs.getInt("id"),
                        rs.getInt("user_id"),
                        rs.getString("type"),
                        rs.getString("description"),
                        rs.getString("additional_data"),
                        rs.getString("status"),
                        rs.getDate("created_at").toLocalDate().atStartOfDay()
                )
        );
    }
    public void acceptApplication(int applicationId, int volunteerId) {
        jdbcTemplate.update(acceptRequest,"processing",volunteerId,applicationId);
    }
}
