const apiUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon'
let data = []
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
      console.log(details.sprites);
      return {
        id: pokemon.id,
        name: pokemon.name,
        url: pokemon.url,
        base_experience: details.base_experience,
        height: details.height,
        weight: details.weight,
        types: details.types.map((typeInfo) => typeInfo.type.name),
        sprite: details.sprites?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/other.png',
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


// data + новые ключи = data со все__+ми покемонами

createTable = (data) => {
  containerElement.innerHTML = '';

  const table = document.createElement('table')
  table.classList.add('pokemonTable')
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody')

  const headers = ['ID', 'Name', 'Type', 'Height'];
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

    row.setAttribute('data-url', item.url);

    row.appendChild(idCell)
    row.appendChild(nameCell)
    row.appendChild(typesCell)
    row.appendChild(heightCell)
    tbody.appendChild(row)
  })
  table.appendChild(thead);
  table.appendChild(tbody)
  containerElement.appendChild(table)
}

const fetchPokemonDetails = (pokemonIdOrName) => {
  if (!pokemonIdOrName) {
    console.error("Pokemon Id or Name is missing")
    return
  }
  const url = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonIdOrName}`
  console.log("Fetching details from:", url)
  fetch(url)
      .then(response => response.json())
      .then(data => {
        updateContent('card',data)
      })
      .catch(error => {
        console.error("Error fetching Pokemon details:", error);
      })
}


const createPokemonCard = (pokemon) => {
  const container = document.createElement('div');
  container.classList.add('pokemonCard');

  const name = document.createElement('h4')
  name.classList.add('name')
  name.textContent = `${pokemon.name.toUpperCase()} #${pokemon.id}`

  const size = document.createElement('p')
  size.classList.add('size')
  size.textContent = `Weight: ${pokemon.weight} Height: ${pokemon.height}`

  const imageElement = document.createElement('img')
  const spriteUrl = pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/other.png';  // Резервная картинка

  if (spriteUrl && spriteUrl !== 'undefined') {
    imageElement.src = spriteUrl;
  } else {
    imageElement.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/other.png';  // Резервное изображение на случай ошибки
  }

  const typesContainer = document.createElement('div')
  typesContainer.classList.add('element')

  if (pokemon.types && Array.isArray(pokemon.types) && pokemon.types.length > 0) {
    // Получаем первый тип для использования в качестве фона
    const firstType = pokemon.types[0]?.type?.name;

    if (firstType) {
      // Обновляем цвет фона в зависимости от первого типа
      updateElementStyle(typesContainer, firstType);

      // Добавляем каждый тип
      pokemon.types.forEach((typeInfo) => {
        const typeName = typeInfo?.type?.name;

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
   /* pokemon.types.forEach((typeInfo) => {
      console.log('Type:', typeInfo);
      const typeElement = document.createElement('p')
      if (typeInfo.type && typeof typeInfo.type.name === 'string') {
        typeElement.textContent = typeInfo.type.name.toUpperCase()
      }else{
        console.error('Invalid type object:',typeInfo)
        typeElement.textContent = 'N/A'
      }
      updateElementStyle(typeElement)
      typesContainer.appendChild(typeElement)
    })
  }else {
    const typeElement = document.createElement('p')
    typeElement.textContent = 'N/A'
    typesContainer.appendChild(typeElement)
  }*/
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
      statNameCell.textContent = `${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:`
      statValueCell.textContent = stat.base_stat
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
  container.appendChild(name)
  container.appendChild(size)
  container.appendChild(imageElement)
  container.appendChild(typesContainer)
  container.appendChild(statsContainer)
  return container
}

const updateElementStyle = (element,type) => {
  const text = type.trim().toLowerCase()

  switch (text) {
    case 'grass':
    case 'poison':
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
    default:
      element.style.backgroundColor = 'gray'
  }
}

const updateContent = (type, content) => {
  containerElement.innerHTML = ''

  if (type === 'table') {
    createTable(content)
  } else if (type === 'card') {
    const card = createPokemonCard(content)
    containerElement.appendChild(card)
  } else {
    containerElement.innerHTML = '<p>Нет данных</p>'
  }
}

document.querySelector('.searchButton').addEventListener('click', e => {
  const searchInput = document.querySelector('.searchInput').value.trim().toLowerCase()

  if (searchInput) {
    fetchPokemonDetails(searchInput)
  } else {
    alert('Введите имя или ID')
  }
})


fetchData()