document.addEventListener('DOMContentLoaded', function() {
    // Отримання елементів

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

    // Повідомлення Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Меню-гамбургер
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Тимчасові дані активних запитів (можна видалити, якщо обробляються на бекенді)
    let myRequestsData = [
        {
            id: 1,
            type: 'housing',
            description: 'Допомагаю сім\'ї з 4 осіб у Львові.',
            status: 'processing',
            additionalData: {
                familyMembers: '4',
                specialNeeds: 'Немає'
            }
        },
        {
            id: 2,
            type: 'medical',
            description: 'Консультую щодо хронічної хвороби.',
            status: 'completed',
            additionalData: {
                medicalCondition: 'Діабет'
            }
        },
        // Додайте більше, якщо потрібно
    ];

    // Тимчасові дані сповіщень (можна видалити, якщо обробляються на бекенді)
    const notificationsData = [
        {
            id: 1,
            message: 'Новий запит на допомогу доступний для перегляду.'
        },
        {
            id: 2,
            message: 'Ваш профіль було успішно оновлено.'
        },
        // Додайте більше, якщо потрібно
    ];

    // Функція для перекладу статусу
    function getStatusName(statusKey) {
        const statusMapping = {
            'pending': 'Очікує',
            'processing': 'В процесі',
            'completed': 'Виконано',
            'rejected': 'Відхилено'
        };
        return statusMapping[statusKey.toLowerCase()] || 'Невідомий статус';
    }

    // Функція для перекладу ключів additionalData
    function getAdditionalDataLabel(key) {
        const additionalDataMapping = {
            'familyMembers': 'Кількість членів сім\'ї',
            'specialNeeds': 'Спеціальні потреби',
            'medicalCondition': 'Медичний стан',
            // Додайте більше ключів за потреби
        };
        return additionalDataMapping[key] || key;
    }

    // Функція для відкриття модального вікна
    function openModal(modal) {
        modal.classList.add('show');
    }

    // Функція для закриття модального вікна
    function closeModalFunction(modal) {
        modal.classList.remove('show');
    }

    // Функція для відображення запитів на допомогу
    function displayHelpRequests() {
        helpRequestsList.innerHTML = '';

        const selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            helpRequestsList.innerHTML = '<p>Будь ласка, оберіть категорії допомоги у секції "Мої категорії допомоги".</p>';
            return;
        }

        // Показуємо індикатор завантаження
        helpRequestsList.innerHTML = '<p>Завантаження запитів...</p>';

        // Здійснюємо запит до бекенду
        fetchHelpRequests(selectedCategories)
            .then(data => {
                renderHelpRequests(data, helpRequestsList, true);
            })
            .catch(error => {
                helpRequestsList.innerHTML = '<p>Сталася помилка при завантаженні запитів. Спробуйте ще раз пізніше.</p>';
            });
    }

    // Функція для відкриття модального вікна з деталями запиту
    function openRequestModal(request, canAccept = true) {
        // Перевіряємо, чи additionalData є рядком, і парсимо його, якщо так
        let additionalData = request.additionalData;
        if (typeof additionalData === 'string') {
            try {
                additionalData = JSON.parse(additionalData);
            } catch (e) {
                console.error('Помилка парсингу additionalData:', e);
                additionalData = {};
            }
        }

        // Перекладаємо статус
        const translatedStatus = getStatusName(request.status);

        // Створюємо HTML для additionalData
        let additionalDataHTML = '';
        if (additionalData && Object.keys(additionalData).length > 0) {
            additionalDataHTML += `<h3>Додаткові дані:</h3><ul>`;
            for (const [key, value] of Object.entries(additionalData)) {
                const label = getAdditionalDataLabel(key);
                additionalDataHTML += `<li><strong>${label}:</strong> ${value}</li>`;
            }
            additionalDataHTML += `</ul>`;
        }

        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${getHelpTypeName(request.type)}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
            <p><strong>Статус:</strong> ${translatedStatus}</p>
            ${additionalDataHTML}
        `;
        acceptRequestBtn.dataset.requestId = request.id;

        // Показуємо або ховаємо кнопку прийняття запиту
        if (canAccept) {
            acceptRequestBtn.style.display = 'block';
        } else {
            acceptRequestBtn.style.display = 'none';
        }

        openModal(requestModal);
    }

    // Функція для відображення власних активних запитів
    async function displayMyActiveRequests() {
        try {
            const helpRequests = await getUserApplications();
            renderHelpRequests(helpRequests, myActiveRequestsList, false);
            openModal(myActiveRequestsModal);
        } catch (error) {
            console.error('Помилка при отриманні запитів:', error);
            showToast('Сталася помилка при отриманні запитів. Спробуйте пізніше.');
        }
    }

    // Функція для рендерингу списку запитів
    function renderHelpRequests(helpRequests, listElement, canAccept = true) {
        listElement.innerHTML = '';

        if (helpRequests.length === 0) {
            listElement.innerHTML = '<p>Наразі немає доступних запитів у ваших обраних категоріях.</p>';
            return;
        }

        helpRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = getHelpTypeName(request.type);

            const requestDesc = document.createElement('p');
            requestDesc.textContent = request.description;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Переглянути';
            viewButton.classList.add('view-btn');
            viewButton.addEventListener('click', () => {
                openRequestModal(request, canAccept);
            });

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(viewButton);

            listElement.appendChild(requestCard);
        });
    }

    // Функція для обробки відправки форми запиту
    async function handleRequestFormSubmit(event) {
        event.preventDefault();

        const requestType = document.getElementById('request-type').value;
        const requestDescription = document.getElementById('request-description').value;

        // Збираємо додаткові дані залежно від типу запиту
        let additionalData = {};

        switch (requestType) {
            case 'housing':
                const familyMembers = document.getElementById('family-members').value;
                const specialNeeds = document.getElementById('special-needs').value;
                additionalData = {
                    familyMembers: familyMembers,
                    specialNeeds: specialNeeds
                };
                break;
            case 'medical':
                const medicalCondition = document.getElementById('medical-condition').value;
                additionalData = {
                    medicalCondition: medicalCondition
                };
                break;
            // ... інші кейси
            default:
                additionalData = {};
        }
        const requestData = {
            type: requestType,
            description: requestDescription,
            additionalData: additionalData
        };

        try {
            const data = await saveApplication(requestData); // Глобальна функція

            showToast(data.message || 'Заявка успішно відправлена.');

            requestForm.reset();
            hideAllAdditionalFields();

            closeModalFunction(requestModal);

        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
            showToast(error.message || 'Сталася помилка при відправці запиту. Спробуйте пізніше.');
        }
    }

    // Функція для отримання ключа типу допомоги
    function getHelpTypeKey(typeName) {
        const mapping = {
            'Житло': 'housing',
            'Медична допомога': 'medical',
            'Юридична допомога': 'legal',
            'Допомога у працевлаштуванні': 'employment',
            'Освітні та професійні програми': 'education',
            'Продукти харчування та предмети першої необхідності': 'food',
            'Фінансова допомога': 'financial'
        };
        return mapping[typeName] || 'other';
    }

    // Функція для отримання назви типу допомоги
    function getHelpTypeName(typeKey) {
        const mapping = {
            'housing': 'Житло',
            'medical': 'Медична допомога',
            'legal': 'Юридична допомога',
            'employment': 'Допомога у працевлаштуванні',
            'education': 'Освітні та професійні програми',
            'food': 'Продукти харчування та предмети першої необхідності',
            'financial': 'Фінансова допомога'
        };
        return mapping[typeKey] || 'Інше';
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

    // Функція для встановлення стану форми категорій на основі збережених даних
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
                const notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item';
                notificationItem.textContent = notification.message;
                notificationsList.appendChild(notificationItem);
            });
        }
    }

    // Функція для показу toast повідомлення
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Функція для перемикання навігаційного меню
    function toggleNav() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    // Слухачі подій

    // Відкриття модального вікна "Запити на допомогу"
    viewRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(helpRequestsModal);
        displayHelpRequests();
    });

    // Закриття модального вікна "Запити на допомогу"
    helpRequestsCloseBtn.addEventListener('click', () => {
        closeModalFunction(helpRequestsModal);
    });

    // Закриття модальних вікон при кліку поза ними
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeModalFunction(requestModal);
        }
        if (event.target === profileModal) {
            closeModalFunction(profileModal);
        }
        if (event.target === notificationsModal) {
            closeModalFunction(notificationsModal);
        }
        if (event.target === helpRequestsModal) {
            closeModalFunction(helpRequestsModal);
        }
        if (event.target === myActiveRequestsModal) {
            closeModalFunction(myActiveRequestsModal);
        }
    });

    // Обробка кліку на кнопку "Прийняти запит"
    acceptRequestBtn.addEventListener('click', () => {
        const requestId = acceptRequestBtn.dataset.requestId;
        if (!requestId) {
            showToast('Помилка: ідентифікатор запиту не знайдено.');
            return;
        }

        acceptHelpRequest(requestId)
            .then(updatedRequest => {
                showToast(`Ви прийняли запит №${requestId}. Дякуємо за вашу допомогу!`);
                closeModalFunction(requestModal);

                // Додаємо запит до "Мої активні запити", якщо його ще немає
                if (!myRequestsData.find(req => req.id === updatedRequest.id)) {
                    myRequestsData.push(updatedRequest);
                    displayMyActiveRequests();
                }
            })
            .catch(error => {
                showToast('Не вдалося прийняти запит. Спробуйте ще раз пізніше.');
            });
    });

    // Відкриття модального вікна "Мої активні запити"
    myActiveRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        displayMyActiveRequests();
    });

    // Закриття модального вікна "Мої активні запити"
    myActiveRequestsCloseBtn.addEventListener('click', () => {
        closeModalFunction(myActiveRequestsModal);
    });

    // Відкриття модального вікна "Налаштування профілю"
    profileSettingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(profileModal);
    });

    // Закриття модального вікна "Налаштування профілю"
    profileCloseBtn.addEventListener('click', () => {
        closeModalFunction(profileModal);
    });

    // Відкриття модального вікна "Сповіщення"
    notificationsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(notificationsModal);
        displayNotifications();
    });

    // Закриття модального вікна "Сповіщення"
    notificationsCloseBtn.addEventListener('click', () => {
        closeModalFunction(notificationsModal);
    });

    // Обробка відправки форми профілю
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Отримуємо значення з форми
        const name = document.getElementById('volunteer-name').value.trim();
        const email = document.getElementById('volunteer-email').value.trim();
        const skills = document.getElementById('volunteer-skills').value.trim();
        const availability = document.getElementById('volunteer-availability').value.trim();

        // Валідація введених даних
        if (name === '' || email === '' || skills === '' || availability === '') {
            showToast('Будь ласка, заповніть всі поля.');
            return;
        }

        // Тут можна додати код для оновлення профілю на сервері

        showToast('Зміни успішно збережено!');
        closeModalFunction(profileModal);
    });

    // Обробка відправки форми категорій
    categoriesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            showToast('Будь ласка, оберіть хоча б одну категорію.');
            return;
        }
        saveCategories(selectedCategories);
        showToast('Ваші категорії допомоги збережено!');
        displayHelpRequests();
    });

    // Перемикання меню-гамбургер
    hamburger.addEventListener('click', toggleNav);

    // Завантаження збережених категорій при завантаженні сторінки
    const savedCategories = loadCategories();
    setCategoriesForm(savedCategories);

    // Закриття навігаційного меню при зміні розміру вікна, якщо необхідно
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});
