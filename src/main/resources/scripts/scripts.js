// --- Код для модального вікна входу ---

// Отримуємо елементи модального вікна входу
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('login-modal');
const loginCloseBtn = loginModal.querySelector('.close-btn');
const loginForm = document.getElementById('login-form');
const registerLink = loginModal.querySelector('.register-link');

// Функції відкриття та закриття модального вікна входу
function openLoginModal(event) {
  if (event) event.preventDefault();
  loginModal.classList.add('show');
}

function closeLoginModal() {
  loginModal.classList.remove('show');
}

// Обробники подій для модального вікна входу
loginBtn.addEventListener('click', openLoginModal);
loginCloseBtn.addEventListener('click', closeLoginModal);

window.addEventListener('click', function(event) {
  if (event.target === loginModal) {
    closeLoginModal();
  }
});

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Тут можна додати AJAX-запит для відправки даних на сервер

  console.log('Email:', email);
  console.log('Password:', password);

  closeLoginModal();
});

// Перехід до модального вікна реєстрації
registerLink.addEventListener('click', function(event) {
  event.preventDefault();
  closeLoginModal();
  openRegisterModal();
});

// --- Код для модального вікна реєстрації ---

// Отримуємо елементи модального вікна реєстрації
const registerBtn = document.querySelector('.register-btn');
const registerModal = document.getElementById('register-modal');
const registerCloseBtn = registerModal.querySelector('.close-btn');
const registerForm = document.getElementById('register-form');
const loginLink = registerModal.querySelector('.login-link');

// Отримуємо елементи для вибору типу користувача та додаткових полів волонтера
const userTypeSelect = document.getElementById('user-type');
const volunteerFields = document.getElementById('volunteer-fields');

// Функції відкриття та закриття модального вікна реєстрації
function openRegisterModal(event) {
  if (event) event.preventDefault();
  registerModal.classList.add('show');
}

function closeRegisterModal() {
  registerModal.classList.remove('show');
}

// Обробники подій для модального вікна реєстрації
registerBtn.addEventListener('click', openRegisterModal);
registerCloseBtn.addEventListener('click', closeRegisterModal);

window.addEventListener('click', function(event) {
  if (event.target === registerModal) {
    closeRegisterModal();
  }
});

// Відображення або приховування полів волонтера при зміні типу користувача
userTypeSelect.addEventListener('change', function() {
  if (this.value === 'volunteer') {
    volunteerFields.style.display = 'block';
  } else {
    volunteerFields.style.display = 'none';
  }
});

// Обробка форми реєстрації
registerForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const userType = document.getElementById('user-type').value;

  // Перевірка співпадіння паролів
  if (password !== confirmPassword) {
    alert('Паролі не співпадають. Будь ласка, перевірте і спробуйте ще раз.');
    return;
  }

  // Перевірка вибору типу користувача
  if (!userType) {
    alert('Будь ласка, виберіть тип користувача.');
    return;
  }

  // Змінні для зберігання даних волонтера
  let volunteerSkills = '';
  let volunteerAvailability = '';

  // Якщо користувач — волонтер, отримуємо додаткові поля
  if (userType === 'volunteer') {
    volunteerSkills = document.getElementById('volunteer-skills').value;
    volunteerAvailability = document.getElementById('volunteer-availability').value;
  }

  // Тут можна додати AJAX-запит для відправки даних на сервер

  console.log('Ім\'я:', name);
  console.log('Email:', email);
  console.log('Пароль:', password);
  console.log('Тип користувача:', userType);

  if (userType === 'volunteer') {
    console.log('Навички та досвід:', volunteerSkills);
    console.log('Доступність:', volunteerAvailability);
  }

  closeRegisterModal();
});

// Перехід до модального вікна входу
loginLink.addEventListener('click', function(event) {
  event.preventDefault();
  closeRegisterModal();
  openLoginModal();
});