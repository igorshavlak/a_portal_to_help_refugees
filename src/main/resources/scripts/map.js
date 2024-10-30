

const aidPoints = [
    {
        name: "Центр допомоги 1",
        lat: 50.4501,
        lng: 30.5234,
        category: "housing"
    },
    {
        name: "Медичний центр 2",
        lat: 49.8397,
        lng: 24.0297,
        category: "medical"
    },
    {
        name: "Юридична консультація 3",
        lat: 48.9226,
        lng: 24.7111,
        category: "legal"
    },
    // Додайте більше пунктів допомоги за необхідності
];


let map;
let markers = [];


function initMap() {
    // Ініціалізація карти
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 49.0, lng: 31.0 }, // Центр України
        zoom: 6
    });

    // Додавання маркерів
    for (let i = 0; i < aidPoints.length; i++) {
        const point = aidPoints[i];

        const marker = new google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: map,
            title: point.name,
            category: point.category
        });

        // Інфо-вікно з деталями
        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${point.name}</h3><p>Категорія: ${getCategoryName(point.category)}</p>`
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    }
}

// Функція для отримання назви категорії українською мовою
function getCategoryName(category) {
    switch (category) {
        case 'housing':
            return 'Житло';
        case 'medical':
            return 'Медична допомога';
        case 'legal':
            return 'Юридична допомога';
        case 'employment':
            return 'Допомога у працевлаштуванні';
        case 'education':
            return 'Освітні та професійні програми';
        case 'food':
            return 'Продукти харчування та предмети першої необхідності';
        case 'financial':
            return 'Фінансова допомога';
        default:
            return 'Інша категорія';
    }
}

// Функція для фільтрації маркерів за категорією
function filterMarkers(category) {
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        if (marker.category === category || category === 'all') {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    }
}
