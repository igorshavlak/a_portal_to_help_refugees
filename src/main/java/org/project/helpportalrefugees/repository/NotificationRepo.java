package org.project.helpportalrefugees.repository;

import org.project.helpportalrefugees.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class NotificationRepo {

    private final String createNotificationSql = "INSERT INTO notification (receiver, message, created_at, read) VALUES (?, ?, ?, ?)";
    private final String getNotificationSql = "SELECT * FROM notification WHERE receiver = ? ORDER BY created_at DESC";
    private final String markAsReadSql = "UPDATE notification SET read = TRUE WHERE id = ?";
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public NotificationRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Notification> notificationRowMapper = new RowMapper<Notification>() {
        @Override
        public Notification mapRow(ResultSet rs, int rowNum) throws SQLException, SQLException {
            return new Notification(rs.getInt("id"),
                    rs.getString("message"),
                    rs.getBoolean("read"),
                    rs.getInt("receiver"),
                    rs.getTimestamp("created_at").toLocalDateTime());

        }
    };

    public void create(Notification notification) {
        jdbcTemplate.update(createNotificationSql, notification.getRecipient(), notification.getMessage(),
                notification.getTimestamp(), notification.isRead());
    }

    public List<Notification> findByReceiver(Integer receiver) {
        return jdbcTemplate.query(getNotificationSql, new Object[]{receiver}, notificationRowMapper);
    }


    public int markAsRead(int id) {
        return jdbcTemplate.update(markAsReadSql, id);
    }


}
