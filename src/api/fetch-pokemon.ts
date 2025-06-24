export async function fetchPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=3');
    const json = await response.json();

    return json.results;
}
