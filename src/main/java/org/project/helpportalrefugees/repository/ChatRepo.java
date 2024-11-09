package org.project.helpportalrefugees.repository;

import org.project.helpportalrefugees.model.Chat;
import org.project.helpportalrefugees.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ChatRepo {
    private static final String getChatIdByUsersSql = "SELECT id FROM chat WHERE volunteer_id = ? AND refugee_id = ?";
    private static final String createChatSql = "INSERT INTO chat (volunteer_id,refugee_id) VALUES (?,?) RETURNING id";
    private static final String getChatMessagesSql = "SELECT m.id, m.user_id, m.content, m.created_at  " +
            "FROM messages m " +
            "JOIN chat_messages cm ON m.id = cm.message_id " +
            "WHERE cm.chat_id = ? ";
    private static final String saveChatMessageSql = "INSERT INTO chat_messages (chat_id, message_id) VALUES (?,?)";
    private static final String getChatByIdSql = "SELECT volunteer_id, refugee_id FROM chat WHERE id = ?";
    private static final String insertMessageSql = "INSERT INTO messages (user_id, content) VALUES (?, ?) RETURNING id";



    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ChatRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer getChatIdByUsers(int refugee_id, int volunteer_id) {
        return jdbcTemplate.queryForObject(getChatIdByUsersSql, (rs, rowNum) -> rs.getInt("id"), volunteer_id, refugee_id);
    }

    public Integer createChat(int refugee_id, int volunteer_id) {
        return jdbcTemplate.queryForObject(createChatSql, Integer.class, volunteer_id, refugee_id);
    }

    public List<Message> getChatMessages(int chat_id) {
        return jdbcTemplate.query(getChatMessagesSql, ((rs, rowNum) -> {
            return new Message(
                    rs.getInt("user_id"),
                    rs.getString("content"),
                    rs.getTimestamp("created_at").toLocalDateTime());
        }), chat_id);

    }

    public void saveChatMessage(int chatId, Message message) {
        Integer messageId = jdbcTemplate.queryForObject(
                insertMessageSql,
                new Object[]{message.getUserId(), message.getMessage()},
                Integer.class
        );
        if (messageId != null) {
            jdbcTemplate.update(saveChatMessageSql, chatId, messageId);
        }
    }

    public Chat getChatById(int chat_id) {
        return jdbcTemplate.queryForObject(getChatByIdSql, (rs, rowNum) -> {
            return new Chat(
                    rs.getInt("volunteer_id"),
                    rs.getInt("refugee_id"));
        }, chat_id);
    }
}
