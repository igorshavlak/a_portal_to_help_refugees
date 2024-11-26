// /scripts/volunteers.js
window.currentApplicationId = null;
let myActiveRequestsData = [];
let helpRequestsData = [];


document.addEventListener('DOMContentLoaded', function() {
    // Отримання елементів
    window.currentRequestId = null;

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

    const chatModal = document.getElementById('chatModal');
    const chatCloseBtn = document.querySelector('.chat-close-btn');

    // Повідомлення Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    // Всередині DOMContentLoaded
    const searchNameInput = document.getElementById('search-name');
    const filterTypeSelect = document.getElementById('filter-type');
    const filterStatusSelect = document.getElementById('filter-status');

    // Елементи фільтрації для "Запитів на допомогу"
    const helpSearchNameInput = document.getElementById('help-search-name');
    const helpFilterTypeSelect = document.getElementById('help-filter-type');
    const helpFilterStatusSelect = document.getElementById('help-filter-status');
    // Для "Мої активні запити"
    const filterCitySelect = document.getElementById('filter-city');
    filterCitySelect.addEventListener('change', applyFiltersAndRender);

// Для "Запити на допомогу"
    const helpFilterCitySelect = document.getElementById('help-filter-city');
    helpFilterCitySelect.addEventListener('change', applyHelpFiltersAndRender);

// Додайте це в розділ отримання елементів
    const completeRequestBtn = document.getElementById('complete-request-btn');
    const confirmCompleteModal = document.getElementById('confirm-complete-modal');
    const confirmCompleteCloseBtn = document.querySelector('.confirm-complete-close-btn');
    const confirmCompleteForm = document.getElementById('confirm-complete-form');
    const confirmHelpProvidedCheckbox = document.getElementById('confirm-help-provided');

    // Меню-гамбургер
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');


    const volunteerImageInput = document.getElementById('volunteer-profile-image');
    const volunteerImagePreview = document.getElementById('volunteer-profile-preview');


    searchNameInput.addEventListener('input', applyFiltersAndRender);
    filterTypeSelect.addEventListener('change', applyFiltersAndRender);
    filterStatusSelect.addEventListener('change', applyFiltersAndRender);

    function applyHelpFiltersAndRender() {
        let filteredData = helpRequestsData;

        // Отримуємо значення фільтрів
        const searchName = helpSearchNameInput.value.toLowerCase();
        const filterCity = helpFilterCitySelect.value.toLowerCase();

        // Застосовуємо фільтри
        filteredData = filteredData.filter(request => {
            let matchesSearch = true;
            let matchesCity = true;

            // Перевіряємо наявність та приводимо до нижнього регістру
            const typeName = getHelpTypeName(request.type || '').toLowerCase();
            const description = (request.description || '').toLowerCase();
            const city = (request.refugee && request.refugee.city) ? request.refugee.city.toLowerCase() : '';

            // Фільтр за пошуком
            if (searchName) {
                matchesSearch = typeName.includes(searchName) || description.includes(searchName);
            }

            // Фільтр за містом
            if (filterCity) {
                matchesCity = city === filterCity;
            }

            return matchesSearch && matchesCity;
        });

        renderHelpRequests(filteredData, helpRequestsList, true);
    }
    // Обробка кліку на кнопку "Завершити заявку"
    completeRequestBtn.addEventListener('click', () => {
        openModal(confirmCompleteModal);
    });
    // Закриття модального вікна підтвердження
    confirmCompleteCloseBtn.addEventListener('click', () => {
        closeModalFunction(confirmCompleteModal);
        confirmCompleteForm.reset();
    });
    // Обробка відправки форми підтвердження
    confirmCompleteForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!confirmHelpProvidedCheckbox.checked) {
            showToast('Будь ласка, підтвердіть, що ви надали всю необхідну допомогу.');
            return;
        }

        try {
            // Отримайте id заявки (вже збережено в window.currentApplicationId)
            const applicationId = window.currentApplicationId;

            // Відправте запит на бекенд
            const response = await fetch(`/applications/complete/${applicationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                showToast('Заявку успішно завершено!');
                closeModalFunction(confirmCompleteModal);
                closeModalFunction(requestModal);

            } else {
                const errorText = await response.text();
                showToast('Помилка при завершенні заявки: ' + errorText);
            }

        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
            showToast('Сталася помилка при завершенні заявки.');
        }
    });




    function applyFiltersAndRender() {
        let filteredData = myActiveRequestsData;

        // Отримуємо значення фільтрів
        const searchName = document.getElementById('search-name').value.toLowerCase();
        const filterType = document.getElementById('filter-type').value;
        const filterStatus = document.getElementById('filter-status').value;
        const filterCity = document.getElementById('filter-city').value.toLowerCase();

        // Застосовуємо фільтри
        filteredData = filteredData.filter(request => {
            let matchesSearch = true;
            let matchesType = true;
            let matchesStatus = true;
            let matchesCity = true;

            // Перевірка наявності полів у об'єкті
            const typeName = getHelpTypeName(request.type || '').toLowerCase();
            const description = (request.description || '').toLowerCase();
            const status = (request.status || '').toLowerCase();
            const city = (request.refugee && request.refugee.city) ? request.refugee.city.toLowerCase() : '';

            if (searchName) {
                matchesSearch = typeName.includes(searchName) || description.includes(searchName);
            }

            if (filterType) {
                matchesType = request.type === filterType;
            }

            if (filterStatus) {
                matchesStatus = status === filterStatus.toLowerCase();
            }

            if (filterCity) {
                matchesCity = city === filterCity;
            }

            return matchesSearch && matchesType && matchesStatus && matchesCity;
        });

        renderHelpRequests(filteredData, myActiveRequestsList, false);
    }




    volunteerImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                volunteerImagePreview.src = e.target.result;
                volunteerImagePreview.classList.add('show');
            }
            reader.readAsDataURL(file);
        } else {
            volunteerImagePreview.src = '#';
            volunteerImagePreview.classList.remove('show');
        }
    });


    // Кнопка відкриття чату (припускаємо, що є кнопка з ID "open-chat-btn")
    const openChatBtn = document.getElementById('openChatBtn');

    // Тимчасові дані активних запитів (можна видалити, якщо обробляються на бекенді)
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

    async function fetchUserProfile() {
        try {
            const response = await fetch('/user/getUserDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Не вдалося отримати дані користувача.');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Помилка при завантаженні профілю користувача:', error);
            showToast('Не вдалося завантажити ваш профіль. Спробуйте пізніше.');
            return null;
        }
    }

    function populateUserProfile(user) {
        if (!user) return;

        // Оновлення імені користувача в героїчній секції
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }

        // Оновлення полів форми налаштувань профілю
        document.getElementById('volunteer-first-name').value = user.firstName || '';
        document.getElementById('volunteer-last-name').value = user.lastName || '';
        document.getElementById('volunteer-birth-date').value = user.birthDate ? user.birthDate.split('T')[0] : '';
        document.getElementById('volunteer-phone').value = user.phone || '';
        document.getElementById('volunteer-skills').value = user.skillsAndExperience || '';
        document.getElementById('volunteer-city').value = user.city || '';
        document.getElementById('volunteer-country').value = user.country || '';
        const volunteerImagePreview = document.getElementById('volunteer-profile-preview');
        if (user.profileImage) {
            volunteerImagePreview.src = `data:image/jpeg;base64,${user.profileImage}`;
            volunteerImagePreview.classList.add('show');
        } else {
            volunteerImagePreview.src = '#';
            volunteerImagePreview.classList.remove('show');
        }
    }
    async function initializeProfile() {
        const user = await fetchUserProfile();
        const volunteerData = {
            firstName: user.name,
            lastName: user.surname,
            birthDate: user.dateOfBirth,
            phone: user.phone,
            skillsAndExperience: user.skillsOrExperience,
            city: user.city,
            country: user.country,
            profileImage: user.profileImage
        };
        populateUserProfile(volunteerData);
    }

    initializeProfile();


    // Функція для перекладу статусу
    function getStatusName(statusKey) {
        const statusMapping = {
            'pending': 'Очікує',
            'processing': 'В процесі',
            'completed': 'Виконано',
            'rejected': 'Відхилено',
            'consideration':'Очікує підтвердження'
        };
        return statusMapping[statusKey.toLowerCase()] || 'Невідомий статус';
    }

    // Функція для перекладу ключів additionalData
    function getAdditionalDataLabel(key) {
        const additionalDataMapping = {
            'familyMembers': 'Кількість членів сім\'ї',
            'specialNeeds': 'Спеціальні потреби',
            'medicalCondition': 'Медичний стан',
            'legalIssue': 'Юридична проблема',
            'currentEmployment': 'Поточний статус зайнятості',
            'desiredJob': 'Бажана посада',
            'currentEducation': 'Поточний рівень освіти',
            'desiredProgram': 'Бажана освітня або професійна програма',
            'foodItems': 'Перелік необхідних продуктів та предметів',
            'financialAmount': 'Необхідна сума',
            'financialPurpose': 'Мета фінансової допомоги'
        };
        return additionalDataMapping[key] || key;
    }

    // Функція для відкриття модального вікна
    function openModal(modal) {
        if (modal) {
            modal.classList.add('show');
        } else {
            console.error('Модальне вікно не знайдено!');
        }
    }

    // Функція для закриття модального вікна
    function closeModalFunction(modal) {
        if (modal) {
            modal.classList.remove('show');
        } else {
            console.error('Модальне вікно не знайдено!');
        }
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
                helpRequestsData = data; // Зберігаємо отримані заявки
                applyHelpFiltersAndRender(); // Застосовуємо фільтри та рендеримо список
            })
            .catch(error => {
                helpRequestsList.innerHTML = '<p>Сталася помилка при завантаженні запитів. Спробуйте ще раз пізніше.</p>';
            });
    }
    // Функція для відкриття модального вікна з деталями запиту
    function openRequestModal(request, canAccept = true) {
        // Перевіряємо, чи additionalData є рядком, і парсимо його, якщо так
        window.currentApplicationId = request.id;
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

        // Створюємо HTML для даних біженця
        let refugeeHTML = '';
        if (request.refugee) {
            refugeeHTML += `
            <div class="refugee-info">
                <h4>Дані Біженця:</h4>
                <ul>
                    <li><strong>Ім'я:</strong> ${request.refugee.name} ${request.refugee.surname}</li>
                    <li><strong>Дата народження:</strong> ${new Date(request.refugee.dateOfBirth).toLocaleDateString()}</li>
                    <li><strong>Статус:</strong> ${request.refugee.status}</li>
                    <li><strong>Телефон:</strong> ${request.refugee.phone}</li>
                    <li><strong>Місто:</strong> ${request.refugee.city}</li>
                    <li><strong>Країна:</strong> ${request.refugee.country}</li>
                </ul>
            </div>
           
            `;
        }

        // Об'єднуємо всі частини
        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${getHelpTypeName(request.type)}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
            <p><strong>Статус:</strong> ${translatedStatus}</p>
            ${additionalDataHTML}
            ${refugeeHTML}
        `;
        acceptRequestBtn.dataset.requestId = request.id;

        // Показуємо або ховаємо кнопку прийняття запиту
        if (canAccept) {
          openChatBtn.style.display = 'none';
            acceptRequestBtn.style.display = 'block';
            completeRequestBtn.style.display = 'none';

        } else {
            acceptRequestBtn.style.display = 'none';
            openChatBtn.style.display = 'block';
            completeRequestBtn.style.display = 'block';
        }

        openModal(requestModal);
    }

    // Функція для відображення власних активних запитів
    async function displayMyActiveRequests() {
        try {
            const helpRequests = await getUserApplications();
            myActiveRequestsData = helpRequests;
            applyFiltersAndRender();
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

            const requestStatus = document.createElement('p');
            requestStatus.innerHTML = `<strong>Статус:</strong> ${getStatusName(request.status)}`;

            // Відображення міста
            const requestCity = document.createElement('p');
            const city = (request.refugee && request.refugee.city) ? request.refugee.city : 'Невідомо';
            requestCity.innerHTML = `<strong>Місто:</strong> ${city}`;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Переглянути';
            viewButton.classList.add('view-btn');
            viewButton.addEventListener('click', () => {
                openRequestModal(request, canAccept);
            });

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(requestStatus);
            requestCard.appendChild(requestCity);
            requestCard.appendChild(viewButton);

            listElement.appendChild(requestCard);
        });
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
        if (event.target === chatModal) {
            closeModalFunction(chatModal);
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

    // Закриття модального вікна чату
    chatCloseBtn.addEventListener('click', () => {
        closeModalFunction(chatModal);
    });

    // Відкриття модального вікна чату (якщо є кнопка з ID "open-chat-btn")
    if (openChatBtn) {
        openChatBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(chatModal);
        });
    }

    // Обробка відправки форми профілю
    profileForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Запобігаємо стандартній відправці форми

        // Отримуємо значення з форми
        const firstName = document.getElementById('volunteer-first-name').value.trim();
        const lastName = document.getElementById('volunteer-last-name').value.trim();
        const birthDate = document.getElementById('volunteer-birth-date').value.trim();
        const phone = document.getElementById('volunteer-phone').value.trim();
        const skillsAndExperience = document.getElementById('volunteer-skills').value.trim();
        const city = document.getElementById('volunteer-city').value.trim();
        const country = document.getElementById('volunteer-country').value.trim();

        // Валідація введених даних
        if (!firstName || !lastName || !birthDate || !phone || !skillsAndExperience || !city || !country) {
            showToast('Будь ласка, заповніть всі поля.');
            return;
        }
        let profileImageBase64 = '';
        const file = volunteerImageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                profileImageBase64 = await readFileAsBase64(file);
            } catch (error) {
                console.error('Помилка при читанні файлу:', error);
                showToast('Не вдалося завантажити зображення. Спробуйте ще раз.');
                return;
            }
        }
        // Створюємо об'єкт даних
        const volunteerData = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            phone: phone,
            skillsAndExperience: skillsAndExperience,
            city: city,
            country: country,
            profileImage: profileImageBase64 // Додаємо зображення
        };

        try {
            const response = await fetch('/user/updateVolunteerDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(volunteerData)
            });

            const result = await response.text();

            if (response.ok) {
                showToast(result || 'Зміни успішно збережено!');
                closeModalFunction(profileModal);
                populateUserProfile(volunteerData); // Оновлюємо DOM з новими даними
            } else {
                showToast(result || 'Сталася помилка при збереженні змін.');
            }
        } catch (error) {
            console.error('Помилка при відправці даних волонтера:', error);
            showToast('Сталася помилка при відправці даних. Спробуйте пізніше.');
        }
    });
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result.split(',')[1]); // Вилучаємо префікс data:image/...;base64,
            }
            reader.onerror = function(error) {
                reject(error);
            }
            reader.readAsDataURL(file);
        });
    }

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
