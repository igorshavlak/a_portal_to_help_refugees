document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи

    // Кнопки на головній сторінці
    const viewRequestsBtn = document.getElementById('view-requests-btn');
    const myActiveRequestsBtn = document.getElementById('my-active-requests-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const notificationsBtn = document.getElementById('notifications-btn');

    // Секції
    const requestsSection = document.getElementById('requests-section');
    const requestsList = document.getElementById('requests-list');

    const myRequestsSection = document.getElementById('my-requests-section');
    const myRequestsList = document.getElementById('my-requests-list');

    // Модальні вікна
    const requestModal = document.getElementById('request-modal');
    const requestCloseBtn = document.querySelector('.request-close-btn');
    const requestDetails = document.getElementById('request-details');
    const acceptRequestBtn = document.getElementById('accept-request-btn');

    const profileModal = document.getElementById('profile-modal');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const profileForm = document.getElementById('profile-form');

    const notificationsModal = document.getElementById('notifications-modal');
    const notificationsCloseBtn = document.querySelector('.notifications-close-btn');
    const notificationsList = document.getElementById('notifications-list');

    // Дані запитів (тимчасово, поки немає серверної частини)
    const requestsData = [
        {
            id: 1,
            type: 'Житло',
            description: 'Потрібне тимчасове житло для сім\'ї з 4 осіб у Львові.',
            status: 'Новий'
        },
        {
            id: 2,
            type: 'Медична допомога',
            description: 'Потрібен лікар для консультації щодо хронічної хвороби.',
            status: 'Новий'
        },
        // Додайте більше запитів за потреби
    ];

    // Тимчасові дані активних запитів
    const myRequestsData = [
        {
            id: 1,
            type: 'Житло',
            description: 'Допомагаю сім\'ї з 4 осіб у Львові.',
            status: 'В процесі'
        },
        {
            id: 2,
            type: 'Медична допомога',
            description: 'Консультую щодо хронічної хвороби.',
            status: 'Виконано'
        },
        // Додайте більше запитів за потреби
    ];

    // Тимчасові дані сповіщень
    const notificationsData = [
        {
            id: 1,
            message: 'Новий запит на допомогу доступний для перегляду.'
        },
        {
            id: 2,
            message: 'Ваш профіль було успішно оновлено.'
        },
        // Додайте більше сповіщень за потреби
    ];

    // Функція для відображення списку запитів
    function displayRequests() {
        requestsList.innerHTML = '';

        requestsData.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = request.type;

            const requestDesc = document.createElement('p');
            requestDesc.textContent = request.description;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Переглянути';
            viewButton.addEventListener('click', () => {
                openRequestModal(request);
            });

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(viewButton);

            requestsList.appendChild(requestCard);
        });
    }

    // Функція для відкриття модального вікна з деталями запиту
    function openRequestModal(request) {
        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${request.type}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
        `;
        acceptRequestBtn.dataset.requestId = request.id;
        requestModal.classList.add('show');
    }

    // Функція для закриття модального вікна
    function closeRequestModal() {
        requestModal.classList.remove('show');
    }

    // Функція для відображення "Моїх активних запитів"
    function displayMyRequests() {
        myRequestsSection.style.display = 'block';
        myRequestsList.innerHTML = '';

        myRequestsData.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'my-request-card';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = request.type;

            const requestDesc = document.createElement('p');
            requestDesc.textContent = request.description;

            const requestStatus = document.createElement('p');
            requestStatus.innerHTML = `<span class="status">Статус:</span> ${request.status}`;

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(requestStatus);

            myRequestsList.appendChild(requestCard);
        });

        // Прокручуємо до секції "Мої активні запити"
        myRequestsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Функція для відкриття модального вікна "Налаштування профілю"
    function openProfileModal(event) {
        event.preventDefault();
        profileModal.classList.add('show');
    }

    // Функція для закриття модального вікна "Налаштування профілю"
    function closeProfileModal() {
        profileModal.classList.remove('show');
    }

    // Функція для відкриття модального вікна "Сповіщення"
    function openNotificationsModal(event) {
        event.preventDefault();
        notificationsModal.classList.add('show');
        displayNotifications();
    }

    // Функція для закриття модального вікна "Сповіщення"
    function closeNotificationsModal() {
        notificationsModal.classList.remove('show');
    }

    // Функція для відображення сповіщень
    function displayNotifications() {
        notificationsList.innerHTML = '';

        if (notificationsData.length === 0) {
            notificationsList.innerHTML = '<p>Наразі у вас немає нових сповіщень.</p>';
        } else {
            notificationsData.forEach(notification => {
                const notificationItem = document.createElement('p');
                notificationItem.textContent = notification.message;
                notificationsList.appendChild(notificationItem);
            });
        }
    }

    // Обробник події для кнопки "Переглянути запити на допомогу"
    viewRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        requestsSection.style.display = 'block';
        displayRequests();
        // Прокручуємо до секції запитів
        requestsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Обробники подій для модального вікна запиту
    requestCloseBtn.addEventListener('click', closeRequestModal);

    // Обробники подій для модальних вікон
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeRequestModal();
        }
        if (event.target === profileModal) {
            closeProfileModal();
        }
        if (event.target === notificationsModal) {
            closeNotificationsModal();
        }
    });

    // Обробник події для кнопки "Прийняти запит"
    acceptRequestBtn.addEventListener('click', () => {
        const requestId = acceptRequestBtn.dataset.requestId;
        // Тут можна додати код для оновлення статусу запиту на сервері
        alert(`Ви прийняли запит №${requestId}. Дякуємо за вашу допомогу!`);
        closeRequestModal();
    });

    // Обробники подій для кнопок "Мої активні запити", "Налаштування профілю", "Сповіщення"
    myActiveRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        displayMyRequests();
    });

    profileSettingsBtn.addEventListener('click', openProfileModal);
    profileCloseBtn.addEventListener('click', closeProfileModal);

    notificationsBtn.addEventListener('click', openNotificationsModal);
    notificationsCloseBtn.addEventListener('click', closeNotificationsModal);

    // Обробник події для відправки форми профілю
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Отримуємо значення полів
        const name = document.getElementById('volunteer-name').value;
        const email = document.getElementById('volunteer-email').value;
        const skills = document.getElementById('volunteer-skills').value;
        const availability = document.getElementById('volunteer-availability').value;

        // Тут можна додати код для оновлення даних профілю на сервері

        alert('Зміни успішно збережено!');
        closeProfileModal();
    });
});