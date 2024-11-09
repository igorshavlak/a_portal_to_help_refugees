document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // Вибір елементів
    // --------------------------------------------------

    // Елементи навігації
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Кнопки автентифікації
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    // Модальні вікна
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    // Кнопки закриття
    const loginCloseBtn = loginModal.querySelector('.close-btn');
    const registerCloseBtn = registerModal.querySelector('.close-btn');

    // Форми
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const contactForm = document.getElementById('contact-form');

    // Посилання для переключення між модальними вікнами
    const registerLink = loginModal.querySelector('.register-link');
    const loginLink = registerModal.querySelector('.login-link');

    // Додаткові поля для волонтерів
    const userTypeSelect = document.getElementById('user-type');
    const volunteerFields = document.getElementById('volunteer-fields');

    // Елементи навігації для зміни активного класу
    const navLinkItems = document.querySelectorAll('.nav-links li a');

    // Секції з ідентифікаторами
    const sections = document.querySelectorAll('section[id]');

    // Сповіщення (Toast)
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    // --------------------------------------------------
    // Утиліти
    // --------------------------------------------------

    /**
     * Перемикає гамбургер-меню на мобільних пристроях.
     */
    const toggleHamburgerMenu = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    };

    /**
     * Відкриває задане модальне вікно.
     * @param {HTMLElement} modal - Елемент модального вікна для відкриття.
     */
    const openModal = (modal) => {
        modal.classList.add('show');
    };

    /**
     * Закриває задане модальне вікно.
     * @param {HTMLElement} modal - Елемент модального вікна для закриття.
     */
    const closeModal = (modal) => {
        modal.classList.remove('show');
    };

    /**
     * Відображає сповіщення з заданим повідомленням.
     * @param {string} message - Повідомлення для відображення.
     */
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');

        // Автоматично приховує сповіщення через 3 секунди
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    /**
     * Показує додаткові поля для волонтерів у формі реєстрації.
     */
    const showVolunteerFields = () => {
        volunteerFields.classList.add('show');
    };

    /**
     * Приховує додаткові поля для волонтерів у формі реєстрації.
     */
    const hideVolunteerFields = () => {
        volunteerFields.classList.remove('show');
    };

    // --------------------------------------------------
    // Обробники подій
    // --------------------------------------------------

    // Перемикання гамбургер-меню
    if (hamburger) {
        hamburger.addEventListener('click', toggleHamburgerMenu);
    }

    // Закриття гамбургер-меню при кліку на посилання
    navLinkItems.forEach((link) => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        });
    });

    // Відкриття модального вікна входу
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    // Відкриття модального вікна реєстрації
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    }

    // Закриття модального вікна входу
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', () => {
            closeModal(loginModal);
            loginForm.reset();
        });
    }

    // Закриття модального вікна реєстрації
    if (registerCloseBtn) {
        registerCloseBtn.addEventListener('click', () => {
            closeModal(registerModal);
            registerForm.reset();
            hideVolunteerFields();
        });
    }

    // **Видалено: Закриття модальних вікон при кліку поза ними**
    // Цей код був видалений відповідно до вашого запиту
    /*
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
            loginForm.reset();
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
            registerForm.reset();
            hideVolunteerFields();
        }
    });
    */

    // Переключення з вікна входу на реєстрацію
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    // Переключення з вікна реєстрації на вхід
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Показ/приховування додаткових полів для волонтерів
    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'volunteer') {
                showVolunteerFields();
            } else {
                hideVolunteerFields();
            }
        });
    }

    // Обробка форми входу
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Базова валідація
            if (!email || !password) {
                showToast('Будь ласка, заповніть всі поля.');
                return;
            }

            login();

            console.log('Дані для входу:', { email, password });

            // Скидання форми
            loginForm.reset();

            // Відображення успішного повідомлення
            showToast('Ви успішно увійшли до облікового запису.');

            // Закриття модального вікна
            closeModal(loginModal);
        });
    }

    // Обробка форми реєстрації
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
            const userType = document.getElementById('user-type').value;

            // Базова валідація
            if (!name || !email || !password || !confirmPassword || !userType) {
                showToast('Будь ласка, заповніть всі обов\'язкові поля.');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Паролі не співпадають. Будь ласка, спробуйте ще раз.');
                return;
            }

            // Якщо користувач — волонтер, перевіряємо додаткові поля
            let volunteerSkills = '';

            if (userType === 'volunteer') {
                volunteerSkills = document.getElementById('volunteer-skills').value.trim();

                if (!volunteerSkills) {
                    showToast('Будь ласка, заповніть всі додаткові поля для волонтера.');
                    return;
                }
            }

            // TODO: Реалізувати логіку реєстрації (наприклад, запит до API)

            console.log('Дані для реєстрації:', {
                name,
                email,
                password,
                userType,
                volunteerSkills
            });

            // Скидання форми
            registerForm.reset();
            hideVolunteerFields();

            // Відображення успішного повідомлення
            showToast('Ви успішно зареєструвались. Тепер ви можете увійти до свого облікового запису.');

            // Закриття модального вікна
            closeModal(registerModal);
        });
    }

    // Обробка контактної форми
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                showToast('Будь ласка, заповніть всі поля контактної форми.');
                return;
            }

            // TODO: Реалізувати логіку відправки повідомлення (наприклад, запит до API)

            console.log('Контактна форма:', {
                name,
                email,
                message
            });

            // Скидання форми
            contactForm.reset();

            // Відображення успішного повідомлення
            showToast('Ваше повідомлення успішно відправлено. Дякуємо за звернення!');

        });
    }

    // --------------------------------------------------
    // IntersectionObserver для оновлення активного посилання
    // --------------------------------------------------

    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.6 // Trigger when 60% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (entry.isIntersecting) {
                navLinkItems.forEach((item) => item.classList.remove('active'));
                if (link) {
                    link.classList.add('active');
                }
            }
        });
    }, options);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // --------------------------------------------------
    // Закриття сповіщення при кліку
    // --------------------------------------------------

    toast.addEventListener('click', () => {
        toast.classList.remove('show');
    });
});