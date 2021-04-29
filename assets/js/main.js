const card = personaje => {
  const { name, status, species, image } = personaje

  return `
    <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="${image}" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="${image}" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">${name}</p>
                <p class="subtitle is-6">${species}</p>
              </div>
            </div>

            <div class="content">
              <p>${status}</p>
            </div>
          </div>
        </div>
      </div>
      `
}

const appendElements = (characters, borrarGrilla = false) => {
  const grid = document.querySelector('.grid');
  if(borrarGrilla){
    grid.innerHTML = null;
  }
  characters.forEach(character => {
    const cardItem = card(character)
    grid.innerHTML += cardItem;
  });
}

const getCharacters = async (baseURL, from, to) => {
  const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');
  const url = `${baseURL}/character/${charactersRange}`
  const response = await fetch(url);
  const characters = await response.json();
  console.log(charactersRange)
  return characters
}
const getCharactersByQuery = async (baseURL, searchValue) => {
  const url = `${baseURL}character/?name=${searchValue}`
  const response = await fetch(url);
  const characters = await response.json();
  return characters;
}

const main = async () => {
  const baseURL = 'https://rickandmortyapi.com/api/';
  const characters = await getCharacters(baseURL, 1, 20);
  appendElements(characters)
  console.log(characters)

  const $submit = document.querySelector('.handle_search');
  $submit.addEventListener('click', async (event) => {
    event.preventDefault();
    const $input = document.querySelector('.input_search')
    const value = $input.value;
    const charactersByQuery = await getCharactersByQuery(baseURL,value)
    const characters = charactersByQuery.results;
    appendElements(characters, true);
    console.log(charactersByQuery.results)
  })

}
main();
