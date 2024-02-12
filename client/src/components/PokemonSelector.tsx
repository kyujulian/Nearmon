"use client"


import { useContext, useState } from 'react'
import PokemonCard from '@/components/PokemonCard'
import { getPokemonByName } from '@/services/pokemons'

import PokemonList from '@/sections/PokemonList'

import type { Pokemon } from '@/services/pokemons'
import { useWalletSelector } from '@/contexts/WalletSelectorContext'

import { viewMethod, callMethod } from "@/contexts/contractInteraction";

import type { ViewRequest, CallRequest } from "@/contexts/contractInteraction";

const PokemonSelector = () => {

    const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
    const walletSelectorContext = useWalletSelector();



    const sendPokemonContest = async (e: any) => {

        const callRequest: CallRequest = {
            contractId: CONTRACT_ID!,
            method: "add_contest",
            walletSelector: walletSelectorContext.selector,
            args: { first_pokemon_name: pokemonFirst?.name, second_pokemon_name: pokemonSecond?.name },
            accountId: walletSelectorContext.accountId!,

        }
        callMethod(callRequest);
        console.log("Pokemon 1:", pokemonFirst?.name); console.log("Pokemon 2:", pokemonSecond?.name)
    }



    const [pokemonFirst, setPokemonFirst] = useState<Pokemon | null>(null);
    const [pokemonSecond, setPokemonSecond] = useState<Pokemon | null>(null);


    return (
        <div className=" flex flex-col gap-10 items-center w-full">
            <div className="flex min-w-full flex-col justify-around gap-10 px-10 sm:flex-row sm:gap-0 sm:px-0 pb-16" >
                <div className="flex flex-col gap-10 items-center">
                    <PokemonCard key="" pokemon={pokemonFirst} setPokemon={setPokemonFirst} />
                </div>
                <h3 className="text-3xl text-black text-center self-center">VS</h3>
                <div className="flex flex-col gap-10 items-center">
                    <PokemonCard key="" pokemon={pokemonSecond} setPokemon={setPokemonSecond} />
                </div>
            </div>

            <button onClick={sendPokemonContest} className="max-w-24 rounded-md bg-black px-4 py-2 text-white hover:scale-110 transition shadow-black drop-shadow-sm">
                Send
            </button>
        </div>
    )
}
export default PokemonSelector
