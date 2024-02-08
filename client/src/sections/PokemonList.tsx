"use client";
import { getPokemons, getPokemonsByName } from '@/services/pokemons'
import type { Pokemon } from '@/services/pokemons'
import PokemonCard from '@/components/PokemonCard'


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


import autoAnimate from "@formkit/auto-animate";

import { useEffect, useState, useRef } from 'react';

const DEFAULT_OFFSET = 30;
const DEFAULT_LIMIT = 30;

const PokemonList = (props: { selectPokemon: any }) => {


    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [oldPokemons, setOldPokemons] = useState<Pokemon[]>([]); // for memoizing

    let [filter, setFilter] = useState<string>('');
    let [isSearching, setIsSearching] = useState<boolean>(false);
    let [offset, setOffset] = useState<number>(DEFAULT_OFFSET);



    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {

        parent.current && autoAnimate(parent.current);
        const fetchPokemons = async () => {
            let pokemons = await getPokemons(DEFAULT_LIMIT, 0);
            setPokemons(pokemons);
        }
        fetchPokemons();
    }, [parent]);




    const noMorePokemons = (filter: string) => {
        return pokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().includes(filter.toLowerCase())
        }).length === 0
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        if (e.target.value.length > 0) {
            if (oldPokemons.length === 0) {
                setOldPokemons(pokemons);
            }
            setIsSearching(true);
        } else {
            setIsSearching(false);
            setPokemons(oldPokemons);
        }

        if (noMorePokemons(e.target.value)) {

            setOldPokemons(pokemons);

            const fetchPokemonsByName = async () => {
                let newPokemons = await getPokemonsByName(e.target.value);
                setPokemons(newPokemons);
            }
            fetchPokemonsByName();
        }
    };

    // infinite scroll
    if (window) {
        window.onscroll = function(ev) {
            let bottom = (window.innerHeight + window.scrollY) == document.body.offsetHeight;

            if (bottom && !isSearching) {
                console.log('bottom')

                const fetchPokemons = async () => {
                    let newpokemons = await getPokemons(DEFAULT_LIMIT, offset);



                    console.log('new', newpokemons)
                    //append newly fetched pokemons to the existing list without replacing or repeating
                    setPokemons([...pokemons, ...newpokemons]);

                    setOffset(offset + DEFAULT_OFFSET)// called after because of the delay in hook
                }
                fetchPokemons();
            }

        }
    }

    const forceSearch = (e: any) => {

        const fetchPokemonsByName = async () => {
            let newPokemons = await getPokemonsByName(e.target.value);
            setPokemons(newPokemons);
        }
        fetchPokemonsByName();
    }



    return (
        <div className=" absolute top-0 left-0 w-[600px]  mx-auto pb-16 h-[600px] rounded-xl bg-gray-100 overflow-scroll overflow-x-hidden z-50 border-gray-400 border-[1px]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-row justify-between items-center ">
                    <div className="flex gap-2 mx-auto py-10">
                        <input type="text" placeholder="Search Pokemon" value={filter} onChange={handleSearchInputChange} className="max-w-xl border-[1px] border-gray-400 rounded-md p-2" />
                        <button className="bg-black text-white rounded-md p-2 transition" onClick={forceSearch}>Submit</button>
                    </div>
                </div>
                <div ref={parent} className="flex flex-wrap gap-2  items-start justify-center ">
                    {
                        pokemons && pokemons.filter((pokemon) => {
                            return pokemon.name.toLowerCase().includes(filter.toLowerCase())
                        }).map((pokemon: Pokemon, i) => {
                            return (
                                <PokemonCardItem pokemon={pokemon} selectPokemon={props.selectPokemon} key={pokemon.name + i} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default PokemonList;
