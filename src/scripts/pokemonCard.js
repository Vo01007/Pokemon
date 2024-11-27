document.addEventListener("DOMContentLoaded", () => {
    
    const pokemon = JSON.parse(localStorage.getItem("selectedPokemon"))
    console.log('Данные из localStorage:', localStorage.getItem('selectedPokemon'))
    console.log('Парсинг покемона:', pokemon)

    if (!pokemon) {
        alert('Покемон не выбран.')
        window.location.href = '../../index.html'
        return
    }
    createPokemonCard(pokemon)

    const backButton = document.querySelector('.backbutton')
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html'
    })
})

const createPokemonCard = (pokemon) => {
    const containerElement = document.querySelector('.infoContainer')
    containerElement.innerHTML = ''

    const card = document.createElement('div');
    card.classList.add('pokemonCard');

    const name = document.createElement('h4')
    name.classList.add('name')
    name.textContent = `${pokemon.name.toUpperCase()} #${pokemon.id}`

    const size = document.createElement('p')
    size.classList.add('size')
    size.textContent = `Weight: ${pokemon.weight} Height: ${pokemon.height}`

    const imageElement = document.createElement('img')
    imageElement.src = pokemon.sprite

    const typesContainer = document.createElement('div')
    typesContainer.classList.add('element')

    if (pokemon.types && Array.isArray(pokemon.types) && pokemon.types.length > 0) {
        // Получаем первый тип для использования в качестве фона
        const firstType = pokemon.types[0]?.type?.name;

        if (firstType) {
            // Обновляем цвет фона в зависимости от первого типа
            updateElementStyle(typesContainer, firstType);

            // Добавляем каждый тип
            pokemon.types.forEach((typeName) => {
                const typeElement = typeName?.type?.name;

                if (typeName) {
                    const typeElement = document.createElement('p');
                    typeElement.textContent = typeName.toUpperCase();
                    typesContainer.appendChild(typeElement);
                } else {
                    console.error('Тип не имеет поля "name" или неправильная структура:', typeInfo);
                }
            });
        } else {
            console.error('Первый тип не имеет поля "name" или структура неправильная:', pokemon.types[0]);
        }
    } else {
        const typeElement = document.createElement('p');
        typeElement.textContent = 'N/A';
        typesContainer.appendChild(typeElement);
    }

    const statsContainer = document.createElement('div')
    statsContainer.classList.add('stats')
    const statsTable = document.createElement('table')

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
            const row = document.createElement('tr')
            const statNameCell = document.createElement('td')
            const statValueCell = document.createElement('td')
            statNameCell.textContent = `${stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:`
            statValueCell.textContent = stat.value
            row.appendChild(statNameCell)
            row.appendChild(statValueCell)
            statsTable.appendChild(row)
        })
    }else {
        const row = document.createElement('tr');
        const statNameCell = document.createElement('td');
        const statValueCell = document.createElement('td');
        statNameCell.textContent = 'No stats available';
        statValueCell.textContent = '-';
        row.appendChild(statNameCell);
        row.appendChild(statValueCell);
        statsTable.appendChild(row);
    }
    statsContainer.appendChild(statsTable)
    card.appendChild(name)
    card.appendChild(size)
    card.appendChild(imageElement)
    card.appendChild(typesContainer)
    card.appendChild(statsContainer)

    containerElement.appendChild(card)
}

const updateElementStyle = (element,type) => {
    const text = type.trim().toLowerCase()

    switch (text) {
        case 'grass':
        case 'poison':
        case 'bug':
            element.style.backgroundColor = 'green'
            break

        case 'fire':
            element.style.backgroundColor = 'orange'
            break

        case 'water':
            element.style.backgroundColor = 'aqua'
            break

        case 'electric':
            element.style.backgroundColor = 'yellow'
            break

        case 'fairy':
            element.style.backgroundColor = 'pink'
            break

        case 'ground':
            element.style.backgroundColor = 'brown'
            break

        default:
            element.style.backgroundColor = 'gray'
    }
}