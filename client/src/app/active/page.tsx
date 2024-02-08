import PokemonCardItem from '@/components/PokemonCardItem'
import { Pokemon } from '@/services/pokemons'

const ContestDisplay = (props: { pokemonFirst: Pokemon, pokemonSecond: Pokemon }) => {
    return (
        <div>
            <div>
                <PokemonCardItem pokemon={props.pokemonFirst} selectPokemon={null} />
                <button className="bg-black text-white p-2 rounded-md hover:scale-105 shadow-black drop-shadow-md">vote</button>
            </div>
            <h1>VS</h1>
            <div>
                <PokemonCardItem pokemon={props.pokemonSecond} selectPokemon={null} />
                <button className="bg-black text-white p-2 rounded-md hover:scale-105 shadow-black drop-shadow-md">vote</button>
            </div>

        </div>
    )
}
export default function Home() {
    return (
        <main className="h-[80vh]">
            <div className="align-center mx-auto mt-10 flex max-w-5xl flex-col justify-center items-center gap-10">
                <h1 className="text-center text-3xl text-black">
                    Running Contests
                </h1>
            </div>
        </main>
    )
}
