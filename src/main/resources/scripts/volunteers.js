// /scripts/volunteers.js

document.addEventListener('DOMContentLoaded', function() {
    // Get Elements

    // Buttons on the main page
    const viewRequestsBtn = document.getElementById('view-requests-btn');
    const myActiveRequestsBtn = document.getElementById('my-active-requests-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const notificationsBtn = document.getElementById('notifications-btn');

    // Sections
    const myCategoriesSection = document.getElementById('my-categories-section');
    const categoriesForm = document.getElementById('categories-form');

    // Modals
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

    // Toast messages
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Temporary active requests data (can be removed if handled via backend)
    let myRequestsData = [
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
        // Add more if needed
    ];

    // Temporary notifications data (can be removed if handled via backend)
    const notificationsData = [
        {
            id: 1,
            message: 'Новий запит на допомогу доступний для перегляду.'
        },
        {
            id: 2,
            message: 'Ваш профіль було успішно оновлено.'
        },
        // Add more if needed
    ];

    // Function to open a modal
    function openModal(modal) {
        modal.classList.add('show');
    }

    // Function to close a modal
    function closeModalFunction(modal) {
        modal.classList.remove('show');
    }

    // Function to display help requests by fetching from the backend
    function displayHelpRequests() {
        helpRequestsList.innerHTML = '';

        const selectedCategories = getSelectedCategories();
        if (selectedCategories.length === 0) {
            helpRequestsList.innerHTML = '<p>Будь ласка, оберіть категорії допомоги у секції "Мої категорії допомоги".</p>';
            return;
        }

        // Show a loading indicator
        helpRequestsList.innerHTML = '<p>Завантаження запитів...</p>';

        // Make a POST request to the backend using the global fetch function
         fetchHelpRequests(selectedCategories)
            .then(data => {
                helpRequestsList.innerHTML = ''; // Clear the loading text

                if (data.length === 0) {
                    helpRequestsList.innerHTML = '<p>Наразі немає доступних запитів у ваших обраних категоріях.</p>';
                    return;
                }

                data.forEach(request => {
                    const requestCard = document.createElement('div');
                    requestCard.className = 'request-card';

                    const requestTitle = document.createElement('h3');
                    requestTitle.textContent = request.type;

                    const requestDesc = document.createElement('p');
                    requestDesc.textContent = request.description;

                    const viewButton = document.createElement('button');
                    viewButton.textContent = 'Переглянути';
                    viewButton.classList.add('view-btn');
                    viewButton.addEventListener('click', () => {
                        openRequestModal(request);
                    });

                    requestCard.appendChild(requestTitle);
                    requestCard.appendChild(requestDesc);
                    requestCard.appendChild(viewButton);

                    helpRequestsList.appendChild(requestCard);
                });
            })
            .catch(error => {
                helpRequestsList.innerHTML = '<p>Сталася помилка при завантаженні запитів. Спробуйте ще раз пізніше.</p>';
            });
    }

    // Function to open the request details modal
    function openRequestModal(request) {
        requestDetails.innerHTML = `
            <p><strong>Тип допомоги:</strong> ${request.type}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
            <p><strong>Статус:</strong> ${request.status}</p>
        `;
        acceptRequestBtn.dataset.requestId = request.id;
        openModal(requestModal);
    }

    // Function to display active requests
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

    // Function to get the key for help type
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

    // Function to get the name for help type
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

    // Function to get selected categories from the form
    function getSelectedCategories() {
        const checkedBoxes = categoriesForm.querySelectorAll('input[name="categories"]:checked');
        const categories = Array.from(checkedBoxes).map(cb => cb.value);
        return categories;
    }

    // Function to save selected categories to LocalStorage
    function saveCategories(categories) {
        localStorage.setItem('volunteerCategories', JSON.stringify(categories));
    }

    // Function to load selected categories from LocalStorage
    function loadCategories() {
        const categories = localStorage.getItem('volunteerCategories');
        return categories ? JSON.parse(categories) : [];
    }

    // Function to set the categories form based on saved categories
    function setCategoriesForm(categories) {
        categoriesForm.querySelectorAll('input[name="categories"]').forEach(cb => {
            cb.checked = categories.includes(cb.value);
        });
    }

    // Function to display notifications
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

    // Function to show a toast message
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Function to toggle the navigation menu
    function toggleNav() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    // Event Listeners

    // Open "Запити на допомогу" modal
    viewRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(helpRequestsModal);
        displayHelpRequests();
    });

    // Close "Запити на допомогу" modal
    helpRequestsCloseBtn.addEventListener('click', () => {
        closeModalFunction(helpRequestsModal);
    });

    // Close modals when clicking outside of them
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

    // Handle "Прийняти запит" button click
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

                // Add the request to "Мої активні запити" if not already present
                if (!myRequestsData.find(req => req.id === updatedRequest.id)) {
                    myRequestsData.push(updatedRequest);
                    displayMyActiveRequests();
                }
            })
            .catch(error => {
                showToast('Не вдалося прийняти запит. Спробуйте ще раз пізніше.');
            });
    });

    // Open "Мої активні запити" modal
    myActiveRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        displayMyActiveRequests();
    });

    // Close "Мої активні запити" modal
    myActiveRequestsCloseBtn.addEventListener('click', () => {
        closeModalFunction(myActiveRequestsModal);
    });

    // Open "Налаштування профілю" modal
    profileSettingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(profileModal);
    });

    // Close "Налаштування профілю" modal
    profileCloseBtn.addEventListener('click', () => {
        closeModalFunction(profileModal);
    });

    // Open "Сповіщення" modal
    notificationsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(notificationsModal);
        displayNotifications();
    });

    // Close "Сповіщення" modal
    notificationsCloseBtn.addEventListener('click', () => {
        closeModalFunction(notificationsModal);
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Get form values
        const name = document.getElementById('volunteer-name').value.trim();
        const email = document.getElementById('volunteer-email').value.trim();
        const skills = document.getElementById('volunteer-skills').value.trim();
        const availability = document.getElementById('volunteer-availability').value.trim();

        // Validate inputs
        if (name === '' || email === '' || skills === '' || availability === '') {
            showToast('Будь ласка, заповніть всі поля.');
            return;
        }

        // Here you can add code to update the profile on the server

        showToast('Зміни успішно збережено!');
        closeModalFunction(profileModal);
    });

    // Handle categories form submission
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

    // Toggle hamburger menu
    hamburger.addEventListener('click', toggleNav);

    // Load saved categories on page load
    const savedCategories = loadCategories();
    setCategoriesForm(savedCategories);

    // Close navigation menu on window resize if necessary
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});
