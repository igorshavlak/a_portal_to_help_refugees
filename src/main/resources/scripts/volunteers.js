document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи

    // Кнопки на головній сторінці
    const viewRequestsBtn = document.getElementById('view-requests-btn');
    const myActiveRequestsBtn = document.getElementById('my-active-requests-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const notificationsBtn = document.getElementById('notifications-btn');

    // Секції
    const myCategoriesSection = document.getElementById('my-categories-section');
    const categoriesForm = document.getElementById('categories-form');

    // Модальні вікна
    const helpRequestsModal = document.getElementById('help-requests-modal');
    const helpRequestsCloseBtn = document.querySelector('.help-requests-close-btn');
    const helpRequestsList = document.getElementById('help-requests-list');

    const myActiveRequestsModal = document.getElementById('my-active-requests-modal');
    const myActiveRequestsCloseBtn = document.querySelector('.my-active-requests-close-btn');
    const myActiveRequestsList = document.getElementById('my-active-requests-list');

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
        {
            id: 3,
            type: 'Юридична допомога',
            description: 'Потрібна допомога з оформленням документів.',
            status: 'Новий'
        },
        {
            id: 4,
            type: 'Допомога у працевлаштуванні',
            description: 'Потрібна консультація з написання резюме.',
            status: 'Новий'
        },
        {
            id: 5,
            type: 'Освітні та професійні програми',
            description: 'Потрібна допомога в організації освітніх курсів.',
            status: 'Новий'
        },
        {
            id: 6,
            type: 'Продукти харчування та предмети першої необхідності',
            description: 'Потрібна допомога у зборі продуктів для біженців.',
            status: 'Новий'
        },
        {
            id: 7,
            type: 'Фінансова допомога',
            description: 'Потрібна фінансова підтримка для сім\'ї.',
            status: 'Новий'
        }
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

    // Функція для відкриття модального вікна
    function openModal(modal) {
        modal.classList.add('show');
    }

    // Функція для закриття модального вікна
    function closeModal(modal) {
        modal.classList.remove('show');
    }

    // Функція для відображення списку запитів у модальному вікні "Запити на допомогу"
    function displayHelpRequests() {
        helpRequestsList.innerHTML = '';

        const selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            helpRequestsList.innerHTML = '<p>Будь ласка, оберіть категорії допомоги у секції "Мої категорії допомоги".</p>';
            return;
        }

        // Фільтрація запитів за вибраними категоріями
        const filteredRequests = requestsData.filter(request => selectedCategories.includes(getHelpTypeKey(request.type)));

        if (filteredRequests.length === 0) {
            helpRequestsList.innerHTML = '<p>Наразі немає доступних запитів у ваших обраних категоріях.</p>';
            return;
        }

        filteredRequests.forEach(request => {
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

            helpRequestsList.appendChild(requestCard);
        });
    }

    // Функція для відкриття модального вікна з деталями запиту
    function openRequestModal(request) {
        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${request.type}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
            <p><strong>Статус:</strong> ${request.status}</p>
        `;
        acceptRequestBtn.dataset.requestId = request.id;
        openModal(requestModal);
    }

    // Функція для відображення "Моїх активних запитів" у модальному вікні
    function displayMyActiveRequests() {
        myActiveRequestsList.innerHTML = '';

        if (myRequestsData.length === 0) {
            myActiveRequestsList.innerHTML = '<p>Наразі у вас немає активних запитів.</p>';
            return;
        }

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

            myActiveRequestsList.appendChild(requestCard);
        });

        openModal(myActiveRequestsModal);
    }

    // Функція для отримання ключа типу допомоги з назви
    function getHelpTypeKey(typeName) {
        switch(typeName) {
            case 'Житло':
                return 'housing';
            case 'Медична допомога':
                return 'medical';
            case 'Юридична допомога':
                return 'legal';
            case 'Допомога у працевлаштуванні':
                return 'employment';
            case 'Освітні та професійні програми':
                return 'education';
            case 'Продукти харчування та предмети першої необхідності':
                return 'food';
            case 'Фінансова допомога':
                return 'financial';
            default:
                return 'other';
        }
    }

    // Функція для отримання назви типу допомоги з ключа
    function getHelpTypeName(typeKey) {
        switch(typeKey) {
            case 'housing':
                return 'Житло';
            case 'medical':
                return 'Медична допомога';
            case 'legal':
                return 'Юридична допомога';
            case 'employment':
                return 'Допомога у працевлаштуванні';
            case 'education':
                return 'Освітні та професійні програми';
            case 'food':
                return 'Продукти харчування та предмети першої необхідності';
            case 'financial':
                return 'Фінансова допомога';
            default:
                return 'Інше';
        }
    }

    // Функція для отримання вибраних категорій з форми
    function getSelectedCategories() {
        const checkedBoxes = categoriesForm.querySelectorAll('input[name="categories"]:checked');
        const categories = Array.from(checkedBoxes).map(cb => cb.value);
        return categories;
    }

    // Функція для збереження вибраних категорій у LocalStorage
    function saveCategories(categories) {
        localStorage.setItem('volunteerCategories', JSON.stringify(categories));
    }

    // Функція для завантаження вибраних категорій з LocalStorage
    function loadCategories() {
        const categories = localStorage.getItem('volunteerCategories');
        return categories ? JSON.parse(categories) : [];
    }

    // Функція для встановлення вибраних чекбоксів на основі збережених категорій
    function setCategoriesForm(categories) {
        categoriesForm.querySelectorAll('input[name="categories"]').forEach(cb => {
            cb.checked = categories.includes(cb.value);
        });
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

    // Обробники подій

    // Відкриття модального вікна "Запити на допомогу"
    viewRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(helpRequestsModal);
        displayHelpRequests();
    });

    // Закриття модального вікна "Запити на допомогу"
    helpRequestsCloseBtn.addEventListener('click', () => {
        closeModal(helpRequestsModal);
    });

    // Закриття модальних вікон при кліку поза ними
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeModal(requestModal);
        }
        if (event.target === profileModal) {
            closeModal(profileModal);
        }
        if (event.target === notificationsModal) {
            closeModal(notificationsModal);
        }
        if (event.target === helpRequestsModal) {
            closeModal(helpRequestsModal);
        }
        if (event.target === myActiveRequestsModal) {
            closeModal(myActiveRequestsModal);
        }
    });

    // Обробник події для кнопки "Прийняти запит"
    acceptRequestBtn.addEventListener('click', () => {
        const requestId = acceptRequestBtn.dataset.requestId;
        // Тут можна додати код для оновлення статусу запиту на сервері
        alert(`Ви прийняли запит №${requestId}. Дякуємо за вашу допомогу!`);
        closeModal(requestModal);

        // Додавання запиту до "Моїх активних запитів"
        const acceptedRequest = requestsData.find(req => req.id == requestId);
        if (acceptedRequest) {
            acceptedRequest.status = 'В процесі';
            myRequestsData.push({
                id: acceptedRequest.id,
                type: acceptedRequest.type,
                description: acceptedRequest.description,
                status: acceptedRequest.status
            });
            displayMyActiveRequests();
        }
    });

    // Відкриття модального вікна "Мої активні запити"
    myActiveRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        displayMyActiveRequests();
    });

    // Закриття модального вікна "Мої активні запити"
    myActiveRequestsCloseBtn.addEventListener('click', () => {
        closeModal(myActiveRequestsModal);
    });

    // Відкриття модального вікна "Налаштування профілю"
    profileSettingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(profileModal);
    });

    // Закриття модального вікна "Налаштування профілю"
    profileCloseBtn.addEventListener('click', () => {
        closeModal(profileModal);
    });

    // Відкриття модального вікна "Сповіщення"
    notificationsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(notificationsModal);
        displayNotifications();
    });

    // Закриття модального вікна "Сповіщення"
    notificationsCloseBtn.addEventListener('click', () => {
        closeModal(notificationsModal);
    });

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
        closeModal(profileModal);
    });

    // Обробник події для збереження категорій
    categoriesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedCategories = getSelectedCategories();
        saveCategories(selectedCategories);
        alert('Ваші категорії допомоги збережено!');
        displayHelpRequests();
    });

    // Завантаження вибраних категорій при завантаженні сторінки
    const savedCategories = loadCategories();
    setCategoriesForm(savedCategories);
});