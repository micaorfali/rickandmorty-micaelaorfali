const card = personaje => {
  const { id, name, status, species, image } = personaje

  return `
    <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
        <a class="handleOpenModal" data-id=${id}><div class="card">
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
        </div></a>
      </div>
      `
}

const Modal = personaje => {

  const { id, name, status, species, image, episodesData } = personaje
  let episodesLi = ''
  episodesData.forEach(({ name })=>{
    episodesLi += `<li>${name}</li>`
})

  return `
  <div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="${image}" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${name}</strong>
          <br>
          Here you've got a full list of the episodes where this character appears
        </p>
        <h3>Episodes</h3>
        <ul>${episodesLi}</ul>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="retweet">
            <span class="icon is-small">
              <i class="fas fa-retweet" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="like">
            <span class="icon is-small">
              <i class="fas fa-heart" aria-hidden="true"></i>
            </span>
          </a>
        </div>
      </nav>
    </div>
  </article>
</div> 
    `

}

const getCharacter = async (baseURL, id) => {

  const url = `${baseURL}character/${id}`
  const response = await fetch(url);
  const character = await response.json();

  return character;

}

const getEpisode = async (baseURL,) => {

  const url = `${baseURL}`
  const response = await fetch(url);
  const episode = await response.json();
  return episode;

}

const appendElements = (characters, borrarGrilla = false) => {
  const grid = document.querySelector('.grid');
  //if (borrarGrilla) {
    grid.innerHTML = null;
  //}
  characters.forEach(character => {
    const cardItem = card(character)
    grid.innerHTML += cardItem;
  })
  const $modalOpenArr = document.querySelectorAll('.handleOpenModal');
  const $modal = document.querySelector('.modal');
  const $modalContent = document.querySelector('.modal-content');
  const $modalClose = document.querySelector('.modal-close');

  $modalClose.addEventListener('click', () => {
    $modal.classList.remove('is-active');
  })

  $modalOpenArr.forEach(($card) => {
    $card.addEventListener('click', () => {
      const id = $card.dataset.id;
      const character = characters[id - 1]; //Nos da la posicion del personaje en el array de characters
      const { episode } = character
      const getEpisodesData = async () => {
        return Promise.all(episode.map(item => getEpisode(item))) //Resuelvo cada una de las promesas (fetchs de episodes)
      }
      getEpisodesData().then(episodesData => {
        const characterWithEpisodes = { ...character, episodesData } //Junto los datos que tenia del character + sus episodes
        $modalContent.innerHTML = Modal(characterWithEpisodes) //Le mando todo junto a modal
        $modal.classList.add('is-active'); //Activo el modal
      })
    })
  })
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

  const $npcs = document.querySelector('#personajes')
  const $locs = document.querySelector('#locaciones')
  const $epis = document.querySelector('#episodios')
  $epis.classList.remove('is-active')
  $npcs.classList.add('is-active')
  $locs.classList.remove('is-active')
  const $searchbar = document.querySelector('#searchbar')
  $searchbar.classList.remove('searchbar-none')

  const $submit = document.querySelector('.handle_search');
  $submit.addEventListener('click', async (event) => {
    event.preventDefault();
    const $input = document.querySelector('.input_search')
    const value = $input.value;
    const charactersByQuery = await getCharactersByQuery(baseURL, value)
    const characters = charactersByQuery.results;
    appendElements(characters, true);
    console.log(charactersByQuery.results)
  })
const $locaciones = document.querySelector('#locaciones');
$locaciones.addEventListener('click', async (event)=>{
  mainLocation();
}) 

const $episodios = document.querySelector('#episodios');
$episodios.addEventListener('click', async (event)=>{
  mainEpisode();
}) 

}
main();

// menu tabs
// locaciones
const CardLocation = locacion => {

  const { id, name, type, dimension } = locacion

  return `
    <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile" id="locacionesstyle">
        <a class="handleOpenModal" data-id="${id}"><div class="card"> <!-- CARD -->
          <div class="media">
                <div class="media-content">
                <p class="title is-4 name">${name}</p>
                <p class="subtitle is-6 type">${type}</p>
              </div>
            </div>
            <div class="content">
              <p class="dimension">${dimension}</p>
            </div>
          </div>
        </div></a>
      </div>
    `



}

const getLocations = async (baseURL, from, to) => {
  const locationsRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(', ');
  console.log(locationsRange)
  const url = `${baseURL}location/${locationsRange}`
  const response = await fetch(url);
  const locations = await response.json();
  return locations;

}

const getLocation = async (baseURL, id) => {
  const url = `${baseURL}location/${id}`
  const response = await fetch(url);
  const location = await response.json();
  return location;
}

const appendLocations = (characters, nullGrid = false) => {
  const $grid = document.querySelector('.grid')
  $grid.innerHTML = null;

  characters.forEach(location => {
    const cardItem = CardLocation(location)
    $grid.innerHTML += cardItem;

  });
}

const mainLocation = async () => {

  const baseURL = 'https://rickandmortyapi.com/api/';
  const locations = await getLocations(baseURL, 1, 50)
  const $npcs = document.querySelector('#personajes')
  const $locs = document.querySelector('#locaciones')
  const $epis = document.querySelector('#episodios')
  $epis.classList.remove('is-active')
  $npcs.classList.remove('is-active')
  $locs.classList.add('is-active')
  const $searchbar = document.querySelector('#searchbar')
  $searchbar.classList.add('searchbar-none')
  appendLocations(locations)
  console.log(locations)

  const $tabCharacters = document.querySelector('#personajes');
  $tabCharacters.addEventListener('click', async (event) => {

    main();

  })
}

// episodes tab

const CardEpisode = episodio => {

  const { id, name, character, episode } = episodio

  return `
    <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile" id="episodesstyle">
        <a class="handleOpenModal" data-id="${id}"><div class="card"> <!-- CARD -->
        <!---- <div class="card-image">
      </div>
      <div class="card-content" id="cContainer">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="" alt="">
            </figure>
          </div> ---->
          <div class="media">
                <div class="media-content">
                <p class="title is-4 name">${name}</p>
              </div>
            </div>
            <div class="content">
              <p>${episode}</p>
            </div>
          </div>
        </div></a>
      </div>
    `

}

const getEpisodes = async (baseURL, from, to) => {
  const episodesRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(', ');
  console.log(episodesRange)
  const url = `${baseURL}episode/${episodesRange}`
  const response = await fetch(url);
  const episodes = await response.json();
  return episodes;

}

const getEpisodeTab = async (baseURL, id) => {
  const url = `${baseURL}episode/${id}`
  const response = await fetch(url);
  const episode = await response.json();
  return episode;

}

const appendEpisodes = (episodes, nullGrid = false) => {
  const $grid = document.querySelector('.grid')
  $grid.innerHTML = null;

  episodes.forEach(episode => {
    const cardItem = CardEpisode(episode)
    $grid.innerHTML += cardItem;
  });
}

const mainEpisode = async () => {

  const baseURL = 'https://rickandmortyapi.com/api/';
  const episodes = await getEpisodes(baseURL, 1, 50)
  const $npcs = document.querySelector('#personajes')
  const $locs = document.querySelector('#locaciones')
  const $epis = document.querySelector('#episodios')
  $npcs.classList.remove('is-active')
  $locs.classList.remove('is-active')
  $epis.classList.add('is-active')
  const $searchbar = document.querySelector('#searchbar')
  $searchbar.classList.add('searchbar-none')
  appendEpisodes(episodes)
  console.log(episodes)

  const $tabCharacters = document.querySelector('#personajes');
  $tabCharacters.addEventListener('click', async (event) => {

    main();

  })
}
