// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // Elements Selection
    // --------------------------------------------------

    // Navigation Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Authentication Buttons
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    // Modals
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    // Close Buttons
    const loginCloseBtn = loginModal.querySelector('.close-btn');
    const registerCloseBtn = registerModal.querySelector('.close-btn');

    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Links to switch between modals
    const registerLink = loginModal.querySelector('.register-link');
    const loginLink = registerModal.querySelector('.login-link');

    // Additional Fields for Volunteers
    const userTypeSelect = document.getElementById('user-type');
    const volunteerFields = document.getElementById('volunteer-fields');

    // Toast Notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    // --------------------------------------------------
    // Utility Functions
    // --------------------------------------------------

    /**
     * Toggles the hamburger menu on mobile devices.
     */
    const toggleHamburgerMenu = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    };

    /**
     * Opens a specified modal.
     * @param {HTMLElement} modal - The modal element to open.
     */
    const openModal = (modal) => {
        modal.classList.add('show');
    };

    /**
     * Closes a specified modal.
     * @param {HTMLElement} modal - The modal element to close.
     */
    const closeModal = (modal) => {
        modal.classList.remove('show');
    };

    /**
     * Displays a toast notification with the given message.
     * @param {string} message - The message to display in the toast.
     */
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');

        // Automatically hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    /**
     * Shows the additional fields for volunteers in the registration form.
     */
    const showVolunteerFields = () => {
        volunteerFields.style.display = 'block';
    };

    /**
     * Hides the additional fields for volunteers in the registration form.
     */
    const hideVolunteerFields = () => {
        volunteerFields.style.display = 'none';
    };

    // --------------------------------------------------
    // Event Listeners
    // --------------------------------------------------

    // Toggle Hamburger Menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleHamburgerMenu);
    }

    // Close Hamburger Menu when a navigation link is clicked
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        });
    });

    // Open Login Modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    // Open Register Modal
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    }

    // Close Login Modal
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', () => {
            closeModal(loginModal);
            loginForm.reset();
        });
    }

    // Close Register Modal
    if (registerCloseBtn) {
        registerCloseBtn.addEventListener('click', () => {
            closeModal(registerModal);
            registerForm.reset();
            hideVolunteerFields();
        });
    }

    // Close Modals When Clicking Outside the Modal Content
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

    // Switch from Login to Register Modal
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    // Switch from Register to Login Modal
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Show/Hide Volunteer Fields Based on User Type Selection
    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'volunteer') {
                showVolunteerFields();
            } else {
                hideVolunteerFields();
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Basic Validation
            if (!email || !password) {
                showToast('Будь ласка, заповніть всі поля.');
                return;
            }

            // TODO: Implement actual authentication logic (e.g., API call)

            console.log('Login Details:', { email, password });

            // Reset the form
            loginForm.reset();

            // Show success message
            showToast('Ви успішно увійшли до облікового запису.');

            // Close the modal
            closeModal(loginModal);
        });
    }

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
            const userType = document.getElementById('user-type').value;

            // Basic Validation
            if (!name || !email || !password || !confirmPassword || !userType) {
                showToast('Будь ласка, заповніть всі обов\'язкові поля.');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Паролі не співпадають. Будь ласка, спробуйте ще раз.');
                return;
            }

            // If user is a volunteer, ensure additional fields are filled
            let volunteerSkills = '';
            let volunteerAvailability = '';

            if (userType === 'volunteer') {
                volunteerSkills = document.getElementById('volunteer-skills').value.trim();
                volunteerAvailability = document.getElementById('volunteer-availability').value.trim();

                if (!volunteerSkills || !volunteerAvailability) {
                    showToast('Будь ласка, заповніть всі додаткові поля для волонтера.');
                    return;
                }
            }

            // TODO: Implement actual registration logic (e.g., API call)

            console.log('Registration Details:', {
                name,
                email,
                password,
                userType,
                volunteerSkills,
                volunteerAvailability
            });

            // Reset the form
            registerForm.reset();
            hideVolunteerFields();

            // Show success message
            showToast('Ви успішно зареєструвались. Тепер ви можете увійти до свого облікового запису.');

            // Close the modal
            closeModal(registerModal);
        });
    }

    // --------------------------------------------------
    // Toast Click to Close
    // --------------------------------------------------

    toast.addEventListener('click', () => {
        toast.classList.remove('show');
    });
});