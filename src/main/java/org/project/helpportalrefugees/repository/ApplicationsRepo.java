package org.project.helpportalrefugees.repository;


import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.model.Refugee;
import org.project.helpportalrefugees.model.Volunteer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Repository
public class ApplicationsRepo {
    private static final String saveSql = "INSERT INTO applications (user_id,type,description,additional_data,status,supporting_document) VALUES (?,?,?,?,'consideration',?)";
    private static final String acceptSql = "UPDATE applications SET status=?, volunteer_id=? WHERE id=?";
    private static final String deleteSql = "DELETE FROM applications WHERE id=?";
    private static final String approveSql = "UPDATE applications SET status=? WHERE id=?";
    private static final String getAllRefugeeApplicationsSql =
            "SELECT a.id, a.user_id, a.type, a.description, a.additional_data, a.status, a.created_at, " +
                    "v.user_id AS volunteer_user_id, v.first_name AS volunteer_first_name, v.last_name AS volunteer_last_name, " +
                    "v.birth_date AS volunteer_birth_date, v.skills_or_experience, v.phone_number AS volunteer_phone, " +
                    "v.city AS volunteer_city, v.country AS volunteer_country " +
                    "FROM applications a " +
                    "LEFT JOIN volunteer v ON a.volunteer_id = v.user_id " +
                    "WHERE a.user_id = ? AND a.status != 'consideration'";
    private static final String getAllVolunteerApplicationsSql =
            "SELECT a.id, a.user_id, a.type, a.description, a.additional_data, a.status, a.created_at, " +
                    "r.user_id AS refugee_user_id, r.first_name AS refugee_first_name, r.last_name AS refugee_last_name, " +
                    "r.birth_date AS refugee_birth_date, r.status AS refugee_status, r.phone_number AS refugee_phone, " +
                    "r.city AS refugee_city, r.country AS refugee_country " +
                    "FROM applications a " +
                    "JOIN refugees r ON a.user_id = r.user_id " +
                    "WHERE a.volunteer_id = ? AND a.status != 'consideration'";
    private static final String getApplicationUsersSql = "SELECT user_id, volunteer_id FROM applications WHERE id = ?";
    private static final String getRefugeeApplicationById = "SELECT user_id FROM applications WHERE id = ?";
    private static final String getConsiderationApplicationsSql =
            "SELECT a.*, r.first_name, r.last_name, r.birth_date, r.phone_number, r.city, r.country, r.status AS refugee_status " +
                    "FROM applications a " +
                    "JOIN refugees r ON a.user_id = r.user_id " +
                    "WHERE a.status = 'consideration'";



    ChatRepo chatRepo;
    JdbcTemplate jdbcTemplate;

    @Autowired
    public ApplicationsRepo(JdbcTemplate jdbcTemplate, ChatRepo chatRepo) {
        this.jdbcTemplate = jdbcTemplate;
        this.chatRepo = chatRepo;
    }

    public void save(Application application) {
        jdbcTemplate.update(saveSql, application.getRefugeeId(), application.getType(), application.getDescription(), application.getAdditionalData(), application.getFile());
    }
    public List<Application> getConsiderationApplications() {
        return jdbcTemplate.query(getConsiderationApplicationsSql, (rs, rowNum) -> {
            byte[] file = rs.getBytes("supporting_document");
            Application application = new Application(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("type"),
                    rs.getString("description"),
                    rs.getString("additional_data"),
                    rs.getString("status"),
                    rs.getTimestamp("created_at").toLocalDateTime(),
                    Base64.getEncoder().encodeToString(rs.getBytes("supporting_document"))
            );
            Refugee refugee = new Refugee(
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getDate("birth_date").toLocalDate(),
                    rs.getString("phone_number"),
                    rs.getString("city"),
                    rs.getString("country"),
                    rs.getString("refugee_status")
            );

            application.setRefugee(refugee);

            return application;
        });
    }


    public List<Application> getRefugeeApplications(int id) {
        return jdbcTemplate.query(getAllRefugeeApplicationsSql, (rs, rowNum) -> {
            Application application = new Application(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("type"),
                    rs.getString("description"),
                    rs.getString("additional_data"),
                    rs.getString("status"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );

            int volunteerId = rs.getInt("volunteer_user_id");
            if (!rs.wasNull()) {
                Volunteer volunteer = new Volunteer(

                        rs.getString("volunteer_first_name"),
                        rs.getString("volunteer_last_name"),
                        rs.getDate("volunteer_birth_date").toLocalDate(),
                        rs.getString("volunteer_phone"),
                        rs.getString("volunteer_city"),
                        rs.getString("volunteer_country"),
                        rs.getString("skills_or_experience")
                );
                application.setVolunteer(volunteer);
            }

            return application;
        }, id);
    }

    public List<Application> getVolunteerApplications(int id) {
        return jdbcTemplate.query(getAllVolunteerApplicationsSql, (rs, rowNum) -> {
            Application application = new Application(
                    rs.getInt("id"),
                    rs.getInt("refugee_user_id"),
                    rs.getString("type"),
                    rs.getString("description"),
                    rs.getString("additional_data"),
                    rs.getString("status"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );


            Refugee refugee = new Refugee(
                    rs.getString("refugee_first_name"),
                    rs.getString("refugee_last_name"),
                    rs.getDate("refugee_birth_date").toLocalDate(),
                    rs.getString("refugee_phone"),
                    rs.getString("refugee_city"),
                    rs.getString("refugee_country"),
                    rs.getString("refugee_status")
            );

            application.setRefugee(refugee);

            return application;
        }, id);
    }

    public List<Application> getAllApplicationsByCategories(List<String> categories) {
        String sql = "SELECT a.id, a.user_id, a.type, a.description, a.additional_data, a.status, a.created_at, " +
                "r.first_name, r.last_name, r.birth_date, r.status AS refugee_status, " +
                "r.phone_number, r.city, r.country " +
                "FROM applications a " +
                "JOIN refugees r ON a.user_id = r.user_id " +
                "WHERE a.type IN (" + String.join(",", Collections.nCopies(categories.size(), "?")) + ") " +
                "AND a.status = ?";

        Object[] params = new Object[categories.size() + 1];
        System.arraycopy(categories.toArray(), 0, params, 0, categories.size());
        params[params.length - 1] = "pending";

        return jdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> {
                    Application application = new Application(
                            rs.getInt("id"),
                            rs.getInt("user_id"),
                            rs.getString("type"),
                            rs.getString("description"),
                            rs.getString("additional_data"),
                            rs.getString("status"),
                            rs.getTimestamp("created_at").toLocalDateTime()
                    );

                    Refugee refugee = new Refugee(
                            rs.getString("first_name"),
                            rs.getString("last_name"),
                            rs.getDate("birth_date").toLocalDate(),
                            rs.getString("phone_number"),
                            rs.getString("city"),
                            rs.getString("country"),
                            rs.getString("refugee_status")
                    );

                    application.setRefugee(refugee);

                    return application;
                }
        );
    }

    public void acceptApplication(int applicationId, int volunteerId) {
        jdbcTemplate.update(acceptSql, "processing", volunteerId, applicationId);
    }
    public void approveApplication(int id){
        jdbcTemplate.update(approveSql,"pending", id);
    }
    public void rejectApplication(int id){
        jdbcTemplate.update(deleteSql,id);
    }
    public List<Map<String, Object>>  getApplicationUsersId(int applicationId) {
        return jdbcTemplate.queryForList(getApplicationUsersSql, applicationId);
    }
    public Integer getRefugeeByApplicationId(int id){
        return jdbcTemplate.queryForObject(getRefugeeApplicationById,Integer.class,id);
    }
}
