import Image from 'next/image'
import PokemonSelector from '@/components/PokemonSelector'
import Navbar from "@/sections/Navbar"
import PokemonList from "@/sections/PokemonList"
import { WalletSelectorContextProvider } from '@/contexts/WalletSelectorContext'
export default function Home() {
    return (
        <main className="h-[80vh]">
            <div className="align-center mx-auto mt-10 flex max-w-5xl flex-col justify-center items-center gap-10">
                {' '}
                <h1 className="text-center text-3xl text-black">
                    {' '}
                    Start a new Contest
                </h1>
                <PokemonSelector />
            </div>
        </main>
    )
}
