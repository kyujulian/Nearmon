import type { Pokemon } from "@/services/pokemons";

const PokemonCardItem = (props: { pokemon: Pokemon, selectPokemon: any }) => {

    return (
        <div onClick={props.selectPokemon} pokemon-name={props.pokemon.name} pokemon-spriteurl={props.pokemon.spriteUrl} className="h-[200px] w-[200px] flex items-center justify-center flex-col gap-2 hover:scale-105 hover:cursor-pointer">
            <div className="overflow-hidden rounded-full  h-[150px] w-[150px] bg-white flex justify-center items-center">
                <img src={props.pokemon.spriteUrl} alt={props.pokemon.name} className="w-[150px] h-[150px]" />
            </div>
            <p className="text-center">{props.pokemon.name}</p>
        </div>
    )
}

export default PokemonCardItem;
