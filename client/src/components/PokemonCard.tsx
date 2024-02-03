const PokemonCard = (props: { pokemon: any }) => {
    console.log(props.pokemon.sprites.other.home.front_default);

    return (
        <div className="
            h-96 sm:w-64 rounded-md bg-white border-gray-400 border-[1px] w-full flex justify-end flex-col pb-16 gap-12
            ">
            {{
                ...props.pokemon.sprites && (
                    <img
                        src={props.pokemon.sprites.other.home.front_default}
                        alt={props.pokemon.name}
                        className="mx-auto w-40 h-40"
                    />
                )
            }}

            <h1 className="text-lg mx-auto mt-4 text-center text-black capitalize ">
                {props.pokemon.name}
            </h1>
        </div>
    )
}

export default PokemonCard
