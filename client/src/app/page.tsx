import Image from 'next/image'
import PokemonSelector from '@/components/PokemonSelector'
import Navbar from "@/sections/Navbar"
import PokemonList from "@/sections/PokemonList"
export default function Home() {
    return (
        <main className="">
            <Navbar />
            <div className="align-center mx-auto mt-10 flex max-w-5xl flex-col justify-center gap-10">
                {' '}
                <h1 className="text-center text-3xl text-black">
                    {' '}
                    Which one would win?
                </h1>
                <PokemonSelector />
            </div>
            <PokemonList />
        </main>
    )
}
