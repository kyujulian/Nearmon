import { getPokemons } from "@/services/pokemons";

export async function GET() {
    const pokemons = await getPokemons();
    return pokemons;
}
