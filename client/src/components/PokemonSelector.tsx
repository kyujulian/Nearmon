import PokemonCard from '@/components/PokemonCard'
const PokemonSelector = () => {
    return (
        <div className="flex min-w-full flex-col justify-around gap-10 px-10 sm:flex-row sm:gap-0 sm:px-0 ">
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white">
                    Vote
                </button>
            </div>
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white">
                    Vote
                </button>
            </div>
        </div>
    )
}
export default PokemonSelector
