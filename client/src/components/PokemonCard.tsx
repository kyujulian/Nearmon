import type { Pokemon } from '@/services/pokemons'
const PokemonCard = (props: { pokemon: Pokemon, key: string }) => {

    return (
        <div key={props.key} className="h-96 sm:w-64 rounded-md bg-white border-gray-400 border-[1px] w-full flex justify-end flex-col pb-16 gap-12">
            {
                < img
                    src={props.pokemon.spriteUrl}
                    alt={props.pokemon.name}
                    className="mx-auto w-40 h-40"
                />
            }
            <h1 className="text-lg mx-auto mt-4 text-center text-black capitalize ">
                {props.pokemon.name}
            </h1>
        </div>
    )
}

export default PokemonCard
