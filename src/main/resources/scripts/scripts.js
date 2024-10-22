// Отримуємо елементи
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close-btn');
const loginForm = document.getElementById('login-form');

// Функція відкриття модального вікна
function openModal(event) {
  event.preventDefault(); // Запобігаємо переходу за посиланням
  loginModal.style.display = 'flex'; // Використовуємо flex для центрування модального вікна
}

// Функція закриття модального вікна
function closeModal() {
  loginModal.style.display = 'none'; // Ховаємо модальне вікно
}

// Закриття модального вікна при натисканні за його межами
function clickOutsideModal(event) {
  if (event.target === loginModal) {
    closeModal(); // Закриваємо, якщо натискають за межами модального вікна
  }
}

// Функція обробки відправки форми
function handleFormSubmit(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Виводимо введені значення (можна замінити на AJAX-запит)
  console.log('Email:', email);
  console.log('Password:', password);

  // Закриття модального вікна після успішної авторизації
  closeModal();
}

// Додаємо обробники подій
loginBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', clickOutsideModal);
loginForm.addEventListener('submit', handleFormSubmit);