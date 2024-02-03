import { getPokemons } from '@/services/pokemons'
import type { Pokemon } from '@/services/pokemons'
import PokemonCard from '@/components/PokemonCard'

async function fetchPokemons() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/')
    let data = await response.json()
    return data
}

const PokemonList = async () => {

    let pokemons = await getPokemons();
    return (
        <div className="w-full mx-auto pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-row justify-between items-center ">
                    <h1 className="text-3l font-bold my-20">
                        Pokemons
                    </h1>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Search Pokemon" className="max-w-xl border-[1px] border-gray-400 rounded-md p-2" />
                        <button className="bg-black text-white rounded-md px-4 py-2"> Submit </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2  items-start justify-center ">
                    {
                        pokemons && pokemons.map((pokemon: Pokemon) => {
                            return (
                                <PokemonCard pokemon={pokemon} key={pokemon.name} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default PokemonList;
