// Отримуємо елементи
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close-btn');

// Відкриття модального вікна при натисканні на кнопку "Увійти"
loginBtn.addEventListener('click', function(event) {
  event.preventDefault(); // Запобігаємо переходу за посиланням
  loginModal.style.display = 'block';
});

// Закриття модального вікна при натисканні на "x"
closeBtn.addEventListener('click', function() {
  loginModal.style.display = 'none';
});

// Закриття модального вікна при натисканні за його межами
window.addEventListener('click', function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  }
});

// Обробка відправки форми
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Тут можна додати AJAX-запит для відправки даних на сервер

  console.log('Email:', email);
  console.log('Password:', password);

  // Після успішної авторизації можна закрити модальне вікно
  loginModal.style.display = 'none';
});