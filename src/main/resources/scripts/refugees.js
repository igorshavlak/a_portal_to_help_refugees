window.currentApplicationId = null;
let myRequestsData = [];


document.addEventListener('DOMContentLoaded', function() {
    // --------------------------------------------------
    // Elements Selection
    // --------------------------------------------------

    // Buttons to open modals
    const requestHelpBtn = document.getElementById('request-help-btn');
    const viewMyRequestsBtn = document.getElementById('view-my-requests-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const notificationsBtn = document.getElementById('notifications-btn');

    // Modal elements
    const requestModal = document.getElementById('request-modal');
    const myRequestsModal = document.getElementById('my-requests-modal');
    const profileModal = document.getElementById('profile-modal');
    const notificationsModal = document.getElementById('notifications-modal');
    const requestDetailsModal = document.getElementById('request-details-modal');

    // Close buttons for modals
    const requestCloseBtn = document.querySelector('.request-close-btn');
    const myRequestsCloseBtn = document.querySelector('.my-requests-close-btn');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const notificationsCloseBtn = document.querySelector('.notifications-close-btn');
    const requestDetailsCloseBtn = document.querySelector('.request-details-close-btn');

    // Forms
    const requestForm = document.getElementById('request-form');
    const profileForm = document.getElementById('profile-form');

    // Select for request type
    const requestTypeSelect = document.getElementById('request-type');

    // Lists inside modals
    const myRequestsList = document.getElementById('my-requests-list');
    const notificationsList = document.getElementById('notifications-list');

    // List inside request details modal
    const requestDetailsContent = document.getElementById('request-details-content');

    // Hamburger menu elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');



    const refugeeImageInput = document.getElementById('refugee-profile-image');
    const refugeeImagePreview = document.getElementById('refugee-profile-preview');

    // Елементи фільтрації для "Мої активні запити"
    const filterStartDateInput = document.getElementById('filter-start-date');
    const filterEndDateInput = document.getElementById('filter-end-date');
    const searchNameInput = document.getElementById('search-name');
    const filterTypeSelect = document.getElementById('filter-type');
    const filterStatusSelect = document.getElementById('filter-status');

// Додайте обробники подій для нових селектів
    filterStartDateInput.addEventListener('change', applyFiltersAndRender);
    filterEndDateInput.addEventListener('change', applyFiltersAndRender);
    searchNameInput.addEventListener('input', applyFiltersAndRender);
    filterTypeSelect.addEventListener('change', applyFiltersAndRender);
    filterStatusSelect.addEventListener('change', applyFiltersAndRender);

    const fileInput = document.getElementById('supporting-document');
    const fileNameDisplay = document.getElementById('file-name-display');

    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Файл не обрано';
        }
    });





    refugeeImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                refugeeImagePreview.src = e.target.result;
                refugeeImagePreview.classList.add('show');
            }
            reader.readAsDataURL(file);
        } else {
            refugeeImagePreview.src = '#';
            refugeeImagePreview.classList.remove('show');
        }
    });



    function applyFiltersAndRender() {
        let filteredData = myRequestsData;

        // Отримуємо значення фільтрів
        const searchName = searchNameInput.value.toLowerCase();
        const filterStartDate = filterStartDateInput.value ? new Date(filterStartDateInput.value) : null;
        const filterEndDate = filterEndDateInput.value ? new Date(filterEndDateInput.value) : null;
        const filterType = filterTypeSelect.value;
        const filterStatus = filterStatusSelect.value;

        // Валідація дат
        if (filterStartDate && filterEndDate && filterStartDate > filterEndDate) {
            showToast('Дата початку не може бути пізнішою за дату закінчення.');
            return;
        }

        // Застосовуємо фільтри
        filteredData = filteredData.filter(request => {
            let matchesSearch = true;
            let matchesDate = true;
            let matchesType = true;
            let matchesStatus = true;

            // Перевірка наявності полів у об'єкті
            const typeName = getHelpTypeName(request.type || '').toLowerCase();
            const description = (request.description || '').toLowerCase();
            const createdAt = new Date(request.createdAt);
            const type = request.type;
            const status = request.status;

            // Фільтр за пошуком
            if (searchName) {
                matchesSearch = typeName.includes(searchName) || description.includes(searchName);
            }

            // Фільтр за датою
            if (filterStartDate && filterEndDate) {
                matchesDate = createdAt >= filterStartDate && createdAt <= filterEndDate;
            } else if (filterStartDate) {
                matchesDate = createdAt >= filterStartDate;
            } else if (filterEndDate) {
                matchesDate = createdAt <= filterEndDate;
            }

            // Фільтр за типом
            if (filterType) {
                matchesType = type === filterType;
            }

            // Фільтр за статусом
            if (filterStatus) {
                matchesStatus = status.toLowerCase() === filterStatus.toLowerCase();
            }

            return matchesSearch && matchesDate && matchesType && matchesStatus;
        });

        renderMyRequests(filteredData);
    }



    // --------------------------------------------------
    // Toast Notification Setup
    // --------------------------------------------------

    /**
     * Function to show toast notification.css
     * @param {string} message - The message to display in the toast
     */
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');

        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --------------------------------------------------
    // Translation Functions
    // --------------------------------------------------

    /**
     * Function to translate status from internal key to Ukrainian
     * @param {string} statusKey - The status key (e.g., 'pending', 'processing')
     * @returns {string} - Translated status in Ukrainian
     */
    function getStatusName(statusKey) {
        const statusMapping = {
            'pending': 'Очікує',
            'processing': 'В процесі',
            'completed': 'Виконано',
            'rejected': 'Відхилено'
        };
        return statusMapping[statusKey.toLowerCase()] || 'Невідомий статус';
    }

    /**
     * Function to translate help type from internal key to Ukrainian
     * @param {string} typeKey - The type key (e.g., 'housing', 'medical')
     * @returns {string} - Translated type in Ukrainian
     */
    function getHelpTypeName(typeKey) {
        const typeMapping = {
            'housing': 'Житло',
            'medical': 'Медична допомога',
            'legal': 'Юридична допомога',
            'employment': 'Допомога у працевлаштуванні',
            'education': 'Освітні та професійні програми',
            'food': 'Продукти харчування та предмети першої необхідності',
            'financial': 'Фінансова допомога'
        };
        return typeMapping[typeKey] || 'Інше';
    }

    /**
     * Function to translate additionalData keys to Ukrainian labels
     * @param {string} key - The key from additionalData
     * @returns {string} - Translated label in Ukrainian
     */
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
            // Додайте більше ключів за потреби
        };
        return additionalDataMapping[key] || key;
    }

    // --------------------------------------------------
    // Modal Functions
    // --------------------------------------------------

    /**
     * Function to open a modal
     * @param {HTMLElement} modal - The modal element to open
     */
    function openModal(modal) {
        modal.classList.add('show');
    }

    /**
     * Function to close a modal
     * @param {HTMLElement} modal - The modal element to close
     */
    function closeModalFunction(modal) {
        modal.classList.remove('show');
    }

    // --------------------------------------------------
    // Display Functions
    // --------------------------------------------------

    /**
     * Function to display the user's help requests
     */
    async function displayMyRequests() {
        myRequestsList.innerHTML = '';

        try {
            const response = await fetch('/applications/getUserApplications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Помилка: ${response.statusText}`);
            }

            const helpRequests = await response.json();
            myRequestsData = helpRequests;
            applyFiltersAndRender();
            openModal(myRequestsModal);
        } catch (error) {
            console.error('Помилка при отриманні запитів:', error);
            showToast('Сталася помилка при отриманні запитів. Спробуйте пізніше.');
        }
    }

    /**
     * Function to render the list of help requests in the modal
     * @param {Array} helpRequests - Array of help request objects
     */
    function renderMyRequests(helpRequests) {
        myRequestsList.innerHTML = '';

        if (helpRequests.length === 0) {
            myRequestsList.innerHTML = '<p>Наразі у вас немає активних запитів.</p>';
            return;
        }

        helpRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'my-request-card';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = getHelpTypeName(request.type);

            const requestDesc = document.createElement('p');
            requestDesc.textContent = request.description;

            const requestStatus = document.createElement('p');
            requestStatus.innerHTML = `<strong>Статус:</strong> ${getStatusName(request.status)}`;

            const requestDate = document.createElement('p');
            const date = new Date(request.createdAt || Date.now());
            requestDate.innerHTML = `<strong>Дата створення:</strong> ${date.toLocaleDateString()}`;

            // Додати кнопку "Переглянути"
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Переглянути';
            viewButton.classList.add('view-btn');
            viewButton.addEventListener('click', () => {
                openRequestDetailsModal(request);
            });

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(requestStatus);
            requestCard.appendChild(requestDate);
            requestCard.appendChild(viewButton);

            myRequestsList.appendChild(requestCard);
        });
    }

    /**
     * Function to render notifications in the modal
     */
    async function displayNotifications() {
        notificationsList.innerHTML = '';

        try {
            const response = await fetch('/notifications/getUserNotifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Помилка: ${response.statusText}`);
            }

            const notifications = await response.json();
            renderNotifications(notifications);
            openModal(notificationsModal);
        } catch (error) {
            console.error('Помилка при отриманні сповіщень:', error);
            showToast('Сталася помилка при отриманні сповіщень. Спробуйте пізніше.');
        }
    }

    /**
     * Function to render notifications
     * @param {Array} notifications - Array of notification.css objects
     */
    function renderNotifications(notifications) {
        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p>Наразі у вас немає нових сповіщень.</p>';
            return;
        }

        notifications.forEach(notification => {
            const notificationItem = document.createElement('p');
            notificationItem.textContent = notification.message;
            notificationsList.appendChild(notificationItem);
        });
    }

    /**
     * Function to open the request details modal with translated fields and volunteer info if applicable
     * @param {Object} request - The help request object
     */
    function openRequestDetailsModal(request) {
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

        // Створюємо HTML для даних волонтера
        let volunteerHTML = '';
        if (request.volunteer) {
            volunteerHTML += `
            <div class="volunteer-info">
                <h4>Дані Волонтера:</h4>
                <ul>
                    <li><strong>Ім'я:</strong> ${request.volunteer.name}</li>
                    <li><strong>Прізвище:</strong> ${request.volunteer.surname}</li>
                    <li><strong>Телефон:</strong> ${request.volunteer.phone}</li>
                    <li><strong>Місто:</strong> ${request.volunteer.city}</li>
                    <li><strong>Країна:</strong> ${request.volunteer.country}</li>
                    <li><strong>Навички/Досвід:</strong> ${request.volunteer.skillsOrExperience}</li>
                </ul>
            </div>
        `;
        } else if (request.status.toLowerCase() === 'processing') {
            // Якщо статус "В процесі", але волонтер не призначений
            volunteerHTML += `
            <div class="volunteer-info">
                <h4>Дані Волонтера:</h4>
                <p>Волонтер ще не прийняв цю заявку.</p>
            </div>
        `;
        }

        // Об'єднуємо всі частини
        requestDetailsContent.innerHTML = `
        <p><strong>Тип допомоги:</strong> ${getHelpTypeName(request.type)}</p>
        <p><strong>Опис ситуації:</strong> ${request.description}</p>
        <p><strong>Статус:</strong> ${translatedStatus}</p>
        ${additionalDataHTML}
        ${volunteerHTML}
    `;

        openModal(requestDetailsModal);
    }



    // --------------------------------------------------
    // Form Handling
    // --------------------------------------------------

    /**
     * Function to handle changes in the request type select
     * Shows additional fields based on the selected type
     */
    function handleRequestTypeChange() {
        const selectedType = requestTypeSelect.value;
        hideAllAdditionalFields();

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

    /**
     * Function to hide all additional fields in the request form
     */
    function hideAllAdditionalFields() {
        const additionalFields = document.querySelectorAll('.additional-fields');
        additionalFields.forEach(field => {
            field.classList.remove('show');
        });
    }

    /**
     * Function to handle submission of the request form
     * @param {Event} event - The form submission event
     */
    async function handleRequestFormSubmit(event) {
        event.preventDefault();

        const requestType = document.getElementById('request-type').value;
        const requestDescription = document.getElementById('request-description').value;

        // Collect additional data based on request type
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
            case 'legal':
                const legalIssue = document.getElementById('legal-issue').value;
                additionalData = {
                    legalIssue: legalIssue
                };
                break;
            case 'employment':
                const currentEmployment = document.getElementById('current-employment').value;
                const desiredJob = document.getElementById('desired-job').value;
                additionalData = {
                    currentEmployment: currentEmployment,
                    desiredJob: desiredJob
                };
                break;
            case 'education':
                const currentEducation = document.getElementById('current-education').value;
                const desiredProgram = document.getElementById('desired-program').value;
                additionalData = {
                    currentEducation: currentEducation,
                    desiredProgram: desiredProgram
                };
                break;
            case 'food':
                const foodItems = document.getElementById('food-items').value;
                additionalData = {
                    foodItems: foodItems
                };
                break;
            case 'financial':
                const financialAmount = document.getElementById('financial-amount').value;
                const financialPurpose = document.getElementById('financial-purpose').value;
                additionalData = {
                    financialAmount: financialAmount,
                    financialPurpose: financialPurpose
                };
                break;
            default:
                additionalData = {};
        }
        // Отримуємо файл з поля введення
        const fileInput = document.getElementById('supporting-document');
        const file = fileInput.files[0];

        // Створюємо FormData для відправки даних, включаючи файл
        const formData = new FormData();
        formData.append('type', requestType);
        formData.append('description', requestDescription);
        formData.append('additionalData', JSON.stringify(additionalData));

        // Додаємо файл, якщо він обраний
        // У функції handleRequestFormSubmit
        if (file) {
            const maxSize = 5 * 1024 * 1024;

            if (file.size > maxSize) {
                showToast('Розмір файлу перевищує 5 МБ.');
                return;
            }

            // Допустимі типи файлів
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                showToast('Непідтримуваний формат файлу.');
                return;
            }

            formData.append('supportingDocument', file);
        }

        try {
            // Відправка даних на сервер
            const response = await fetch('/applications/save', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showToast(data.message || 'Заявка успішно подана.');
                requestForm.reset();
                hideAllAdditionalFields();
                closeModalFunction(requestModal);
            } else {
                showToast(data.message || 'Сталася помилка при подачі заявки.');
            }

        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
            showToast('Сталася помилка при відправці запиту. Спробуйте пізніше.');
        }
    }

    /**
     * Function to handle submission of the profile form
     * @param {Event} event - The form submission event
     */




    // --------------------------------------------------
    // Utility Functions
    // --------------------------------------------------

    /**
     * Function to get the display name of the help type based on its value
     * @param {string} type - The value of the help type
     * @returns {string} - The display name of the help type
     */
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

    // --------------------------------------------------
    // Event Listeners
    // --------------------------------------------------

    // Open request modal
    requestHelpBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(requestModal);
    });

    // Close request modal
    requestCloseBtn.addEventListener('click', function() {
        closeModalFunction(requestModal);
        hideAllAdditionalFields();
        requestForm.reset();
    });

    // Open my requests modal
    viewMyRequestsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        displayMyRequests();
    });

    // Close my requests modal
    myRequestsCloseBtn.addEventListener('click', function() {
        closeModalFunction(myRequestsModal);
    });

    // Open profile modal
    profileSettingsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(profileModal);
    });

    // Close profile modal
    profileCloseBtn.addEventListener('click', function() {
        closeModalFunction(profileModal);
    });

    // Open notifications modal
    notificationsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        displayNotifications();
    });

    // Close notifications modal
    notificationsCloseBtn.addEventListener('click', function() {
        closeModalFunction(notificationsModal);
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Знайдіть кнопку "Зв'язатися з волонтером"
        const contactVolunteerBtn = document.getElementById('contact-volunteer-btn');

        // Додайте слухач подій
        contactVolunteerBtn.addEventListener('click', function() {
            // Відкрийте модальне вікно чату
            openChatModal();
        });
    });

    // Open request details modal close button
    requestDetailsCloseBtn && requestDetailsCloseBtn.addEventListener('click', function() {
        closeModalFunction(requestDetailsModal);
    });

    // Handle request type change to show/hide additional fields
    requestTypeSelect.addEventListener('change', handleRequestTypeChange);

    // Handle request form submission
    requestForm.addEventListener('submit', handleRequestFormSubmit);

    // Handle profile form submission
    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Отримуємо значення з форми
        const firstName = document.getElementById('refugee-name').value.trim();
        const lastName = document.getElementById('refugee-last-name').value.trim();
        const phone = document.getElementById('refugee-phone').value.trim();
        const city = document.getElementById('refugee-city').value.trim();
        const birthDate = document.getElementById('refugee-birth-date').value;
        const country = document.getElementById('refugee-country').value.trim();

        // Валідація введених даних
        if (!firstName || !lastName || !phone || !city || !birthDate || !country) {
            showToast('Будь ласка, заповніть всі поля.');
            return;
        }
        let profileImageBase64 = '';
        const file = refugeeImageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                profileImageBase64 = await readFileAsBase64(file);
            } catch (error) {
                console.error('Помилка при читанні файлу:', error);
                showToast('Не вдалося завантажити зображення. Спробуйте ще раз.');
                return;
            }
        }

        const refugeeData = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            city: city,
            birthDate: birthDate,
            country: country,
            profileImage: profileImageBase64 // Додаємо зображення
        };

        try {
            const response = await fetch('/user/updateVolunteerDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(refugeeData)
            });

            const result = await response.text();

            if (response.ok) {
                showToast(result || 'Зміни успішно збережено!');
                closeModalFunction(profileModal);
                populateUserProfile(refugeeData); // Оновлюємо DOM з новими даними
            } else {
                showToast(result || 'Сталася помилка при збереженні змін.');
            }
        } catch (error) {
            console.error('Помилка при відправці даних біженця:', error);
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

    async function initializeProfile() {
        try {
            const response = await fetch('/user/getUserDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Не вдалося отримати дані профілю.');
            }

            const userData = await response.json();
            const refugeeData = {
                firstName: userData.name,
                lastName: userData.surname,
                phone: userData.phone,
                city: userData.city,
                birthDate: userData.dateOfBirth,
                country: userData.country,
                profileImage: userData.profileImage
            };

            populateUserProfile(refugeeData);
        } catch (error) {
            console.error('Помилка при завантаженні профілю:', error);
            showToast('Не вдалося завантажити ваш профіль. Спробуйте пізніше.');
        }
    }


    /**
     * Function to populate the user's profile in the DOM
     * @param {Object} user - The user profile data
     */
    function populateUserProfile(user) {
        if (!user) return;

        // Оновлення імені користувача в героїчній секції
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }

        // Оновлення полів форми налаштувань профілю
        document.getElementById('refugee-name').value = user.firstName || '';
        document.getElementById('refugee-last-name').value = user.lastName || '';
        document.getElementById('refugee-phone').value = user.phone || '';
        document.getElementById('refugee-city').value = user.city || '';
        document.getElementById('refugee-birth-date').value = user.birthDate ? user.birthDate.split('T')[0] : '';
        document.getElementById('refugee-country').value = user.country || '';
        document.getElementById('refugee-status').value = user.status || 'не підтверджено';
        const refugeeImagePreview = document.getElementById('refugee-profile-preview');
        if (user.profileImage) {
            refugeeImagePreview.src = `data:image/jpeg;base64,${user.profileImage}`;
            refugeeImagePreview.classList.add('show');
        } else {
            refugeeImagePreview.src = '#';
            refugeeImagePreview.classList.remove('show');
        }
    }



    // Toggle navigation menu on hamburger click
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close modals when clicking outside of them
    window.addEventListener('click', function(event) {
        if (event.target === requestModal) {
            closeModalFunction(requestModal);
            hideAllAdditionalFields();
            requestForm.reset();
        }
        if (event.target === myRequestsModal) {
            closeModalFunction(myRequestsModal);
        }
        if (event.target === profileModal) {
            closeModalFunction(profileModal);
        }
        if (event.target === notificationsModal) {
            closeModalFunction(notificationsModal);
        }
        if (event.target === requestDetailsModal) {
            closeModalFunction(requestDetailsModal);
        }
    });
    initializeProfile();
});
