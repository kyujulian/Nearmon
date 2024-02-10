use near_workspaces::{types::NearToken, Account, Contract};
use serde_json::json;
use std::{env, fs};

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
    test_voting_time_fails(&alice, &contract).await?;
    // test_changes_message(&alice, &contract).await?;
    Ok(())
}

// #[test]
// #[should_panic]
// fn voting_time_fails() {
//     use std::thread;
//     use std::time::Duration;
//
//     let mut contract = setup_contract_time_offset(2);
//
//     let contest = contract.contests.get(&0).expect("Contest not found");
//
//     assert!(contest.max_time > current_timestamp_millis());
//
//     thread::sleep(Duration::from_secs(3));
//
//     contract.vote(0, "Pikachu".to_string());
// }

async fn test_voting_time_fails(
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

    let contest: String = user
        .call(contract.id(), "get_contest")
        .args_json(json!({"id": 0}))
        .transact()
        .await?
        .json()?;

    // assert!(contest.max_time > current_timestamp_millis());

    // thread::sleep(Duration::from_secs(3));

    // contract.vote(0, "Pikachu".to_string());

    println!("{}", contest);
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
