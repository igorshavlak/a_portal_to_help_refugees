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
    disconnectChat();
});

// Закриття модального вікна при кліку поза його межами
window.addEventListener("click", (event) => {
    if (event.target === chatModal) {
        chatModal.style.display = "none";
        disconnectChat();
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
// Функция для получения деталей получателя чата
function fetchChatReceiverDetails(chatId) {
    return fetch(`/chat/getChatReceiverDetails/${chatId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати деталі отримувача чату');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Помилка при отриманні деталей отримувача:', error);
        });
}

// Функция для обновления профиля пользователя в чате
function updateChatProfile(userDetails) {
    const userNameElement = document.getElementById("username");
    const profilePicElement = document.querySelector(".profile-pic");

    if (userDetails.name && userDetails.surname) {
        userNameElement.textContent = `${userDetails.name} ${userDetails.surname}`;
    }

    if (userDetails.profileImage) {
        profilePicElement.src = `data:image/jpeg;base64,${userDetails.profileImage}`;
    } else {
        profilePicElement.src = "/images/default-profile.png"; // Путь к изображению по умолчанию
    }
}

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
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);

        if (chatSubscription) {
            chatSubscription.unsubscribe();
        }
        chatSubscription = stompClient.subscribe('/user/queue/messages', function(messageOutput) {
            const data = JSON.parse(messageOutput.body);
            const message = data.message
            if(chatId === data.chatId)
            {
                displayMessage(message, false);
            } else {
                console.log("Chat does not open")
            }

        });
    }, function(error) {
        console.error('STOMP error: ', error);
    });
}
function fetchChatHistory() {
    if (window.currentApplicationId === null) {
        console.error('currentApplicationId is not set');
        return;
    }
    fetch(`/chat/history/${window.currentApplicationId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати історію чату');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.messages) {
                chatId = data.id;
                fetchChatReceiverDetails(chatId).then(userDetails => {
                    if (userDetails) {
                        updateChatProfile(userDetails);
                    }
                });
                data.messages.forEach(message => {
                    if(message.senderEmail === currentUser){
                        displayMessage(message.message,true);
                    } else {
                        displayMessage(message.message,false);
                    }

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
        displayMessage(messageText,true);
        messageInput.value = '';

    }
}


function displayMessage(message,boolean) {
    const messageDiv = document.createElement('div');
    if(boolean === true){
        messageDiv.className = "message sent"
    } else {
        messageDiv.className = "message received"
    }
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
