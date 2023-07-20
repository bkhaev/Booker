// Booker JS-инициализатор приложения


// Начальное состояние приложения
const appState = {
    query: '',
    authors: [],
    genres: [],
};

const baseApiUrl = 'http://localhost/booker/api/';


// Блок инициализирует события отправки запроса на поиск книг
// по нажатию на кнопку и после ввода ключевых слов
(() => {
    Form.addEventListener('submit', e => {
        searchBooks();
        e.preventDefault();
    });

    searchInp.addEventListener('change', () => {
        appState.query = searchInp.value.trim();
        searchBooks();
    });
})();



// Блок инициализирует функции фильтров:
// 1. Загрузка текущих авторов и жанров при первом открытии фильтров
// 2. Обработка изменения фильтров и обновление результатов поиска
(() => {
    let isFirstOpen = true;

    searchFilters.addEventListener('toggle', async () => {
        if (searchFilters.hasAttribute('open') && isFirstOpen) {
            isFirstOpen = false;
            const data = await getData('books/filters');

            searchFilters.replaceChildren(searchFilters.children[0]);

            if (data.authorsList !== undefined) {
                const authorsList = document.createElement('section');

                const authorsListHeader = document.createElement('h3');
                authorsListHeader.textContent = 'Авторы';

                const authors = [];
                data.authorsList.forEach(author => {
                    const optionInp = document.createElement('input');
                    optionInp.type = 'checkbox';
                    optionInp.className = 'checkbox-grand';
                    optionInp.id = 'author_' + author.id;

                    optionInp.addEventListener('change', () => {
                        if (optionInp.checked)
                            appState.authors.push(author.id);
                        else
                            removeFromArray(appState.authors, author.id);
                        
                        console.log('Фильтры изменены');
                        searchBooks();
                    });

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = 'author_' + author.id;
                    optionLabel.textContent = [author.surname, author.name, author.patronymic].join(' ');

                    authors.push(optionInp, optionLabel);
                });

                authorsList.append(authorsListHeader, ...authors);
                searchFilters.append(authorsList);
            }

            if (data.genresList !== undefined) {
                const genresList = document.createElement('section');

                const genresListHeader = document.createElement('h3');
                genresListHeader.textContent = 'Жанры';

                const genres = [];
                data.genresList.forEach(genre => {
                    const optionInp = document.createElement('input');
                    optionInp.type = 'checkbox';
                    optionInp.className = 'checkbox-grand';
                    optionInp.id = 'genre_' + genre.id;

                    optionInp.addEventListener('change', () => {
                        if (optionInp.checked)
                            appState.genres.push(genre.id);
                        else
                            removeFromArray(appState.genres, genre.id);

                        console.log('Фильтры изменены');
                        searchBooks();
                    });

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = 'genre_' + genre.id;
                    optionLabel.textContent = genre.title;

                    genres.push(optionInp, optionLabel);
                });

                genresList.append(genresListHeader, ...genres);
                searchFilters.append(genresList);
            }

            console.log('Фильтры загружены');
        }
    });
})();



// Начальные действия:
// 1. Загрузка всех текущих книг
// 2. Закрытие модульного окна с описанием книги
window.onload = () => {
    searchBooks();
    closeModalBtn.addEventListener('click', () => modalArea.classList.remove('show'));
}



/////////////////////// ОСНОВНЫЕ ФУНКЦИИ ///////////////////////



/**
 * Функция рендерит визуальное представление книг,
 * после их получения HTTP-запросом
 * 
 */
async function searchBooks() {
    let url = 'books/search';

    if (appState.query)
        url += '?k=' + appState.query;
    if (appState.authors.length)
        url += (appState.query ? '&authors=' : '?authors=') + appState.authors;
    if (appState.genres.length)
        url += (appState.query || appState.authors.length ? '&genres=' : '?genres=') + appState.genres;

    const data = await getData(url);

    if (appState.query)
        searchResultsTotal.textContent = `Результаты по запросу: ${appState.query} (${data.total})`;
    else if (appState.genres.length || appState.authors.length)
        searchResultsTotal.textContent = `Результаты поиска (${data.total})`;
    else
        searchResultsTotal.textContent = 'Результаты поиска';

    if (data.items !== undefined) {
        const books = [];
        data.items.forEach(book => {
            const bookBox = document.createElement('div');

            bookBox.addEventListener('click', () => {
                if (book.description) {
                    modalArea.querySelector('.modal h2').textContent = book.title;
                    modalArea.querySelector('.modal h2 + p').textContent = book.description;
                    modalArea.classList.add('show');
                } else
                    alert(book.description ? book.description : 'Нет описания')
            });

            const bookImage = document.createElement('img');
            bookImage.height = 200;
            bookImage.alt = 'preview';

            if (book.picture.url)
                bookImage.src = book.picture.url;

            bookBox.append(bookImage);

            const bookTitle = document.createElement('h3');
            bookTitle.textContent = book.title;

            bookBox.append(bookTitle);

            if (book.authors) {
                const bookAuthors = document.createElement('p');
                bookAuthors.className = 'item-author';
                bookAuthors.textContent = book.authors;
                bookBox.append(bookAuthors);
            }

            if (book.genres) {
                const bookGenres = document.createElement('p');
                bookGenres.className = 'item-genre';
                bookGenres.textContent = book.genres;
                bookBox.append(bookGenres);
            }

            if (book.description) {
                const bookDescription = document.createElement('p');
                bookDescription.textContent = book.description.length > 50 ? book.description.slice(0, 50) + '...' : book.description;
                bookBox.append(bookDescription);
            }
            
            books.push(bookBox);
        });

        searchResults.replaceChildren(...books);
    }

    console.log('Результаты поиска обновлены');
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