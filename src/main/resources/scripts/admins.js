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
    const approveRequestBtn = document.getElementById('approve-request-btn');

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

    // Тимчасові дані біженців (поки немає серверної частини)
    let refugeesData = [
        {
            id: 1,
            name: 'Іван Іванов',
            email: 'ivan@example.com',
            phone: '+380123456789',
            status: 'Активний'
        },
        {
            id: 2,
            name: 'Петро Петренко',
            email: 'petro@example.com',
            phone: '+380987654321',
            status: 'Активний'
        },
        // Додайте більше біженців за потреби
    ];

    // Тимчасові дані заявок
    let requestsData = [
        {
            id: 1,
            refugeeName: 'Іван Іванов',
            type: 'Житло',
            typeKey: 'housing',
            description: 'Потребую тимчасове житло у Львові.',
            status: 'На розгляді'
        },
        {
            id: 2,
            refugeeName: 'Петро Петренко',
            type: 'Медична допомога',
            typeKey: 'medical',
            description: 'Потрібна консультація лікаря.',
            status: 'На розгляді'
        },
        {
            id: 3,
            refugeeName: 'Ольга Ольгович',
            type: 'Юридична допомога',
            typeKey: 'legal',
            description: 'Потрібна допомога з документами.',
            status: 'На розгляді'
        },
        // Додайте більше заявок за потреби
    ];

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
        refugeesList.innerHTML = '';

        let filteredRefugees = refugeesData;

        if (filterEmail.trim() !== '') {
            filteredRefugees = refugeesData.filter(refugee =>
                refugee.email.toLowerCase().includes(filterEmail.toLowerCase())
            );
        }

        if (filteredRefugees.length === 0) {
            refugeesList.innerHTML = '<p>Біженців не знайдено.</p>';
            return;
        }

        filteredRefugees.forEach(refugee => {
            const refugeeCard = document.createElement('div');
            refugeeCard.className = 'refugee-card';

            const refugeeName = document.createElement('h3');
            refugeeName.textContent = refugee.name;

            const refugeeEmail = document.createElement('p');
            refugeeEmail.innerHTML = `<strong>Email:</strong> ${refugee.email}`;

            const refugeePhone = document.createElement('p');
            refugeePhone.innerHTML = `<strong>Телефон:</strong> ${refugee.phone}`;

            const refugeeStatus = document.createElement('p');
            refugeeStatus.innerHTML = `<strong>Статус:</strong> ${refugee.status}`;

            refugeeCard.appendChild(refugeeName);
            refugeeCard.appendChild(refugeeEmail);
            refugeeCard.appendChild(refugeePhone);
            refugeeCard.appendChild(refugeeStatus);

            refugeesList.appendChild(refugeeCard);
        });
    }

    // Функція для відображення списку заявок
    function displayRequests(filterCategory = 'all') {
        requestsList.innerHTML = '';

        let filteredRequests = requestsData;

        if (filterCategory !== 'all') {
            filteredRequests = requestsData.filter(request => request.typeKey === filterCategory);
        }

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p>Наразі немає заявок у цій категорії.</p>';
            return;
        }

        filteredRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';

            const requestTitle = document.createElement('h3');
            requestTitle.textContent = `${request.type} від ${request.refugeeName}`;

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
        requestDetails.innerHTML = `
            <p><strong>Ім'я біженця:</strong> ${request.refugeeName}</p>
            <p><strong>Тип допомоги:</strong> ${request.type}</p>
            <p><strong>Опис ситуації:</strong> ${request.description}</p>
            <p><strong>Статус:</strong> ${request.status}</p>
        `;
        approveRequestBtn.dataset.requestId = request.id;
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
    viewRequestsBtn.addEventListener('click', (event) => {
        event.preventDefault();
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

    // Обробник події для кнопки "Підтвердити заявку"
    approveRequestBtn.addEventListener('click', () => {
        const requestId = approveRequestBtn.dataset.requestId;
        // Знайти заявку за ID
        const requestIndex = requestsData.findIndex(req => req.id == requestId);

        if (requestIndex !== -1) {
            // Оновити статус заявки
            requestsData[requestIndex].status = 'Підтверджено';
            showToast(`Заявку №${requestId} підтверджено.`);
            closeModal(requestDetailsModal);

            // Видалити заявку зі списку "На розгляді"
            requestsData.splice(requestIndex, 1);

            // Оновити список заявок
            displayRequests(categorySelect.value);
        } else {
            showToast('Помилка: Заявку не знайдено.');
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
});