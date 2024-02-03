import PokemonCard from '@/components/PokemonCard'



async function fetchPikachu() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    let data = await response.json()
    return data
}

async function fetchGeodude() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/geodude')
    let data = await response.json()
    return data
}

let pikachu = fetchPikachu();
let geodude = fetchGeodude();

const PokemonSelector = async () => {

    let pokemon1 = await pikachu.then((data) => data);
    let pokemon2 = await geodude.then((data) => data);

    return (
        <div className="flex min-w-full flex-col justify-around gap-10 px-10 sm:flex-row sm:gap-0 sm:px-0 ">
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard pokemon={pokemon1} />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white">
                    Vote
                </button>
            </div>
            <div className="flex flex-col gap-10 items-center">
                <PokemonCard pokemon={pokemon2} />
                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white">
                    Vote
                </button>
            </div>
        </div>
    )
}
export default PokemonSelector
