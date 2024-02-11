use near_workspaces::{types::NearToken, Account, Contract};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{env, fs};

#[derive(Serialize, Deserialize, Debug)]
pub struct Pokemon {
    name: String,
    votes: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PokemonContest {
    max_time: u64,
    poke_first: Pokemon,
    poke_second: Pokemon,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let wasm_arg: &str = &(env::args().nth(1).unwrap());
    let wasm_filepath = fs::canonicalize(env::current_dir()?.join(wasm_arg))?;

    let worker = near_workspaces::sandbox().await?;
    let wasm = std::fs::read(wasm_filepath)?;
    let contract = worker.dev_deploy(&wasm).await?;

    // create accounts
    let account = worker.dev_create_account().await?;
    let alice = account
        .create_subaccount("alice")
        .initial_balance(NearToken::from_near(30))
        .transact()
        .await?
        .into_result()?;

    // begin tests
    test_default_message(&alice, &contract).await?;
    test_get_contests(&alice, &contract).await?;
    // test_json_contest_voting(&alice, &contract).await?;
    // test_changes_message(&alice, &contract).await?;
    Ok(())
}

async fn test_get_contests(
    user: &Account,
    contract: &Contract,
) -> Result<(), Box<dyn std::error::Error>> {
    add_contest(
        &user,
        &contract,
        "Pikachu".to_string(),
        "Charmander".to_string(),
        0,
    )
    .await?;
    add_contest(
        &user,
        &contract,
        "Bulbasaur".to_string(),
        "Squirtle".to_string(),
        1,
    )
    .await?;
    add_contest(
        &user,
        &contract,
        "Pidgey".to_string(),
        "Rattata".to_string(),
        2,
    )
    .await?;
    add_contest(
        &user,
        &contract,
        "Zubat".to_string(),
        "Geodude".to_string(),
        3,
    )
    .await?;
    add_contest(
        &user,
        &contract,
        "Caterpie".to_string(),
        "Weedle".to_string(),
        4,
    )
    .await?;

    let contests_json: String = user
        .call(contract.id(), "get_contests")
        .args_json(json!({}))
        .transact()
        .await?
        .json()?;

    println!("{}", contests_json);

    let contests_string_vec: Vec<String> =
        serde_json::from_str(&contests_json).expect("Failed to deserialize");

    let contests = contests_string_vec
        .iter()
        .map(|contest| serde_json::from_str::<PokemonContest>(contest).unwrap())
        .collect::<Vec<PokemonContest>>();

    assert!(contests.len() == 5);
    assert!(contests[0].poke_first.name == "Pikachu");
    assert!(contests[1].poke_first.name == "Bulbasaur");
    assert!(contests[2].poke_first.name == "Pidgey");
    assert!(contests[3].poke_first.name == "Zubat");
    println!("{:#?}", contests);

    println!("      Passed ✅ get contests");

    Ok(())
}

async fn add_contest(
    user: &Account,
    contract: &Contract,
    pokemon_first: String,
    pokemon_second: String,
    id: i64,
) -> Result<(), Box<dyn std::error::Error>> {
    user.call(contract.id(), "add_contest")
        .args_json(json!(
            {
                "id": id,
                "poke_first": {
                "name" : pokemon_first,
                "votes" : 0
                },
                "poke_second": {
                "name" : pokemon_second,
                "votes" : 0
            },
        }))
        .transact()
        .await?
        .into_result()?;

    Ok(())
}
async fn test_json_contest_voting(
    user: &Account,
    contract: &Contract,
) -> Result<(), Box<dyn std::error::Error>> {
    user.call(contract.id(), "add_contest")
        .args_json(json!(
            {
                "id": 0,
                "poke_first": {
                "name" : "Pikachu",
                "votes" : 0
                },
                "poke_second": {
                "name" : "Charmander",
                "votes" : 0
            },
        }))
        .transact()
        .await?
        .into_result()?;

    user.call(contract.id(), "vote")
        .args_json(json!({"id": 0, "pokemon_name": "Pikachu"}))
        .transact()
        .await?
        .into_result()?;

    user.call(contract.id(), "vote")
        .args_json(json!({"id": 0, "pokemon_name": "Pikachu"}))
        .transact()
        .await?
        .into_result()?;

    user.call(contract.id(), "vote")
        .args_json(json!({"id": 0, "pokemon_name": "Charmander"}))
        .transact()
        .await?
        .into_result()?;

    let contest_json: String = user
        .call(contract.id(), "get_contest")
        .args_json(json!({"id": 0}))
        .transact()
        .await?
        .json()?;

    println!("{}", contest_json);
    let contest: PokemonContest = serde_json::from_str(&contest_json).unwrap();
    // assert!(contest.max_time > current_timestamp_millis());

    // thread::sleep(Duration::from_secs(3));

    // contract.vote(0, "Pikachu".to_string());

    assert!(contest.poke_second.name == "Charmander");
    assert!(contest.poke_first.name == "Pikachu");
    assert!(contest.poke_first.votes > contest.poke_second.votes);

    println!("      Passed ✅ pokemon contest");
    Ok(())
}
async fn test_default_message(
    user: &Account,
    contract: &Contract,
) -> Result<(), Box<dyn std::error::Error>> {
    let greeting: String = user
        .call(contract.id(), "ping")
        .args_json(json!({}))
        .transact()
        .await?
        .json()?;

    assert_eq!(greeting, "Ping working ;)".to_string());
    println!("      Passed ✅ gets default greeting");
    Ok(())
}

// async fn test_changes_message(
//     user: &Account,
//     contract: &Contract,
// ) -> Result<(), Box<dyn std::error::Error>> {
//     user.call(contract.id(), "set_greeting")
//         .args_json(json!({"greeting": "Howdy"}))
//         .transact()
//         .await?
//         .into_result()?;
//
//     let greeting: String = user
//         .call(contract.id(), "get_greeting")
//         .args_json(json!({}))
//         .transact()
//         .await?
//         .json()?;
//
//     assert_eq!(greeting, "Howdy".to_string());
//     println!("      Passed ✅ changes greeting");
//     Ok(())
// }
