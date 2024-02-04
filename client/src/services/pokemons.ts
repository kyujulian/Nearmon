export type Pokemon = {
    name: string;
    spriteUrl: string
}
export async function getPokemons(limit?: number, offset?: number): Promise<Pokemon[]> {
    if (offset && (offset < 0 || offset > 1000)) {
        return [];
    }
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit || 30}&offset=${offset || 0}`);
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

export async function getPokemonsByName(name: string): Promise<Pokemon[]> {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1118`);
    const data = await response.json();

    const pokemons = await Promise.all(data.results
        .filter((pokemon: { name: string; url: string }) => pokemon.name.includes(name))
        .map(async (pokemon: { name: string; url: string }) => {
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
