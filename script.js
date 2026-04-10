const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const errorArea = document.getElementById('error-area');
const loadingArea = document.getElementById('loading-area');
const resultArea = document.getElementById('result-area');
const pokemonSprite = document.getElementById('pokemon-sprite');
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const typesRow = document.getElementById('types-row');
const pokemonHeight = document.getElementById('pokemon-altura');
const pokemonWeight = document.getElementById('pokemon-peso');
const pokemonHp = document.getElementById('pokemon-vida');

function ocultarElemento(elemento) {
    elemento.classList.add('oculto');
    elemento.classList.remove('visivel');
}

function exibirElemento(elemento) {
    elemento.classList.remove('oculto');
    elemento.classList.add('visivel');
}

async function buscarPokemon(identificador) {
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${identificador}`;
    const resposta = await fetch(endpoint);

    if (!resposta.ok) {
    throw new Error(`Pokémon não encontrado (status ${resposta.status})`);
}

    const dados = await resposta.json();
        return dados;
}

function exibirResultado(dados) {
    pokemonSprite.src = dados.sprites.front_default || '';
    pokemonSprite.alt = `Sprite do Pokémon ${dados.name}`;

    pokemonId.textContent = `Nº ${String(dados.id).padStart(3, '0')}`;
    pokemonName.textContent = dados.name;

    typesRow.innerHTML = '';
    dados.types.forEach(function (entrada) {
    const badge = document.createElement('span');
    badge.className = `type-badge type-${entrada.type.name}`;
    badge.textContent = entrada.type.name;
    typesRow.appendChild(badge);
});

const estatisticaHp = dados.stats.find(function (estatistica) {
    return estatistica.stat.name === 'hp';
});

    pokemonHeight.textContent = (dados.height / 10).toFixed(1) + ' m';
    pokemonWeight.textContent = (dados.weight / 10).toFixed(1) + ' kg';
    pokemonHp.textContent = estatisticaHp ? estatisticaHp.base_stat : '-';

    ocultarElemento(errorArea);
    exibirElemento(resultArea);
}

function exibirErro(mensagem) {
    errorArea.textContent = mensagem;
    exibirElemento(errorArea);
    ocultarElemento(resultArea);
}

async function handleBusca() {
    const valorBusca = searchInput.value.trim().toLowerCase();

    if (!valorBusca) {
    searchInput.focus();
    return;
}

    searchButton.disabled = true;
        ocultarElemento(resultArea);
        ocultarElemento(errorArea);
        exibirElemento(loadingArea);

        try {
        const dados = await buscarPokemon(valorBusca);
    exibirResultado(dados);
} catch (erro) {
    exibirErro('Pokémon não encontrado. Verifique o nome ou número e tente novamente.');
} finally {
    searchButton.disabled = false;
    ocultarElemento(loadingArea);
}
}

searchButton.addEventListener('click', handleBusca);

searchInput.addEventListener('keydown', function (evento) {
if (evento.key === 'Enter') {
    handleBusca();
}
});