document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи модального вікна запиту
    const requestHelpBtn = document.getElementById('request-help-btn');
    const requestModal = document.getElementById('request-modal');
    const requestCloseBtn = document.querySelector('.request-close-btn');
    const requestForm = document.getElementById('request-form');
    const requestTypeSelect = document.getElementById('request-type');

    // Отримуємо елементи для інших модальних вікон
    const viewMyRequestsBtn = document.getElementById('view-my-requests-btn');
    const myRequestsModal = document.getElementById('my-requests-modal');
    const myRequestsCloseBtn = document.querySelector('.my-requests-close-btn');
    const myRequestsList = document.getElementById('my-requests-list');

    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const profileForm = document.getElementById('profile-form');

    const notificationsBtn = document.getElementById('notifications-btn');
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
        const requestsList = document.getElementById('requests-list');
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
            <p><strong>Статус:</strong> ${request.status}</p>
        `;
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

    // Функція для показу додаткових полів залежно від типу допомоги
    function handleRequestTypeChange() {
        const selectedType = requestTypeSelect.value;
        hideAllAdditionalFields(); // Спочатку сховати всі додаткові поля

        if (selectedType === 'housing') {
            document.getElementById('housing-fields').classList.add('show');
        } else if (selectedType === 'medical') {
            document.getElementById('medical-fields').classList.add('show');
        } else if (selectedType === 'legal') {
            document.getElementById('legal-fields').classList.add('show');
        } else if (selectedType === 'employment') {
            document.getElementById('employment-fields').classList.add('show');
        } else if (selectedType === 'education') {
            document.getElementById('education-fields').classList.add('show');
        } else if (selectedType === 'food') {
            document.getElementById('food-fields').classList.add('show');
        } else if (selectedType === 'financial') {
            document.getElementById('financial-fields').classList.add('show');
        }
    }

    // Функція для сховання всіх додаткових полів
    function hideAllAdditionalFields() {
        const additionalFields = document.querySelectorAll('.additional-fields');
        additionalFields.forEach(function(field) {
            field.classList.remove('show');
        });
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
        hideAllAdditionalFields();
        requestForm.reset();
    });

    // Закриття модальних вікон при кліку поза ними
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeModal(requestModal);
            hideAllAdditionalFields();
            requestForm.reset();
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

    // Відкриття модального вікна "Мої активні запити"
    viewMyRequestsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        displayMyRequests();
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

    // Додавання обробника зміни типу допомоги
    requestTypeSelect.addEventListener('change', handleRequestTypeChange);

    // Обробник подання форми запиту
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const requestType = document.getElementById('request-type').value;
        const requestDescription = document.getElementById('request-description').value;

        // Збір додаткових полів залежно від типу допомоги
        let additionalData = {};

        if (requestType === 'housing') {
            const familyMembers = document.getElementById('family-members').value;
            const specialNeeds = document.getElementById('special-needs').value;
            additionalData = {
                familyMembers: familyMembers,
                specialNeeds: specialNeeds
            };
        } else if (requestType === 'medical') {
            const medicalCondition = document.getElementById('medical-condition').value;
            additionalData = {
                medicalCondition: medicalCondition
            };
        } else if (requestType === 'legal') {
            const legalIssue = document.getElementById('legal-issue').value;
            additionalData = {
                legalIssue: legalIssue
            };
        } else if (requestType === 'employment') {
            const currentEmployment = document.getElementById('current-employment').value;
            const desiredJob = document.getElementById('desired-job').value;
            additionalData = {
                currentEmployment: currentEmployment,
                desiredJob: desiredJob
            };
        } else if (requestType === 'education') {
            const currentEducation = document.getElementById('current-education').value;
            const desiredProgram = document.getElementById('desired-program').value;
            additionalData = {
                currentEducation: currentEducation,
                desiredProgram: desiredProgram
            };
        } else if (requestType === 'food') {
            const foodItems = document.getElementById('food-items').value;
            additionalData = {
                foodItems: foodItems
            };
        } else if (requestType === 'financial') {
            const financialAmount = document.getElementById('financial-amount').value;
            const financialPurpose = document.getElementById('financial-purpose').value;
            additionalData = {
                financialAmount: financialAmount,
                financialPurpose: financialPurpose
            };
        }

        // Створення нового запиту
        const newRequest = {
            id: requestsData.length + 1,
            type: getHelpTypeName(requestType),
            description: requestDescription,
            status: 'Новий',
            additionalData: additionalData
        };

        // Додавання нового запиту до масиву запитів
        requestsData.push(newRequest);

        // Оновлення списку запитів
        displayRequests();

        // Очистка форми та сховання додаткових полів
        requestForm.reset();
        hideAllAdditionalFields();

        // Показати повідомлення про успішне подання
        alert('Ваш запит успішно подано! Ми зв\'яжемося з вами найближчим часом.');

        // Закрити модальне вікно
        closeModal(requestModal);
    });

    // Обробник подання форми профілю
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

    // Функція для отримання назви типу допомоги
    function getHelpTypeName(type) {
        switch(type) {
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
});