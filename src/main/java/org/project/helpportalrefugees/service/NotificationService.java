package org.project.helpportalrefugees.service;

import org.project.helpportalrefugees.model.Notification;
import org.project.helpportalrefugees.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepo notificationRepository;

    @Autowired
    public NotificationService(NotificationRepo notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Создать уведомление
    public void createNotification(Notification notification) {
        notificationRepository.create(notification);
    }

    // Получить уведомления пользователя
    public List<Notification> getNotifications(Integer receiver) {
        return notificationRepository.findByReceiver(receiver);
    }

    public boolean markAsRead(int id) {
        int rowsAffected = notificationRepository.markAsRead(id);
        return rowsAffected > 0;
    }
}
