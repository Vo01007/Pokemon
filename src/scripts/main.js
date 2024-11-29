const apiUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon'

const containerElement = document.querySelector('.infoContainer');

async function fetchData() {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`)
    }
    const responseData = await response.json()
    console.log('Список Покемонов', responseData.results)

    data = responseData.results
    const firstFiftyPokemon = data.slice(0, 50)
    const detailedData = await fetchAdditionalData(firstFiftyPokemon)
    console.log('Доп данные:', detailedData)

    createTable(detailedData);
  } catch (error) {
    console.error('Ошибка при получении данных:', error)
  }
}

async function fetchAdditionalData(pokemonList) {
  const promises = pokemonList.map(async (pokemon) => {
    try {
      const response = await fetch(pokemon.url)
      if (!response.ok) {
        console.error(`Ошибка при получении данных для ${pokemon.name}: ${response.status}`)
        return null
      }
      const details = await response.json()
      return {
        id: pokemon.id,
        name: pokemon.name,
        url: pokemon.url,
        base_experience: details.base_experience,
        height: details.height,
        weight: details.weight,
        types: details.types.map((typeInfo) => typeInfo.type.name),
        sprite: details.sprites?.front_default,
        stats: details.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat
        }))
      }
    } catch (error) {
      console.error(`Ошибка для ${pokemon.url}:`, error)
    }
  })
  return Promise.all(promises).then((results) => results.filter(Boolean))
}


createTable = (data) => {
  containerElement.innerHTML = '';

  const table = document.createElement('table')
  table.classList.add('pokemonTable')
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody')

  const headers = ['ID', 'Name', 'Type', 'Height', 'Actions'];
  const headerRow = document.createElement('tr')
  headers.forEach(headerText => {
    const th = document.createElement('th')
    th.textContent = headerText
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  data.forEach((item) => {
    const row = document.createElement('tr')

    const idCell = document.createElement('td')
    idCell.textContent = item.id
    const nameCell = document.createElement('td')
    nameCell.textContent = item.name
    const typesCell = document.createElement('td')
    typesCell.textContent = item.types || 'N/A'
    const heightCell = document.createElement('td')
    heightCell.textContent = item.height || 'N/A'
    const actionCell = document.createElement('td')
    const eyeIcon = document.createElement('img')
    eyeIcon.src = 'https://cdn.icon-icons.com/icons2/629/PNG/96/eye-visible-outlined-interface-symbol_icon-icons.com_57844.png'
    eyeIcon.style.cursor = 'pointer'
    eyeIcon.style.width = '2rem'
    eyeIcon.addEventListener('click', () => {
      localStorage.setItem('selectedPokemon', JSON.stringify(item))
      window.location.href = './src/pages/pokemonCard.html'
    })
    actionCell.appendChild(eyeIcon)

    row.appendChild(idCell)
    row.appendChild(nameCell)
    row.appendChild(typesCell)
    row.appendChild(heightCell)
    row.appendChild(actionCell)
    tbody.appendChild(row)
  })
  table.appendChild(thead);
  table.appendChild(tbody)
  containerElement.appendChild(table)
}

const filterTable = (searchInput) => {
  const rows = document.querySelectorAll('table tr')
  let found = false;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td')
    if (cells.length >= 2) {
      const id = cells[0].textContent.trim().toLowerCase()
      const name = cells[1].textContent.trim().toLowerCase()

      if (id.includes(searchInput) || name.includes(searchInput)) {
        row.style.display = ''
        found = true
      } else {
        row.style.display = 'none'
      }
    }
  })

  return found
}


document.querySelector('.searchButton').addEventListener('click', (e) => {
  const searchInput = document.querySelector('.searchInput').value.trim().toLowerCase();

  if (searchInput) {
    const found = filterTable(searchInput);

    if (!found) {
      alert('Покемон с таким именем или ID не найден. Попробуйте ещё раз.');
    }
  } else {
    alert('Введите имя или ID')
  }
})

document.querySelector('.clearButton').addEventListener('click', () => {
  document.querySelector('.searchInput').value = ''; // Очистить поле ввода
  const rows = document.querySelectorAll('.pokemonTable tbody tr');
  rows.forEach((row) => {
    row.style.display = ''; // Показать все строки
  });
});

fetchData()