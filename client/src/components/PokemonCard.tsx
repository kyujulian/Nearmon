import type { Pokemon } from '@/services/pokemons'
import { IoIosAddCircle } from "react-icons/io";
import { useState } from "react";
import PokemonList from "@/sections/PokemonList";


const PokemonCard = (props: { pokemon: Pokemon | null, setPokemon: any }) => {
    const [modal, setModal] = useState(false);

    let showModal = () => {
        setModal(true);
    }

    let selectPokemon = (e: any) => {
        props.setPokemon({ name: e.currentTarget.getAttribute('pokemon-name'), spriteUrl: e.currentTarget.getAttribute('pokemon-spriteurl') });
        setModal(false);
    };

    return (
        <div className="relative">
            <div onClick={showModal} className="pokemon-card__container h-96 sm:w-64 rounded-md bg-white border-gray-400 border-[1px] w-full flex justify-center items-center flex-col  gap-12 hover:cursor-pointer hover:scale-110 transition">
                {props.pokemon &&
                    <div>
                        <img src={props.pokemon.spriteUrl} alt={props.pokemon.name} className="w-[150px] h-[150px]" />
                        <p className="text-center">{props.pokemon.name}</p>
                    </div>}

                {!props.pokemon && <IoIosAddCircle className="text-[96px] text-gray-200 " />}
            </div>
            {modal &&
                <PokemonList selectPokemon={selectPokemon} />
            }
        </div>
    )
}

export default PokemonCard

