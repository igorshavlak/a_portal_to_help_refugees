// Отримуємо елементи модального вікна запиту
const requestBtn = document.getElementById('request-help-btn');
const requestModal = document.getElementById('request-modal');
const requestCloseBtn = document.querySelector('.request-close-btn');
const requestForm = document.getElementById('request-form');

// Функції відкриття та закриття модального вікна запиту
function openRequestModal(event) {
    event.preventDefault();
    requestModal.classList.add('show');
}

function closeRequestModal() {
    requestModal.classList.remove('show');
}

// Обробники подій
requestBtn.addEventListener('click', openRequestModal);
requestCloseBtn.addEventListener('click', closeRequestModal);

window.addEventListener('click', function(event) {
    if (event.target === requestModal) {
        closeRequestModal();
    }
});

requestForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const requestType = document.getElementById('request-type').value;
    const requestDescription = document.getElementById('request-description').value;

    // Тут можна додати AJAX-запит для відправки даних на сервер

    console.log('Тип допомоги:', requestType);
    console.log('Опис ситуації:', requestDescription);

    closeRequestModal();
});