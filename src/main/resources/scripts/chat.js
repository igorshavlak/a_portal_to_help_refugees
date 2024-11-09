//chat.js

// Отримання елементів
const openChatBtn = document.getElementById("openChatBtn");
const chatModal = document.getElementById("chatModal");
const closeBtn = document.querySelector(".close-btn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");
let chatId = null;
let stompClient = null;
let chatSubscription = null;
let currentUser = null;


// Відкриття модального вікна
openChatBtn.addEventListener("click", () => {
    openChatModal();
});

// Закриття модального вікна при натисканні кнопки закриття
closeBtn.addEventListener("click", () => {
    chatModal.style.display = "none";
});

// Закриття модального вікна при кліку поза його межами
window.addEventListener("click", (event) => {
    if (event.target === chatModal) {
        chatModal.style.display = "none";
    }
});

// Відправлення повідомлення при натисканні кнопки
sendBtn.addEventListener("click", sendMessage);

// Відправлення повідомлення при натисканні клавіші Enter
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Функція для оновлення статусу
function updateStatus(isOnline) {
    const statusElement = document.getElementById("status");
    if (isOnline) {
        statusElement.textContent = "онлайн";
        statusElement.classList.add("online");
        statusElement.classList.remove("offline");
    } else {
        statusElement.textContent = "оффлайн";
        statusElement.classList.add("offline");
        statusElement.classList.remove("online");
    }
}
function fetchCurrentUser() {
    return fetch('/user/getUser')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати інформацію про користувача');
            }
            return response.text(); // Зміна тут
        })
        .then(username => {
            currentUser = username;
        })
        .catch(error => {
            console.error('Помилка при отриманні користувача:', error);
        });
}


function openChatModal() {
    chatBody.innerHTML = '';
    chatModal.style.display = 'flex';
    messageInput.focus();

    sendBtn.disabled = true; // Деактивуємо кнопку до отримання chatId

    fetchCurrentUser().then(() => {
        connectChat();
        fetchChatHistory();
    });
}
function connectChat() {
    const socket = new SockJS('/ws'); // Ваш STOMP endpoint
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);

        // Підписка на особисту чергу повідомлень
        stompClient.subscribe('/user/queue/messages', function(messageOutput) {
            const message = messageOutput.body;
            displayMessage(message);
        });
    }, function(error) {
        console.error('STOMP error: ', error);
    });
}
function fetchChatHistory() {
    fetch(`/chat/history/${currentApplicationId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати історію чату');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.messages) { // Перевірка наявності даних
                chatId = data.id;
                data.messages.forEach(message => {
                    displayMessage(message.message);
                });
            } else {
                chatId = data.id;
                console.log('Чат існує, але повідомлення відсутні');
                chatBody.innerHTML = '<p>Немає повідомлень</p>';
            }
            sendBtn.disabled = false;
        })
        .catch(error => {
            console.error('Помилка при отриманні історії чату:', error);
            chatBody.innerHTML = '<p>Помилка при завантаженні історії чату.</p>';
        });
}

function disconnectChat() {
    if (chatSubscription !== null) {
        chatSubscription.unsubscribe();
        chatSubscription = null;
    }
    if (stompClient !== null) {
        stompClient.disconnect();
        stompClient = null;
    }
    console.log('Disconnected');
}

// Приклад: Зміна статусу на "онлайн" або "оффлайн"
// Викличте цю функцію з аргументом true для онлайн, false для оффлайн
updateStatus(true);  // Онлайн
// updateStatus(false); // Оффлайн

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
        stompClient.send(`/app/sendMessage/${chatId}`, {}, messageText);
        displayMessage(messageText);
        messageInput.value = '';

    }
}


function displayMessage(message) {
    const messageDiv = document.createElement('div');
    //messageDiv.className = message.sender === 'user' ? 'message sent' : 'message received';
    messageDiv.className = "message sent"
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
