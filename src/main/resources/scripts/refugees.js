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

    // Close buttons for modals
    const requestCloseBtn = document.querySelector('.request-close-btn');
    const myRequestsCloseBtn = document.querySelector('.my-requests-close-btn');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const notificationsCloseBtn = document.querySelector('.notifications-close-btn');

    // Forms
    const requestForm = document.getElementById('request-form');
    const profileForm = document.getElementById('profile-form');

    // Select for request type
    const requestTypeSelect = document.getElementById('request-type');

    // Lists inside modals
    const myRequestsList = document.getElementById('my-requests-list');
    const notificationsList = document.getElementById('notifications-list');

    // Hamburger menu elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // --------------------------------------------------
    // Toast Notification Setup
    // --------------------------------------------------

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    /**
     * Function to show toast notification
     * @param {string} message - The message to display in the toast
     */
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --------------------------------------------------
    // Data Structures (Temporary Data)
    // --------------------------------------------------

    // Sample data for help requests
    const requestsData = [
        {
            id: 1,
            type: 'Житло',
            description: 'Потрібне тимчасове житло для сім\'ї з 4 осіб у Львові.',
            status: 'Новий',
            additionalData: {
                familyMembers: 4,
                specialNeeds: 'Немає'
            }
        },
        {
            id: 2,
            type: 'Медична допомога',
            description: 'Потрібен лікар для консультації щодо хронічної хвороби.',
            status: 'Новий',
            additionalData: {
                medicalCondition: 'Цукровий діабет'
            }
        },
        // Додайте більше запитів за потреби
    ];

    // Sample data for active requests
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
        // Додайте більше активних запитів за потреби
    ];

    // Sample data for notifications
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
     * Function to display active requests in the modal
     */
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

    /**
     * Function to display notifications in the modal
     */
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

        openModal(notificationsModal);
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
    function handleRequestFormSubmit(event) {
        event.preventDefault();

        const requestType = document.getElementById('request-type').value;
        const requestDescription = document.getElementById('request-description').value;

        // Collect additional data based on request type
        let additionalData = {};

        switch(requestType) {
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

        // Create new request object
        const newRequest = {
            id: requestsData.length + 1,
            type: getHelpTypeName(requestType),
            description: requestDescription,
            status: 'Новий',
            additionalData: additionalData
        };

        // Add new request to the requestsData array
        requestsData.push(newRequest);

        // Optionally, add the new request to myRequestsData if you want the user to see it as active
        // myRequestsData.push({
        //     id: newRequest.id,
        //     type: newRequest.type,
        //     description: newRequest.description,
        //     status: newRequest.status
        // });

        // Reset the form and hide additional fields
        requestForm.reset();
        hideAllAdditionalFields();

        // Show success toast notification
        showToast('Ваш запит успішно подано! Ми зв\'яжемося з вами найближчим часом.');

        // Close the request modal
        closeModalFunction(requestModal);
    }

    /**
     * Function to handle submission of the profile form
     * @param {Event} event - The form submission event
     */
    function handleProfileFormSubmit(event) {
        event.preventDefault();

        const userName = document.getElementById('user-name').value.trim();
        const userEmail = document.getElementById('user-email').value.trim();
        const userAddress = document.getElementById('user-address').value.trim();
        const userPhone = document.getElementById('user-phone').value.trim();

        // Basic validation (additional validation can be added as needed)
        if (!userName || !userEmail || !userAddress || !userPhone) {
            showToast('Будь ласка, заповніть всі поля.');
            return;
        }

        // Here you can add code to update profile data on the server via API

        // Show success toast notification
        showToast('Зміни успішно збережено!');

        // Close the profile modal
        closeModalFunction(profileModal);
    }

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

    // Handle request type change to show/hide additional fields
    requestTypeSelect.addEventListener('change', handleRequestTypeChange);

    // Handle request form submission
    requestForm.addEventListener('submit', handleRequestFormSubmit);

    // Handle profile form submission
    profileForm.addEventListener('submit', handleProfileFormSubmit);

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
    });

});