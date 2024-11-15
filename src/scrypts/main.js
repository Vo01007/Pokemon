const apiUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon'

async function fetchData() {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`)
    }
    const data = await response.json();
    console.log(data); // Проверьте структуру данных в консоли
    createTable(data.results);
  } catch (error) {
    console.error('Ошибка при получении данных:', error)
  }
}
createTable = (data) => {
  const containerElement = document.getElementsByClassName('infoContainer');
  const table = document.createElement('table')

  const tbody = document.createElement('tbody')
  data.forEach((item) => {
    const row = document.createElement('tr')

    const idCell = document.createElement('td')
    idCell.textContent = item.id
    let nameCell = document.createElement('td')
    nameCell.textContent = item.name

    row.setAttribute('data-url', item.url);

    row.appendChild(idCell)
    row.appendChild(nameCell)

    tbody.appendChild(row);

  })
  table.appendChild(tbody)
  containerElement.appendChild(table);
}

fetchData()