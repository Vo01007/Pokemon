const apiUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon'
let data = ''

async function fetchData() {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`)
    }
    const data = await response.json()
    console.log('Список Покемонов',data.results)

    const firstFiftyPokemon = data.results.slice(0,50)
    const detailedData = await fetchAdditionalData(firstFiftyPokemon)
    console.log('Доп данные:',detailedData)

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
          types: details.types.map((typeInfo) => typeInfo.type.name).join(', '),
          sprite: details.sprites?.front_default || 'Нет изображения',
        }
      }catch(error) {
        console.error(`Ошибка для ${pokemon.url}:`, error)
      }
    })
  return Promise.all(promises).then((results) => results.filter(Boolean))
}


// data + новые ключи = data со всеми покемонами

createTable = (data) => {
  const containerElement = document.querySelector('.infoContainer');
  containerElement.innerHTML = '';

    const table = document.createElement('table')
    const tbody = document.createElement('tbody')
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
    table.appendChild(tbody)
    containerElement.appendChild(table)
}

fetchData()