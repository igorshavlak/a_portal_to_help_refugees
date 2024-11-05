// refugeeService.js

export async function sendRefugeeData(refugeeData) {
    try {
        const response = await fetch('/user/updateVolunteerDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refugeeData)
        });

        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        console.error('Помилка при відправці даних:', error);
        return { success: false, message: 'Сталася помилка при відправці даних. Спробуйте пізніше.' };
    }
}

window.sendRefugeeData = sendRefugeeData;