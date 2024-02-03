

async function fetchPokemons() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/')
    let data = await response.json()
    return data
}
const PokemonList = async () => {

    let pokemons = await fetchPokemons().then((data) => data.results);
    console.log(pokemons);
    return (
        <div className="w-full border-t-gray-400 border-[1px]">
        </div>
    )
}

export default PokemonList;
