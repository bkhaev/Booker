


// Начальное состояние приложения
const appState = {
    
};

const baseApiUrl = 'http://localhost/booker/api/';


(() => {
    
})();


window.onload = () => {
    updateBook();
}



/////////////////////// ОСНОВНЫЕ ФУНКЦИИ ///////////////////////



/**
 * Функция рендерит визуальное представление книг,
 * после их получения HTTP-запросом
 * 
 */
async function updateBook() {
    let url = 'books/details';

    const urlParams = new URLSearchParams(window.location.search);

    url += '?bookId=' + urlParams.get('book');

    const data = await getData(url);

    if (data.kind === 'booker#book') {
        console.log('Информация о книге загружена');

        const bookTitle = document.createElement('h3');
        bookTitle.textContent = data.title;
        
        const bookDescription = document.createElement('p');

        if (data.description !== undefined)
            bookDescription.textContent = data.description;
        else
            bookDescription.textContent = 'описания нет';

        document.querySelector('main').append(bookTitle, bookDescription);
    }
}



/////////////////////// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ///////////////////////



/**
 * Отправляет HTTP GET-запрос на получение данных.
 * 
 * @param {String} url адрес запрашиваемого ресурса
 * @return {Object} возвращает полученные данные
 */
async function getData(url) {
    const response = await fetch(baseApiUrl + url, {
        method: 'get',
        credentials: 'same-origin',
    });
    
    const result = await response.json().catch(reason => console.log('Ошибка Promise: ' + reason));

    if (result && result.error !== undefined)
        alert(result.error.message + '\n' + result.errors[0].message);

    return result;
}



/**
 * Удаляет элементы из массива по значению.
 * 
 * @param {Array} array массив, из которого нужно удалить значения
 * @param {Object} values значения, которые нужно удалить из массива
 */
function removeFromArray(array, ...values) {
    values.forEach(value => {
        const phraseIndex = array.indexOf(value);
        if (phraseIndex !== -1)
            array.splice(phraseIndex, 1);
    });
};