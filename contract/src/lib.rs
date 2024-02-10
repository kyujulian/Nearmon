// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env;
use near_sdk::near_bindgen;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::store::UnorderedMap;

fn current_timestamp_millis() -> u64 {
    let now = env::block_timestamp_ms();

    now
}

fn current_timestamp_millis_offset_by(offset_sec: u64) -> u64 {
    let now = env::block_timestamp_ms();
    now + offset_sec * 1000
}

#[derive(Serialize, BorshDeserialize, BorshSerialize, Debug, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Pokemon {
    name: String,
    votes: usize,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct PokemonContest {
    max_time: u64,
    poke_first: Pokemon,
    poke_second: Pokemon,
}

impl PokemonContest {
    pub fn new(poke_first: Pokemon, poke_second: Pokemon, max_time: u64) -> Self {
        Self {
            poke_first,
            poke_second,
            max_time,
        }
    }

    pub fn get(&self, pokemon_name: &str) -> &Pokemon {
        if pokemon_name == self.poke_first.name {
            return &self.poke_first;
        } else if pokemon_name == self.poke_second.name {
            return &self.poke_second;
        }
        panic!("Pokemon not found")
    }

    pub fn vote(&mut self, pokemon_name: &str) {
        let now = current_timestamp_millis();
        if now > self.max_time {
            panic!("Voting time has ended");
        }
        if pokemon_name == self.poke_first.name {
            println!("Voting for {}", pokemon_name);
            self.poke_first.votes += 1;
            return;
        } else if pokemon_name == self.poke_second.name {
            println!("Voting for {}", pokemon_name);
            self.poke_second.votes += 1;
            return;
        }
        panic!("Pokemon not found")
    }

    pub fn total_votes(&self) -> usize {
        self.poke_first.votes + self.poke_second.votes
    }
}

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Contract {
    contest_lifetime: u64,
    contests: Contests,
    greeting: String,
}

use near_sdk::serde::{self};
use serde::ser::SerializeStruct;
impl Serialize for Contract {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("Contract", 3)?;
        state.serialize_field("contest_lifetime", &self.contest_lifetime)?;
        state.serialize_field("contests", &self.contests)?;
        state.serialize_field("greeting", &self.greeting)?;
        state.end()
    }
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
struct Contests {
    contests: UnorderedMap<i64, PokemonContest>,
}

impl Contests {
    pub fn new() -> Self {
        Self {
            contests: UnorderedMap::new(b"contests".to_vec()),
        }
    }
    pub fn len(&self) -> u32 {
        self.contests.len()
    }
    pub fn get(&self, id: &i64) -> Option<&PokemonContest> {
        self.contests.get(&id)
    }

    pub fn get_mut(&mut self, id: &i64) -> Option<&mut PokemonContest> {
        self.contests.get_mut(&id)
    }

    pub fn insert(&mut self, id: i64, contest: PokemonContest) {
        self.contests.insert(id, contest);
    }

    pub fn remove(&mut self, id: i64) {
        self.contests.remove(&id);
    }

    pub fn iter(&self) -> Vec<(&i64, &PokemonContest)> {
        self.contests.iter().collect()
    }
}

impl Serialize for Contests {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("Contest", 1)?;
        state.serialize_field("len", &self.contests.len())?;
        state.end()
    }
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        let contest_lifetime = current_timestamp_millis_offset_by(3600);
        Self {
            greeting: "Ping working ;)".to_string(),
            contests: Contests::new(),
            contest_lifetime,
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    pub fn new(offset_sec: u64) -> Self {
        let contest_lifetime = current_timestamp_millis_offset_by(offset_sec);
        Self {
            greeting: "Ping working ;)".to_string(),
            contests: Contests::new(),
            contest_lifetime,
        }
    }
    // Public method - returns the greeting saved, defaulting to DEFAULT_GREETING
    pub fn ping(&self) -> String {
        return self.greeting.clone();
    }

    // Public method - accepts a greeting, such as "howdy", and records it
    // pub fn set_greeting(&mut self, greeting: String) {
    //     log_str(&format!("Saving greeting: {greeting}"));
    //     self.greeting = greeting;
    // }
    /// internal function
    pub fn add_contest(&mut self, id: i64, poke_first: Pokemon, poke_second: Pokemon) {
        if self.contests.len() < 5 {
            let contest = PokemonContest::new(poke_first, poke_second, self.contest_lifetime);
            self.contests.insert(id, contest);
        }
    }

    pub fn get_contest(&self, id: i64) -> String {
        format!("{:?}", self.contests.get(&id).expect("Contest Not found"))
    }
    pub fn vote(&mut self, id: i64, pokemon_name: String) {
        if self.contests.len() == 0 {
            panic!("No contests available");
        }

        let now = env::block_timestamp_ms();
        let contest = self.contests.get_mut(&id).expect("Contest not found");

        if now > contest.max_time {
            panic!("Voting time has ended");
        }
        println!("{} vs {}", now, contest.max_time);

        contest.vote(&pokemon_name);
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    use std::{
        thread,
        time::{Duration, SystemTime, UNIX_EPOCH},
    };

    fn setup_contract_time_offset(offset_sec: u64) -> Contract {
        let offset = Duration::from_secs(offset_sec);
        let future_time = SystemTime::now() + offset;

        let since_the_epoch = future_time
            .duration_since(UNIX_EPOCH)
            .expect("Time wen't backwards")
            .as_millis();

        let mut contract = Contract {
            contest_lifetime: since_the_epoch as u64,
            contests: Contests::new(),
            greeting: "Ping working ;)".to_string(),
        };

        contract.add_contest(
            0,
            Pokemon {
                name: "Pikachu".to_string(),
                votes: 0,
            },
            Pokemon {
                name: "Charmander".to_string(),
                votes: 0,
            },
        );

        contract.add_contest(
            1,
            Pokemon {
                name: "Geodude".to_string(),
                votes: 0,
            },
            Pokemon {
                name: "Bulbasaur".to_string(),
                votes: 0,
            },
        );

        return contract;
    }
    fn setup_contract() -> Contract {
        let mut contract = Contract::default();

        contract.add_contest(
            0,
            Pokemon {
                name: "Pikachu".to_string(),
                votes: 0,
            },
            Pokemon {
                name: "Charmander".to_string(),
                votes: 0,
            },
        );

        contract.add_contest(
            1,
            Pokemon {
                name: "Geodude".to_string(),
                votes: 0,
            },
            Pokemon {
                name: "Bulbasaur".to_string(),
                votes: 0,
            },
        );

        return contract;
    }

    #[test]
    fn ping() {
        let contract = Contract::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(contract.ping(), "Ping working ;)".to_string());
    }

    #[test]
    fn add_contest() {
        let mut contract = Contract::default();

        contract.add_contest(
            0,
            Pokemon {
                name: "Pikachu".to_string(),
                votes: 0,
            },
            Pokemon {
                name: "Charmander".to_string(),
                votes: 0,
            },
        );

        assert!(contract.contests.len() == 1);

        let contest = contract.contests.get(&0).expect("Contest not found");
        assert_eq!(contest.poke_first.name, "Pikachu".to_string());
        assert_eq!(contest.poke_second.name, "Charmander".to_string());
        assert_eq!(contest.total_votes(), 0);
    }

    #[test]
    fn test_vote() {
        let mut contract = setup_contract();
        // println!("{:?}", contract);

        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Charmander".to_string());

        contract.vote(1, "Geodude".to_string());
        contract.vote(1, "Bulbasaur".to_string());

        assert_eq!(
            contract
                .contests
                .get(&0)
                .expect("Contest not found")
                .poke_first
                .votes,
            2,
            "Votes not counted, contract: {:?}",
            contract
        );
        assert_eq!(
            contract
                .contests
                .get(&0)
                .expect("Contest not found")
                .poke_second
                .votes,
            1
        );

        assert_eq!(
            contract
                .contests
                .get(&1)
                .expect("Contest not found")
                .poke_first
                .votes,
            1
        );
        assert_eq!(
            contract
                .contests
                .get(&1)
                .expect("Contest not found")
                .poke_second
                .votes,
            1
        );

        assert_eq!(
            contract
                .contests
                .get(&0)
                .expect("Contest not found")
                .total_votes(),
            3
        );
        assert_eq!(
            contract
                .contests
                .get(&1)
                .expect("Contest not found")
                .total_votes(),
            2
        );
    }

    #[test]
    #[should_panic]
    fn test_vote_panic() {
        let mut contract = setup_contract_time_offset(10);
        contract.vote(0, "Pikachuu".to_string());
    }

    #[test]
    fn test_timestamp() {
        let now = current_timestamp_millis();
        let future = current_timestamp_millis_offset_by(60);

        assert!(now < future);
    }

    #[test]
    fn test_contract_lifetime_ends_in_the_future() {
        let contract = Contract::new(60);
        assert!(contract.contest_lifetime > current_timestamp_millis());
    }

    #[test]
    fn voting_time_passes() {
        let mut contract = setup_contract_time_offset(10);

        let contest = contract.contests.get(&0).expect("Contest not found");

        assert!(contest.max_time > current_timestamp_millis());

        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Charmander".to_string());

        assert_eq!(
            contract
                .contests
                .get(&0)
                .expect("Contest not found")
                .total_votes(),
            3,
        );

        assert_eq!(
            contract
                .contests
                .get(&0)
                .expect("Contest not found")
                .poke_first
                .votes,
            2
        );
    }
}
