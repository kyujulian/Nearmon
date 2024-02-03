export type Pokemon = {
    name: string;
    spriteUrl: string
}
export async function getPokemons(): Promise<Pokemon[]> {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
    const data = await response.json();


    const pokemons = await Promise.all(data.results.map(async (pokemon: { name: string; url: string }) => {
        const spriteUrl = await getPokemonImage(pokemon.url);
        return {
            name: pokemon.name,
            spriteUrl
        }
    }));

    return pokemons;
}


export async function getPokemonImage(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();

    const spriteUrl = data.sprites.other.home.front_default;
    return spriteUrl;
}

export async function getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();

    const spriteUrl = data.sprites.other.home.front_default;
    return {
        name,
        spriteUrl
    }
}
