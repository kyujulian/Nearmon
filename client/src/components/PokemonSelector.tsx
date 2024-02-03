import PokemonCard from '@/components/PokemonCard'
import { getPokemonByName } from '@/services/pokemons'



const PokemonSelector = async () => {

    let pokemon1 = await getPokemonByName('pikachu');
    let pokemon2 = await getPokemonByName('charmander');

    return (
        <div className="flex min-w-full flex-col justify-around gap-10 px-10 sm:flex-row sm:gap-0 sm:px-0 pb-16" >
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard key="" pokemon={pokemon1} />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white hover:scale-110 transition shadow-black drop-shadow-sm">
                    Vote
                </button>
            </div>
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard key="" pokemon={pokemon2} />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white hover:scale-110 transition ">
                    Vote
                </button>
            </div>
        </div>
    )
}
export default PokemonSelector
