document.addEventListener("DOMContentLoaded", () => {
    const rangeSelector = document.getElementById("rangeSelector");
    const pageNumbersContainer = document.querySelector(".pageNumbers");
    const resultsRange = document.getElementById("resultsRange");
    const containerElement = document.querySelector('.infoContainer');
    const nextButton = document.querySelector('.nextButton');
    const prevButton = document.querySelector('.prevButton');
    const pokemonList = JSON.parse(localStorage.getItem("pokemonList")) || [];
    const pokemon = JSON.parse(localStorage.getItem("selectedPokemon"));

    if (!pokemon) {
        alert('Покемон не выбран.');
        window.location.href = '../../index.html';
        return;
    }

    let currentPage = 1;
    let resultsPerPage = parseInt(rangeSelector.value);
    let offset = 0;
    const totalPagesCount = Math.ceil(pokemonList.length / resultsPerPage);

    // Найти индекс выбранного покемона
    const currentIndex = pokemonList.findIndex(item => item.id === pokemon.id);

    // Обновить номер страницы, чтобы выбранный покемон был в центре
    if (currentIndex !== -1) {
        currentPage = Math.ceil((currentIndex + 1) / resultsPerPage);
        offset = (currentPage - 1) * resultsPerPage;
    }

    const totalPages = () => {
        return totalPagesCount;
    }

    const generatePageButtons = () => {
        console.log('Generating page buttons...');
        pageNumbersContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых кнопок
        const totalPagesCount = totalPages();
        const pageRange = 50;
        let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
        let endPage = Math.min(totalPagesCount, startPage + pageRange - 1);

        if (endPage - startPage + 1 < pageRange) {
            startPage = Math.max(1, endPage - pageRange + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pageButton');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                offset = (currentPage - 1) * resultsPerPage;
                console.log('Page clicked:', currentPage);
                updatePagination();
            });
            pageNumbersContainer.appendChild(pageButton);
        }
    };

    const updatePagination = () => {
        generatePageButtons();
        updateResultsRange();
        renderPokemons();
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPagesCount;
    }

    const updateResultsRange = () => {
        const start = offset + 1;
        const end = Math.min(offset + resultsPerPage, pokemonList.length);
        resultsRange.textContent = `${start} - ${end} из ${pokemonList.length}`;
    }

    function renderPokemons() {
        const startIndex = offset;
        const endIndex = Math.min(offset + resultsPerPage, pokemonList.length);
        console.log('Rendering pokemons from', startIndex, 'to', endIndex);

        const pokemonsToDisplay = pokemonList.slice(startIndex, endIndex);
        containerElement.innerHTML = ''; // Очищаем контейнер перед повторной отрисовкой

        pokemonsToDisplay.forEach(pokemon => {
            createPokemonCard(pokemon);
        });
    }

    rangeSelector.addEventListener('change', (e) => {
        resultsPerPage = parseInt(e.target.value);
        currentPage = 1; // Сброс страницы при изменении диапазона
        offset = 0;
        console.log('Range changed:', resultsPerPage);
        updatePagination();
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPagesCount) {
            currentPage++;
            offset = (currentPage - 1) * resultsPerPage;
            updatePagination();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            offset = (currentPage - 1) * resultsPerPage;
            updatePagination();
        }
    });

    generatePageButtons();
    updatePagination();
});

const createPokemonCard = (pokemon) => {
    const container = document.querySelector('.container');
    container.style.margin = '2rem auto 1rem';
    const containerElement = document.querySelector('.infoContainer');
    containerElement.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('pokemonCard');

    const name = document.createElement('h4');
    name.classList.add('name');
    name.textContent = `${pokemon.name.toUpperCase()} #${pokemon.id}`;

    const size = document.createElement('p');
    size.classList.add('size');
    size.textContent = `Weight: ${pokemon.weight} Height: ${pokemon.height}`;

    const imageElement = document.createElement('img');
    imageElement.src = pokemon.sprite;

    const typesContainer = document.createElement('div');
    typesContainer.classList.add('elementContainer');

    if (pokemon.types && Array.isArray(pokemon.types) && pokemon.types.length > 0) {
        pokemon.types.forEach((typeName) => {
            const typeElement = document.createElement('div');
            typeElement.classList.add('element');
            typeElement.textContent = typeName.toUpperCase();
            updateElementStyle(typeElement, typeName);
            typesContainer.appendChild(typeElement);
        });
    } else {
        const typeElement = document.createElement('p');
        typeElement.textContent = 'N/A';
        typesContainer.appendChild(typeElement);
    }

    const statsContainer = document.createElement('div');
    statsContainer.classList.add('stats');
    const statsTable = document.createElement('table');

    const headerRow = document.createElement('tr');
    const baseHeader = document.createElement('th');
    baseHeader.textContent = 'Base';
    const statsHeader = document.createElement('th');
    statsHeader.textContent = 'Stats';
    headerRow.appendChild(baseHeader);
    headerRow.appendChild(statsHeader);
    statsTable.appendChild(headerRow);

    if (pokemon.stats && Array.isArray(pokemon.stats)) {
        pokemon.stats.forEach((stat) => {
            const row = document.createElement('tr');
            const statNameCell = document.createElement('td');
            const statValueCell = document.createElement('td');
            statNameCell.textContent = `${stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:`;
            statValueCell.textContent = stat.value;
            row.appendChild(statNameCell);
            row.appendChild(statValueCell);
            statsTable.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const statNameCell = document.createElement('td');
        const statValueCell = document.createElement('td');
        statNameCell.textContent = 'No stats available';
        statValueCell.textContent = '-';
        row.appendChild(statNameCell);
        row.appendChild(statValueCell);
        statsTable.appendChild(row);
    }

    statsContainer.appendChild(statsTable);
    card.appendChild(name);
    card.appendChild(size);
    card.appendChild(imageElement);
    card.appendChild(typesContainer);
    card.appendChild(statsContainer);

    containerElement.appendChild(card);
};

const updateElementStyle = (element, type) => {
    const text = type.trim().toLowerCase();

    switch (text) {
        case 'grass':
        case 'bug':
            element.style.backgroundColor = '#78C850';
            break;
        case 'ice':
            element.style.backgroundColor = '#98D8D8';
            break;
        case 'dragon':
        case 'flying':
            element.style.backgroundColor = '#7038F8';
            break;
        case 'dark':
            element.style.backgroundColor = '#705848';
            break;
        case 'psychic':
            element.style.backgroundColor = '#F85888';
            break;
        case 'poison':
            element.style.backgroundColor = 'purple';
            break;
        case 'fire':
            element.style.backgroundColor = 'orange';
            break;
        case 'water':
            element.style.backgroundColor = 'aqua';
            break;
        case 'electric':
            element.style.backgroundColor = '#F8D030';
            break;
        case 'fairy':
            element.style.backgroundColor = '#EE99AC';
            break;
        case 'ground':
            element.style.backgroundColor = 'brown';
            break;
        default:
            element.style.backgroundColor = 'gray';
    }
};
