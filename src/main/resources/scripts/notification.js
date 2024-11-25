let notificationCount = 0;
const MAX_NOTIFICATIONS = 5;
let notifications = [];

function initializeWebSocket() {
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);


    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Подписываемся на пользовательский топик уведомлений
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
    // Добавляем уведомление в контейнер
    const container = document.getElementById('notification-container');
    const notificationElement = createNotificationElement(notification);
    container.insertBefore(notificationElement, container.firstChild);

    // Добавляем уведомление в массив
    notifications.unshift(notification);

    // Ограничиваем количество уведомлений до MAX_NOTIFICATIONS
    if (notifications.length > MAX_NOTIFICATIONS) {
        const removed = notifications.pop();
        removeNotificationElement(removed.id);
    }

    // Добавляем уведомление в попап
    addToPopup(notification);
}

/**
 * Создание DOM-элемента уведомления
 * @param {Object} notification - Объект уведомления
 * @returns {HTMLElement} - Созданный элемент уведомления
 */
function createNotificationElement(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.setAttribute('data-id', notification.id);

    // Добавляем кнопку закрытия
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => {
        removeNotificationElement(notification.id);
        markAsRead(notification.id);
    };
    notificationElement.appendChild(closeBtn);

    // Добавляем текст уведомления
    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.innerText = notification.message;
    notificationElement.appendChild(messageSpan);

    // Запускаем анимацию появления
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);

    // Автоматическое удаление через duration (если необходимо)
    const duration = notification.duration || 5000;
    setTimeout(() => {
        removeNotificationElement(notification.id);
        markAsRead(notification.id);
    }, duration);

    return notificationElement;
}

/**
 * Удаление уведомления из интерфейса и массива
 * @param {number} id - ID уведомления
 */
function removeNotificationElement(id) {
    // Находим элемент уведомления в контейнере
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

    // Удаляем уведомление из массива
    const index = notifications.findIndex(notif => notif.id === id);
    if (index !== -1) {
        notifications.splice(index, 1);
        notificationCount = Math.max(notificationCount - 1, 0);
        updateBadge();
    }
}

/**
 * Обновление значка уведомлений
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
 * Сброс счётчика уведомлений
 */
function resetBadge() {
    notificationCount = 0;
    updateBadge();
}

/**
 * Добавление уведомления в попап
 * @param {Object} notification - Объект уведомления
 */
function addToPopup(notification) {
    const popupContainer = document.getElementById('popup-notifications');

    // Создаём элемент уведомления в попапе
    const popupNotification = document.createElement('div');
    popupNotification.classList.add('notification');
    popupNotification.setAttribute('data-id', notification.id);

    // Добавляем кнопку закрытия
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => {
        removePopupNotification(notification.id);
        markAsRead(notification.id);
    };
    popupNotification.appendChild(closeBtn);

    // Добавляем текст уведомления
    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.innerText = notification.message;
    popupNotification.appendChild(messageSpan);

    // Добавляем уведомление в попап (сверху)
    popupContainer.insertBefore(popupNotification, popupContainer.firstChild);

    // Запускаем анимацию появления
    setTimeout(() => {
        popupNotification.classList.add('show');
    }, 100);
}

/**
 * Удаление уведомления из попапа с анимацией
 * @param {number} id - ID уведомления
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
 * Отметка уведомления как прочитанное через API
 * @param {number} id - ID уведомления
 */
function markAsRead(id) {
    fetch(`/notification/${id}/read`, { // Убедитесь, что эндпоинт совпадает с бэкендом
        method: 'PUT',
        headers: {

            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Уведомление ${id} отмечено как прочитанное.`);
            } else {
                console.error(`Не удалось отметить уведомление ${id} как прочитанное.`);
            }
        })
        .catch(error => {
            console.error(`Ошибка при отметке уведомления ${id} как прочитанного:`, error);
        });
}

/**
 * Загрузка существующих уведомлений через REST API
 */
function loadExistingNotifications() {
    fetch('/notification/getNotification', { // Убедитесь, что эндпоинт совпадает с бэкендом
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const popupContainer = document.getElementById('popup-notifications');
            popupContainer.innerHTML = ''; // Очистить текущие уведомления

            // Ограничиваем до последних пяти уведомлений
            const lastFive = data.slice(0, MAX_NOTIFICATIONS);

            lastFive.forEach(notification => {
                const popupNotification = document.createElement('div');
                popupNotification.classList.add('notification');
                popupNotification.setAttribute('data-id', notification.id);
                if (notification.read) {
                    popupNotification.style.opacity = '0.6'; // Полупрозрачное для прочитанных
                }

                popupNotification.innerHTML = `
                <button class="close-btn"><i class="fas fa-times"></i></button>
                <span class="message">${notification.message}</span>
            `;
                popupContainer.insertBefore(popupNotification, popupContainer.firstChild);

                // Показать уведомление с анимацией
                setTimeout(() => {
                    popupNotification.classList.add('show');
                }, 100);

                // Обработчик закрытия уведомления
                popupNotification.querySelector('.close-btn').addEventListener('click', () => {
                    removePopupNotification(notification.id);
                    markAsRead(notification.id);
                });
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке уведомлений:', error);
        });
}

/**
 * Увеличение счётчика уведомлений
 */
function incrementBadge() {
    notificationCount++;
    updateBadge();
}

/**
 * Обновление значка уведомлений
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
 * Обработчик клика по кнопке уведомлений
 */
document.getElementById('notification-button').addEventListener('click', () => {
    const popup = document.getElementById('notification-popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'flex';
        loadExistingNotifications(); // Загрузить последние пять уведомлений при открытии попапа
    } else {
        popup.style.display = 'none';
    }
    // Сбросить счётчик уведомлений при открытии попапа
    resetBadge();
});

/**
 * Обработчик клика по кнопке закрытия попапа
 */
document.getElementById('close-popup').addEventListener('click', () => {
    const popup = document.getElementById('notification-popup');
    popup.style.display = 'none';
});

/**
 * Инициализация: скрыть попап по умолчанию и установить WebSocket соединение
 */
document.getElementById('notification-popup').style.display = 'none';
initializeWebSocket();
