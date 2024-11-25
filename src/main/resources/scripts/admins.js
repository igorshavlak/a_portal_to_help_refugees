document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи з DOM

    // Кнопки на головній сторінці
    const viewRefugeesBtn = document.getElementById('view-refugees-btn');
    const viewRequestsBtn = document.getElementById('view-requests-btn');

    // Модальні вікна
    const refugeesModal = document.getElementById('refugees-modal');
    const refugeesCloseBtn = document.querySelector('.refugees-close-btn');
    const refugeesList = document.getElementById('refugees-list');

    const requestsModal = document.getElementById('requests-modal');
    const requestsCloseBtn = document.querySelector('.requests-close-btn');
    const requestsList = document.getElementById('requests-list');

    const requestDetailsModal = document.getElementById('request-details-modal');
    const requestDetailsCloseBtn = document.querySelector('.request-details-close-btn');
    const requestDetails = document.getElementById('request-details');

    const downloadDocumentBtn = document.getElementById('download-document-btn');
    const approveRequestBtn = document.getElementById('approve-request-btn');
    const rejectRequestBtn = document.getElementById('reject-request-btn');

    // Модальне вікно для введення причини відмови
    const rejectReasonModal = document.getElementById('reject-reason-modal');
    const rejectReasonCloseBtn = document.querySelector('.reject-reason-close-btn');
    const rejectReasonTextarea = document.getElementById('reject-reason-textarea');
    const submitRejectReasonBtn = document.getElementById('submit-reject-reason-btn');

    // Пошук біженців
    const refugeeSearchInput = document.getElementById('refugee-search-input');
    const refugeeSearchBtn = document.getElementById('refugee-search-btn');

    // Фільтр категорій для заявок
    const categorySelect = document.getElementById('category-select');

    // Toast повідомлення
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Гамбургер меню
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Дані біженців та заявок
    let refugeesData = [];
    let requestsData = [];

    // Функція для відкриття модального вікна
    function openModal(modal) {
        modal.classList.add('show');
    }

    // Функція для закриття модального вікна
    function closeModal(modal) {
        modal.classList.remove('show');
    }

    // Функція для показу Toast повідомлення
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Функція для відображення списку біженців
    function displayRefugees(filterEmail = '') {
        // Реалізуйте цю функцію відповідно до ваших потреб
    }

    // Функція для отримання заявок з бекенду
    async function fetchRequests() {
        try {
            const response = await fetch('/applications/getConsiderationApplications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }

            requestsData = await response.json();
        } catch (error) {
            console.error('Помилка при отриманні заявок:', error);
            showToast('Сталася помилка при завантаженні заявок. Спробуйте пізніше.');
        }
    }

    // Функція для відображення списку заявок
    function displayRequests(filterCategory = 'all') {
        requestsList.innerHTML = '';

        let filteredRequests = requestsData;

        if (filterCategory !== 'all') {
            filteredRequests = requestsData.filter(request => request.type === filterCategory);
        }

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p>Наразі немає заявок у цій категорії.</p>';
            return;
        }

        filteredRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';

            const refugeeName = request.refugee ? `${request.refugee.name} ${request.refugee.surname}` : 'Невідомий';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = `${getHelpTypeName(request.type)} від ${refugeeName}`;

            const requestDesc = document.createElement('p');
            requestDesc.textContent = request.description;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Переглянути деталі';
            viewButton.addEventListener('click', () => {
                openRequestDetailsModal(request);
            });

            requestCard.appendChild(requestTitle);
            requestCard.appendChild(requestDesc);
            requestCard.appendChild(viewButton);

            requestsList.appendChild(requestCard);
        });
    }

    // Функція для відкриття модального вікна з деталями заявки
    function openRequestDetailsModal(request) {
        // Отримуємо об'єкт біженця з заявки
        const refugeeData = request.refugee;

        // Створюємо HTML для відображення даних біженця
        const refugeeInfoHTML = `
        <h3>Дані біженця</h3>
        <p><strong>Ім'я:</strong> ${refugeeData.name} ${refugeeData.surname}</p>
        <p><strong>Email:</strong> ${refugeeData.email}</p>
        <p><strong>Телефон:</strong> ${refugeeData.phone}</p>
        <p><strong>Місто:</strong> ${refugeeData.city}</p>
        <p><strong>Країна:</strong> ${refugeeData.country}</p>
        `;

        // Створюємо HTML для відображення деталей заявки
        const requestDetailsHTML = `
        <h3>Деталі заявки</h3>
        <p><strong>Тип допомоги:</strong> ${getHelpTypeName(request.type)}</p>
        <p><strong>Опис ситуації:</strong> ${request.description}</p>
        <p><strong>Статус:</strong> ${getStatusName(request.status)}</p>
        `;

        // Об'єднуємо інформацію про біженця та заявку
        requestDetails.innerHTML = refugeeInfoHTML + requestDetailsHTML;

        // Зберігаємо поточну заявку для подальшого використання
        window.currentRequest = request;

        openModal(requestDetailsModal);
    }

    // Обробники подій

    // Відкриття модального вікна "Список біженців"
    viewRefugeesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        displayRefugees();
        openModal(refugeesModal);
    });

    // Закриття модального вікна "Список біженців"
    refugeesCloseBtn.addEventListener('click', () => {
        closeModal(refugeesModal);
    });

    // Пошук біженців за електронною поштою
    refugeeSearchBtn.addEventListener('click', () => {
        const searchValue = refugeeSearchInput.value.trim();
        displayRefugees(searchValue);
    });

    // Відкриття модального вікна "Заявки на підтвердження"
    viewRequestsBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await fetchRequests();
        displayRequests();
        openModal(requestsModal);
    });

    // Закриття модального вікна "Заявки на підтвердження"
    requestsCloseBtn.addEventListener('click', () => {
        closeModal(requestsModal);
    });

    // Фільтрація заявок за категорією
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        displayRequests(selectedCategory);
    });

    // Закриття модального вікна "Деталі заявки"
    requestDetailsCloseBtn.addEventListener('click', () => {
        closeModal(requestDetailsModal);
    });

    downloadDocumentBtn.addEventListener('click', () => {
        const request = window.currentRequest;

        if (!request.base64File) {
            showToast('Файл недоступний для завантаження.');
            return;
        }

        try {
            // Декодуємо Base64-рядок у бінарні дані
            const byteCharacters = atob(request.base64File);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Встановлюємо MIME-тип за замовчуванням
            const fileType = 'application/pdf';

            // Створюємо Blob з бінарних даних
            const blob = new Blob([byteArray], { type: fileType });

            // Встановлюємо ім'я файлу за замовчуванням
            const fileName = `document_${request.id}`;

            // Створюємо посилання для завантаження
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Помилка при обробці файлу:', error);
            showToast('Сталася помилка при завантаженні файлу.');
        }
    });


    // Обробник події для кнопки "Підтвердити заявку"
    approveRequestBtn.addEventListener('click', async () => {
        const requestId = window.currentRequest.id;
        try {
            const response = await fetch(`/applications/approve/${requestId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }

            showToast('Заявку успішно підтверджено.');
            closeModal(requestDetailsModal);
            // Оновлюємо список заявок
            await fetchRequests();
            displayRequests(categorySelect.value);
        } catch (error) {
            console.error('Помилка при підтвердженні заявки:', error);
            showToast('Сталася помилка при підтвердженні заявки.');
        }
    });

    // Обробник події для кнопки "Відхилити заявку"
    rejectRequestBtn.addEventListener('click', () => {
        openModal(rejectReasonModal);
    });

    // Закриття модального вікна "Причина відмови"
    rejectReasonCloseBtn.addEventListener('click', () => {
        closeModal(rejectReasonModal);
    });

    // Обробник події для відправки причини відмови
    submitRejectReasonBtn.addEventListener('click', async () => {
        const requestId = window.currentRequest.id;
        const reason = rejectReasonTextarea.value.trim();

        if (!reason) {
            showToast('Будь ласка, введіть причину відмови.');
            return;
        }

        try {
            const response = await fetch(`/applications/reject/${requestId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }

            showToast('Заявку успішно відхилено.');
            closeModal(rejectReasonModal);
            closeModal(requestDetailsModal);
            // Оновлюємо список заявок
            await fetchRequests();
            displayRequests(categorySelect.value);
        } catch (error) {
            console.error('Помилка при відхиленні заявки:', error);
            showToast('Сталася помилка при відхиленні заявки.');
        }
    });

    // Закриття модальних вікон при кліку поза ними
    window.addEventListener('click', function(event) {
        if (event.target === refugeesModal) {
            closeModal(refugeesModal);
        }
        if (event.target === requestsModal) {
            closeModal(requestsModal);
        }
        if (event.target === requestDetailsModal) {
            closeModal(requestDetailsModal);
        }
        if (event.target === rejectReasonModal) {
            closeModal(rejectReasonModal);
        }
    });

    // Обробник події для гамбургер меню
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Функція для закриття навігаційного меню при зміні розміру вікна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Допоміжні функції
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

    function getStatusName(statusKey) {
        const statusMapping = {
            'pending': 'На розгляді',
            'approved': 'Підтверджено',
            'rejected': 'Відхилено'
        };
        return statusMapping[statusKey.toLowerCase()] || 'Невідомий статус';
    }
});
