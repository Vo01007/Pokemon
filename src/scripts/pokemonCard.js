
document.addEventListener("DOMContentLoaded", () => {

    const pokemonList = JSON.parse(localStorage.getItem("pokemonList")) || []
    const pokemon = JSON.parse(localStorage.getItem("selectedPokemon"))
    console.log('pokemon list' ,pokemonList)
    console.log('Данные из localStorage:', localStorage.getItem('selectedPokemon'))
    console.log('Парсинг покемона:', pokemon)

    const nextButton = document.querySelector('.nextButton')
    const prevButton = document.querySelector('.prevButton')
    console.log('Previous button:', document.querySelector('.pagination-prev'))
    console.log('Next button:', document.querySelector('.pagination-next'))

    if (!pokemon) {
        alert('Покемон не выбран.')
        window.location.href = `../../index.html`
        return
    }


    const currentIndex = pokemonList.findIndex(item => item.id === pokemon.id)

    if (currentIndex === -1) {
        alert('Покемон не найден в списке')
        return
    }

    createPokemonCard(pokemon)
    updatePaginationButtons(currentIndex, pokemonList)

    nextButton.addEventListener('click', () => {
        if (currentIndex < pokemonList.length -1){
            localStorage.setItem('selectedPokemon', JSON.stringify(pokemonList[currentIndex + 1]))
            window.location.reload()
        }
    })

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            localStorage.setItem('selectedPokemon', JSON.stringify(pokemonList[currentIndex - 1]))
            window.location.reload()
        }
    })

    const backButton = document.querySelector('.backButton')
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html'
    })
})

const createPokemonCard = (pokemon) => {
    const container = document.querySelector('.container')
    container.style.margin = '2rem auto'
    const containerElement = document.querySelector('.infoContainer')
    containerElement.innerHTML = ''

    const card = document.createElement('div')
    card.classList.add('pokemonCard')

    const name = document.createElement('h4')
    name.classList.add('name')
    name.textContent = `${pokemon.name.toUpperCase()} #${pokemon.id}`

    const size = document.createElement('p')
    size.classList.add('size')
    size.textContent = `Weight: ${pokemon.weight} Height: ${pokemon.height}`

    const imageElement = document.createElement('img')
    imageElement.src = pokemon.sprite

    const typesContainer = document.createElement('div')
    typesContainer.classList.add('elementContainer')

    if (pokemon.types && Array.isArray(pokemon.types) && pokemon.types.length > 0) {
        pokemon.types.forEach((typeName) => {
            const typeElement = document.createElement('div')
            typeElement.classList.add('element')
            typeElement.textContent = typeName.toUpperCase()
            updateElementStyle(typeElement, typeName)  // Применяем цвет к блоку
            typesContainer.appendChild(typeElement)
        })
    } else {
        const typeElement = document.createElement('p')
        typeElement.textContent = 'N/A'
        typesContainer.appendChild(typeElement)
    }

    const statsContainer = document.createElement('div')
    statsContainer.classList.add('stats')
    const statsTable = document.createElement('table')

    const headerRow = document.createElement('tr')
    const baseHeader = document.createElement('th')
    baseHeader.textContent = 'Base'
    const statsHeader = document.createElement('th')
    statsHeader.textContent = 'Stats'
    headerRow.appendChild(baseHeader)
    headerRow.appendChild(statsHeader)
    statsTable.appendChild(headerRow)

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
        const row = document.createElement('tr')
        const statNameCell = document.createElement('td')
        const statValueCell = document.createElement('td')
        statNameCell.textContent = 'No stats available'
        statValueCell.textContent = '-'
        row.appendChild(statNameCell)
        row.appendChild(statValueCell)
        statsTable.appendChild(row)
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
        case 'bug':
            element.style.backgroundColor = '#78C850'
            break

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
            element.style.backgroundColor = 'purple'
            break

        case 'fire':
            element.style.backgroundColor = 'orange'
            break

        case 'water':
            element.style.backgroundColor = 'aqua'
            break

        case 'electric':
            element.style.backgroundColor = '#F8D030'
            break

        case 'fairy':
            element.style.backgroundColor = '#EE99AC'
            break

        case 'ground':
            element.style.backgroundColor = 'brown'
            break

        default:
            element.style.backgroundColor = 'gray'
    }
}

const updatePaginationButtons = (currentIndex, pokemonList) => {
    const nextButton = document.querySelector('.nextButton')
    const prevButton = document.querySelector('.prevButton')
    if (!prevButton || !nextButton) {
        console.error('Pagination buttons are missing in the DOM.');
        return;
    }

    if (currentIndex > 0) {
        prevButton.disabled = false
        prevButton.classList.remove('disabled')
    }else {
        prevButton.disabled = true
        prevButton.classList.add('disabled')
    }

    if (currentIndex < pokemonList.length -1) {
        nextButton.disabled = false
        nextButton.classList.remove('disabled')
    }else {
        nextButton.disabled = true
        nextButton.classList.add('disabled')
    }
}