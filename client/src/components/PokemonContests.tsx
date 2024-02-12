"use client";
import { viewMethod } from "@/contexts/contractInteraction";
import { useWalletSelector } from '@/contexts/WalletSelectorContext'

import { useEffect, useState } from "react";

import { getPokemonByName } from '@/services/pokemons'
import type { Pokemon } from '@/services/pokemons'

const PokemonDisplayCard = (props: { pokemon: Pokemon }) => {

    return (<div className="pokemon-card__container h-96 sm:w-64 rounded-md bg-white border-gray-400 border-[1px] w-full flex justify-center items-center flex-col  gap-12 hover:cursor-pointer hover:scale-110 transition">
        {props.pokemon &&
            <div>
                <img src={props.pokemon.spriteUrl} alt={props.pokemon.name} className="w-[150px] h-[150px]" />
                <p className="text-center">{props.pokemon.name}</p>
            </div>}
    </div>)
}

const ContestDisplayVote = (props: {}) => {
    const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
    const walletSelectorContext = useWalletSelector();


    const [pokemonContests, setPokemonContests] = useState<any[]>([]);

    useEffect(() => {
        const fetchContests = async () => {
            let pokemonContestsRaw: any[] = await viewMethod({ contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!, method: "get_contests", walletSelector: walletSelectorContext.selector, args: {} });
            console.log("Pokemon Contests: WE GOT NOTHIIIIIIIIIIIIIIIIIIIIIIIING?????????????????????", pokemonContestsRaw);

            let pokemonContestsStringVec: any[] = JSON.parse(pokemonContestsRaw);
            let innerPokemonContests = pokemonContestsStringVec.map((contest: any) => {
                console.log("Contest:", contest);
                return JSON.parse(contest);
            });


            const processPokemonContests = async () => {
                let processedPokemonContests = await Promise.all(innerPokemonContests

                    .filter((contest: any) => {




                        let now = new Date();
                        let contestDate = new Date(contest.max_time / 1_000_000);
                        console.log("Contest Time:", contestDate.toISOString());
                        console.log("Now", now.toISOString());
                        let diff = contestDate.getTime() - now.getTime();
                        //diff in minutes
                        diff = diff / 1000 / 60;
                        console.log("Diff", diff);
                        let test = new Date(Date.now() + 3600 * 1000);
                        console.log(
                            test.toISOString(),
                            "Date.now() < contest.max_time"
                        );
                        return Date.now() < contest.max_time
                    })
                    .map(async (contest: any) => {
                        return {
                            poke_first: await getPokemonByName(contest.poke_first.name),
                            poke_second: await getPokemonByName(contest.poke_second.name)
                        };
                    }));

                setPokemonContests(processedPokemonContests);
            };

            processPokemonContests();



        };

        fetchContests();
    }, []);


    return (
        <div className="">
            {pokemonContests.map((contest: any, i: number) => {
                return (
                    <div key={i} className="text-black py-10">
                        <div className="relative flex flex-row gap-20 items-center">
                            <div className="flex flex-col gap-4 items-center">
                                <PokemonDisplayCard pokemon={contest.poke_first} />
                                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white hover:scale-110 transition shadow-black drop-shadow-sm">Vote </button>
                            </div>
                            VS

                            <div className="flex flex-col gap-4 items-center">
                                <PokemonDisplayCard pokemon={contest.poke_second} />
                                <button className="max-w-24 rounded-md bg-black px-4 py-2 text-white hover:scale-110 transition shadow-black drop-shadow-sm">Vote </button>
                            </div>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default ContestDisplayVote;








export const ContestDisplay = (props: {}) => {
    const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
    const walletSelectorContext = useWalletSelector();


    const [pokemonContests, setPokemonContests] = useState<any[]>([]);

    useEffect(() => {
        const fetchContests = async () => {
            let pokemonContestsRaw: any[] = await viewMethod({ contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!, method: "get_contests", walletSelector: walletSelectorContext.selector, args: {} });

            let pokemonContestsStringVec: any[] = JSON.parse(pokemonContestsRaw);
            let innerPokemonContests = pokemonContestsStringVec.map((contest: any) => {
                console.log("Contest:", contest);
                return JSON.parse(contest);
            });


            const processPokemonContests = async () => {
                let processedPokemonContests = await Promise.all(innerPokemonContests.map(async (contest: any) => {
                    return {
                        poke_first: await getPokemonByName(contest.poke_first.name),
                        first_votes: contest.poke_first.votes,
                        poke_second: await getPokemonByName(contest.poke_second.name),
                        second_votes: contest.poke_second.votes
                    };
                }));
                setPokemonContests(processedPokemonContests);
            };

            processPokemonContests();



            console.log("processed Pokemon Contests:", pokemonContests);

            console.log("Pokemon Contests:", pokemonContestsRaw);

            console.log("Pokemon Contests:", innerPokemonContests);
        };

        fetchContests();
    }, []);


    return (
        <div className="w-full px-10">
            {pokemonContests.map((contest: any, i: number) => {
                return (
                    <div key={i} className=" flex flex-row justify-between items-center text-black my-10 max-h-[400px] border-gray-400 border-[1px] rounded-lg w-7xl bg-gray-100">
                        <div className="flex flex-row items-center w-full justify-between border-r-[1px] border-gray-400 pr-10 ">
                            <div className="flex flex-row items-center gap-10">
                                <div className="bg-white  rounded-l-lg"><img src={contest.poke_first.spriteUrl} alt={contest.poke_first.name} className="w-[150px] h-[150px]" /></div>
                                {contest.poke_first.name}
                            </div>
                            <p className=" text-3xl">{contest.first_votes}</p>
                        </div>
                        <div className="flex flex-row-reverse justify-between items-center w-full pl-10">

                            <div className="flex flex-row-reverse items-center gap-10">
                                <div className="bg-white  rounded-r-lg"><img src={contest.poke_second.spriteUrl} alt={contest.poke_second.name} className="w-[150px] h-[150px]" /></div>
                                {contest.poke_second.name}
                            </div>
                            <p className=" text-3xl">{contest.second_votes}</p>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}
