let applicationId = 0;
let notificationCount = 0;
const MAX_NOTIFICATIONS = 5;
let notifications = [];

function initializeWebSocket() {
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);

    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Підписуємося на користувацьку чергу сповіщень
        stompClient.subscribe('/user/queue/notifications', notification => {
            const notificationData = JSON.parse(notification.body);
            console.log('Received notification:', notificationData);
            addNotification(notificationData);
            incrementBadge();
        });
    }, error => {
        console.error('WebSocket connection error: ', error);
    });

    return stompClient;
}

function addNotification(notification) {
    // Видобуваємо ID заявки з повідомлення
    extractApplicationId(notification);

    // Додаємо сповіщення в контейнер
    const container = document.getElementById('notification-container');
    const notificationElement = createNotificationElement(notification);
    container.insertBefore(notificationElement, container.firstChild);

    // Додаємо сповіщення в масив
    notifications.unshift(notification);

    // Обмежуємо кількість сповіщень до MAX_NOTIFICATIONS
    if (notifications.length > MAX_NOTIFICATIONS) {
        const removed = notifications.pop();
        removeNotificationElement(removed.id);
    }

    // Додаємо сповіщення в попап
    addToPopup(notification);
}

/**
 * Видобуває ID заявки з повідомлення та додає його до об'єкта notification
 * @param {Object} notification - Об'єкт сповіщення
 */
function extractApplicationId(notification) {
    const message = notification.message;
    const index = message.indexOf('№');
    if (index !== -1) {
        const applicationId = message.substring(index + 1).trim();
        notification.applicationId = applicationId;
    } else {
        notification.applicationId = null; // Якщо не знайдено, можна встановити null або інше значення
    }
}

/**
 * Створення DOM-елемента сповіщення
 * @param {Object} notification - Об'єкт сповіщення
 * @returns {HTMLElement} - Створений елемент сповіщення
 */
function createNotificationElement(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.setAttribute('data-id', notification.id);

    // Застосовуємо стилі на основі типу сповіщення
    applyNotificationStyles(notification, notificationElement);

    // Додаємо кнопку закриття
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => {
        removeNotificationElement(notification.id);
        deleteNotification(notification.id); // Додаємо запит на видалення
    };
    notificationElement.appendChild(closeBtn);

    // Додаємо текст сповіщення
    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.innerText = notification.message;
    notificationElement.appendChild(messageSpan);

    // Для типу 'finish' додаємо кнопки "Прийняти" і "Відхилити"
    if (notification.type === 'finish') {
        const buttonsContainer = createNotificationButtons(notification);
        notificationElement.appendChild(buttonsContainer);
    }

    // Запускаємо анімацію появи
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);

    // Автоматичне видалення через duration (якщо необхідно)
    const duration = notification.duration || 5000;
    setTimeout(() => {
        removeNotificationElement(notification.id);
        markAsRead(notification.id);
    }, duration);

    return notificationElement;
}

/**
 * Застосування стилів до сповіщення на основі його типу
 * @param {Object} notification - Об'єкт сповіщення
 * @param {HTMLElement} element - DOM-елемент сповіщення
 */
function applyNotificationStyles(notification, element) {
    if (notification.type === 'confirm' || notification.type === 'accept') {
        element.classList.add('notification-green');
    } else if (notification.type === 'reject') {
        element.classList.add('notification-red');
    } else if (notification.type === 'finish') {
        element.classList.add('notification-finish');
    }
}

/**
 * Створення кнопок для сповіщення типу 'finish'
 * @param {Object} notification - Об'єкт сповіщення
 * @returns {HTMLElement} - Контейнер з кнопками
 */
function createNotificationButtons(notification) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('notification-buttons');

    const acceptButton = document.createElement('button');
    acceptButton.classList.add('accept-btn');
    acceptButton.innerText = 'Прийняти';
    acceptButton.onclick = () => {
        handleAccept(notification);
    };

    const rejectButton = document.createElement('button');
    rejectButton.classList.add('reject-btn');
    rejectButton.innerText = 'Відхилити';
    rejectButton.onclick = () => {
        handleReject(notification);
    };

    buttonsContainer.appendChild(acceptButton);
    buttonsContainer.appendChild(rejectButton);

    return buttonsContainer;
}

/**
 * Видалення сповіщення з інтерфейсу та масиву
 * @param {number} id - ID сповіщення
 */
function removeNotificationElement(id) {
    // Знаходимо елемент сповіщення в контейнері
    const container = document.getElementById('notification-container');
    const notificationElement = container.querySelector(`.notification[data-id='${id}']`);
    if (notificationElement) {
        notificationElement.classList.remove('show');
        notificationElement.addEventListener('transitionend', () => {
            if (notificationElement.parentElement) {
                notificationElement.parentElement.removeChild(notificationElement);
            }
        });
    }

    // Видаляємо сповіщення з масиву
    const index = notifications.findIndex(notif => notif.id === id);
    if (index !== -1) {
        notifications.splice(index, 1);
        notificationCount = Math.max(notificationCount - 1, 0);
        updateBadge();
    }
}

/**
 * Оновлення значка сповіщень
 */
function updateBadge() {
    const badge = document.getElementById('notification-count');
    if (notificationCount > 0) {
        badge.style.display = 'block';
        badge.innerText = notificationCount > 99 ? '99+' : notificationCount;
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Скидання лічильника сповіщень
 */
function resetBadge() {
    notificationCount = 0;
    updateBadge();
}

/**
 * Додавання сповіщення в попап
 * @param {Object} notification - Об'єкт сповіщення
 */
function addToPopup(notification) {
    const popupContainer = document.getElementById('popup-notifications');

    // Створюємо елемент сповіщення в попапі
    const popupNotification = document.createElement('div');
    popupNotification.classList.add('notification');
    popupNotification.setAttribute('data-id', notification.id);

    // Застосовуємо стилі на основі типу сповіщення
    applyNotificationStyles(notification, popupNotification);

    // Додаємо кнопку закриття
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => {
        removePopupNotification(notification.id);
        deleteNotification(notification.id); // Додаємо запит на видалення
    };
    popupNotification.appendChild(closeBtn);

    // Додаємо текст сповіщення
    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.innerText = notification.message;
    popupNotification.appendChild(messageSpan);

    // Для типу 'finish' додаємо кнопки "Прийняти" і "Відхилити"
    if (notification.type === 'finish') {
        const buttonsContainer = createNotificationButtons(notification);
        popupNotification.appendChild(buttonsContainer);
    }

    // Додаємо сповіщення в попап (зверху)
    popupContainer.insertBefore(popupNotification, popupContainer.firstChild);

    // Запускаємо анімацію появи
    setTimeout(() => {
        popupNotification.classList.add('show');
    }, 100);
}

/**
 * Видалення сповіщення з попапа з анімацією
 * @param {number} id - ID сповіщення
 */
function removePopupNotification(id) {
    const popupContainer = document.getElementById('popup-notifications');
    const popupNotification = popupContainer.querySelector(`.notification[data-id='${id}']`);
    if (popupNotification) {
        popupNotification.classList.remove('show');
        popupNotification.addEventListener('transitionend', () => {
            if (popupNotification.parentElement) {
                popupNotification.parentElement.removeChild(popupNotification);
            }
        });
    }
}

/**
 * Відмітка сповіщення як прочитаного через API
 * @param {number} id - ID сповіщення
 */
function markAsRead(id) {
    fetch(`/notification/${id}/read`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Сповіщення ${id} відмічено як прочитане.`);
            } else {
                console.error(`Не вдалося відмітити сповіщення ${id} як прочитане.`);
            }
        })
        .catch(error => {
            console.error(`Помилка при відмітці сповіщення ${id} як прочитаного:`, error);
        });
}

/**
 * Видалення сповіщення через API
 * @param {number} id - ID сповіщення
 */
function deleteNotification(id) {
    fetch(`/notification/${id}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Сповіщення ${id} видалено.`);
            } else {
                console.error(`Не вдалося видалити сповіщення ${id}.`);
            }
        })
        .catch(error => {
            console.error(`Помилка при видаленні сповіщення ${id}:`, error);
        });
}

/**
 * Завантаження існуючих сповіщень через REST API
 */
function loadExistingNotifications() {
    fetch('/notification/getNotification', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const popupContainer = document.getElementById('popup-notifications');
            popupContainer.innerHTML = ''; // Очистити поточні сповіщення

            // Обмежуємо до останніх п'яти сповіщень
            const lastFive = data.slice(0, MAX_NOTIFICATIONS);

            lastFive.forEach(notification => {
                // Видобуваємо ID заявки
                extractApplicationId(notification);

                // Перевіряємо і встановлюємо тип сповіщення, якщо відсутній
                if (!notification.type) {
                    notification.type = 'default'; // Встановіть тип за замовчуванням або отримайте його з даних
                }
                addToPopup(notification);
            });
        })
        .catch(error => {
            console.error('Помилка при завантаженні сповіщень:', error);
        });
}

/**
 * Збільшення лічильника сповіщень
 */
function incrementBadge() {
    notificationCount++;
    updateBadge();
}

/**
 * Оновлення значка сповіщень
 */
function updateBadge() {
    const badge = document.getElementById('notification-count');
    if (notificationCount > 0) {
        badge.style.display = 'block';
        badge.innerText = notificationCount > 99 ? '99+' : notificationCount;
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Обробник кліку по кнопці сповіщень
 */
document.getElementById('notification-button').addEventListener('click', () => {
    const popup = document.getElementById('notification-popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'flex';
        loadExistingNotifications(); // Завантажити останні п'ять сповіщень при відкритті попапа
    } else {
        popup.style.display = 'none';
    }
    // Скинути лічильник сповіщень при відкритті попапа
    resetBadge();
});

/**
 * Обробник кліку по кнопці закриття попапа
 */
document.getElementById('close-popup').addEventListener('click', () => {
    const popup = document.getElementById('notification-popup');
    popup.style.display = 'none';
});

/**
 * Ініціалізація: сховати попап за замовчуванням та встановити WebSocket з'єднання
 */
document.getElementById('notification-popup').style.display = 'none';
initializeWebSocket();

/**
 * Обробники для кнопок "Прийняти" і "Відхилити"
 */
function handleAccept(notification) {
    deleteNotification(notification.id);
    const applicationId = notification.applicationId;
    if (!applicationId) {
        console.error('ID заявки не знайдено.');
        return;
    }

    // Надсилаємо запит на бекенд про прийняття
    fetch(`/applications/${applicationId}/acceptFinishApplication`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Заявка ${applicationId} прийнята.`);
                // Після обробки видаляємо сповіщення
                markAsRead(notification.id);
                removeNotificationElement(notification.id);
                removePopupNotification(notification.id);
            } else {
                console.error(`Не вдалося прийняти заявку ${applicationId}.`);
            }
        })
        .catch(error => {
            console.error(`Помилка при прийнятті заявки ${applicationId}:`, error);
        });
}

function handleReject(notification) {
    deleteNotification(notification.id);
    const applicationId = notification.applicationId;
    if (!applicationId) {
        console.error('ID заявки не знайдено.');
        return;
    }

    // Надсилаємо запит на бекенд про відхилення
    fetch(`/applications/${applicationId}/rejectFinishApplication`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Заявка ${applicationId} відхилена.`);
                // Після обробки видаляємо сповіщення
                markAsRead(notification.id);
                removeNotificationElement(notification.id);
                removePopupNotification(notification.id);
            } else {
                console.error(`Не вдалося відхилити заявку ${applicationId}.`);
            }
        })
        .catch(error => {
            console.error(`Помилка при відхиленні заявки ${applicationId}:`, error);
        });
}