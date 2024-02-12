import PokemonCardItem from '@/components/PokemonCardItem'
import { Pokemon } from '@/services/pokemons'


import type { ViewRequest, CallRequest } from "@/contexts/contractInteraction";

import { WalletSelectorContextProvider, useWalletSelector } from '@/contexts/WalletSelectorContext'
import { ContestDisplay } from '@/components/PokemonContests'


export default function Home() {
    return (
        <main className="w-7xl ">
            <div className="align-center  mx-auto mt-10 flex max-w-5xl flex-col justify-center items-center gap-10">
                <h1 className="text-center text-3xl text-black">
                    All Contests
                </h1>
                <WalletSelectorContextProvider >
                    <ContestDisplay />
                </WalletSelectorContextProvider>
            </div>
        </main >
    )
}
