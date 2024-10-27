document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи

    // Кнопки на головній сторінці
    const requestHelpBtn = document.getElementById('request-help-btn');
    const viewMyRequestsBtn = document.getElementById('view-my-requests-btn');
    const usefulResourcesBtn = document.getElementById('useful-resources-btn');
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
    const requestForm = document.getElementById('request-form');

    const myRequestsModal = document.getElementById('my-requests-modal');
    const myRequestsCloseBtn = document.querySelector('.my-requests-close-btn');

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

    // Функція для відкриття модального вікна
    function openModal(modal) {
        modal.classList.add('show');
    }

    // Функція для закриття модального вікна
    function closeModal(modal) {
        modal.classList.remove('show');
    }

    // Функція для відображення списку запитів
    function displayRequests() {
        requestsList.innerHTML = '';

        if (requestsData.length === 0) {
            requestsList.innerHTML = '<p>Наразі немає доступних запитів на допомогу.</p>';
            return;
        }

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
        const requestDetails = document.getElementById('request-details');
        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${request.type}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
        `;
        // Можна додати більше деталей за потреби
        openModal(requestModal);
    }

    // Функція для відображення "Моїх активних запитів"
    function displayMyRequests() {
        myRequestsList.innerHTML = '';

        if (myRequestsData.length === 0) {
            myRequestsList.innerHTML = '<p>Наразі у вас немає активних запитів.</p>';
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

            myRequestsList.appendChild(requestCard);
        });

        openModal(myRequestsModal);
    }

    // Функція для відображення сповіщень
    function displayNotifications() {
        notificationsList.innerHTML = '';

        if (notificationsData.length === 0) {
            notificationsList.innerHTML = '<p>Наразі у вас немає нових сповіщень.</p>';
            return;
        }

        notificationsData.forEach(notification => {
            const notificationItem = document.createElement('p');
            notificationItem.textContent = notification.message;
            notificationsList.appendChild(notificationItem);
        });
    }

    // Функція для динамічного додавання полів форми запиту
    function addDynamicFields(selectedType) {
        const additionalFieldsContainer = document.getElementById('additional-fields');
        additionalFieldsContainer.innerHTML = ''; // Очистити попередні додаткові поля

        if (selectedType === 'housing') {
            // Поле для кількості членів сім'ї
            const familySizeLabel = document.createElement('label');
            familySizeLabel.setAttribute('for', 'family-size');
            familySizeLabel.textContent = 'Кількість членів сім\'ї:';
            additionalFieldsContainer.appendChild(familySizeLabel);

            const familySizeInput = document.createElement('input');
            familySizeInput.setAttribute('type', 'number');
            familySizeInput.setAttribute('id', 'family-size');
            familySizeInput.setAttribute('name', 'family-size');
            familySizeInput.setAttribute('min', '1');
            familySizeInput.setAttribute('required', 'required');
            additionalFieldsContainer.appendChild(familySizeInput);

            // Поле для особливих потреб
            const specialNeedsLabel = document.createElement('label');
            specialNeedsLabel.setAttribute('for', 'special-needs');
            specialNeedsLabel.textContent = 'Особливі потреби (якщо є):';
            additionalFieldsContainer.appendChild(specialNeedsLabel);

            const specialNeedsTextarea = document.createElement('textarea');
            specialNeedsTextarea.setAttribute('id', 'special-needs');
            specialNeedsTextarea.setAttribute('name', 'special-needs');
            specialNeedsTextarea.setAttribute('rows', '3');
            additionalFieldsContainer.appendChild(specialNeedsTextarea);
        } else if (selectedType === 'medical') {
            // Поле для типу медичної допомоги
            const medicalTypeLabel = document.createElement('label');
            medicalTypeLabel.setAttribute('for', 'medical-type');
            medicalTypeLabel.textContent = 'Тип медичної допомоги:';
            additionalFieldsContainer.appendChild(medicalTypeLabel);

            const medicalTypeSelect = document.createElement('select');
            medicalTypeSelect.setAttribute('id', 'medical-type');
            medicalTypeSelect.setAttribute('name', 'medical-type');
            medicalTypeSelect.setAttribute('required', 'required');

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = 'Виберіть тип медичної допомоги';
            medicalTypeSelect.appendChild(defaultOption);

            const option1 = document.createElement('option');
            option1.value = 'consultation';
            option1.textContent = 'Консультація';
            medicalTypeSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = 'treatment';
            option2.textContent = 'Лікування';
            medicalTypeSelect.appendChild(option2);

            // Додайте більше опцій за потреби

            additionalFieldsContainer.appendChild(medicalTypeSelect);
        } else if (selectedType === 'legal') {
            // Поле для типу юридичної допомоги
            const legalTypeLabel = document.createElement('label');
            legalTypeLabel.setAttribute('for', 'legal-type');
            legalTypeLabel.textContent = 'Тип юридичної допомоги:';
            additionalFieldsContainer.appendChild(legalTypeLabel);

            const legalTypeSelect = document.createElement('select');
            legalTypeSelect.setAttribute('id', 'legal-type');
            legalTypeSelect.setAttribute('name', 'legal-type');
            legalTypeSelect.setAttribute('required', 'required');

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = 'Виберіть тип юридичної допомоги';
            legalTypeSelect.appendChild(defaultOption);

            const option1 = document.createElement('option');
            option1.value = 'documentation';
            option1.textContent = 'Документація';
            legalTypeSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = 'representation';
            option2.textContent = 'Представництво';
            legalTypeSelect.appendChild(option2);

            // Додайте більше опцій за потреби

            additionalFieldsContainer.appendChild(legalTypeSelect);
        }
        // Додайте інші типи допомоги за потреби
    }

    // Обробник зміни типу допомоги
    const requestTypeSelect = document.getElementById('request-type');
    requestTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        addDynamicFields(selectedType);
    });

    // Функція для відкриття модального вікна з деталями запиту (для запитів на допомогу)
    function openRequestModalFromRequests(request) {
        // Тут можна реалізувати відкриття модального вікна з деталями конкретного запиту
        // Наприклад, показати більше інформації або статусу
    }

    // Функція для обробки подання форми запиту
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const requestType = document.getElementById('request-type').value;
        const requestDescription = document.getElementById('request-description').value;

        // Збір додаткових полів залежно від типу допомоги
        let additionalData = {};

        if (requestType === 'housing') {
            const familySize = document.getElementById('family-size').value;
            const specialNeeds = document.getElementById('special-needs').value;
            additionalData = {
                familySize: familySize,
                specialNeeds: specialNeeds
            };
        } else if (requestType === 'medical') {
            const medicalType = document.getElementById('medical-type').value;
            additionalData = {
                medicalType: medicalType
            };
        } else if (requestType === 'legal') {
            const legalType = document.getElementById('legal-type').value;
            additionalData = {
                legalType: legalType
            };
        }

        // Створення нового запиту
        const newRequest = {
            id: requestsData.length + 1,
            type: requestType === 'housing' ? 'Житло' :
                requestType === 'medical' ? 'Медична допомога' :
                    requestType === 'legal' ? 'Юридична допомога' : 'Інше',
            description: requestDescription,
            status: 'Новий',
            additionalData: additionalData
        };

        // Додавання нового запиту до масиву запитів
        requestsData.push(newRequest);

        // Оновлення списку запитів
        displayRequests();

        // Очистка форми
        requestForm.reset();
        document.getElementById('additional-fields').innerHTML = '';

        // Показати повідомлення про успішне подання
        alert('Ваш запит успішно подано!');

        // Закрити модальне вікно
        closeModal(requestModal);
    });

    // Функція для відкриття модального вікна "Мої активні запити"
    function openMyRequestsModal() {
        displayMyRequests();
    }

    // Обробники подій

    // Відкриття модального вікна запиту на допомогу
    requestHelpBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(requestModal);
    });

    // Закриття модального вікна запиту на допомогу
    requestCloseBtn.addEventListener('click', function() {
        closeModal(requestModal);
    });

    // Відкриття модального вікна "Мої активні запити"
    viewMyRequestsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(myRequestsModal);
        // Можна додати функціонал для завантаження реальних даних
    });

    // Закриття модального вікна "Мої активні запити"
    myRequestsCloseBtn.addEventListener('click', function() {
        closeModal(myRequestsModal);
    });

    // Відкриття модального вікна "Налаштування профілю"
    profileSettingsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(profileModal);
    });

    // Закриття модального вікна "Налаштування профілю"
    profileCloseBtn.addEventListener('click', function() {
        closeModal(profileModal);
    });

    // Відкриття модального вікна "Сповіщення"
    notificationsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        displayNotifications();
        openModal(notificationsModal);
    });

    // Закриття модального вікна "Сповіщення"
    notificationsCloseBtn.addEventListener('click', function() {
        closeModal(notificationsModal);
    });

    // Закриття модальних вікон при кліку поза ними
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeModal(requestModal);
        }
        if (event.target === myRequestsModal) {
            closeModal(myRequestsModal);
        }
        if (event.target === profileModal) {
            closeModal(profileModal);
        }
        if (event.target === notificationsModal) {
            closeModal(notificationsModal);
        }
    });

    // Функція для обробки подання форми профілю
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const userAddress = document.getElementById('user-address').value;
        const userPhone = document.getElementById('user-phone').value;

        // Тут можна додати код для оновлення даних профілю на сервері

        alert('Зміни успішно збережено!');
        closeModal(profileModal);
    });
});
