// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
// use near_sdk::env::log_str;
// use near_sdk::json_types::U128;
use near_sdk::near_bindgen;
use near_sdk::serde::Serialize;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

fn current_timestamp_millis() -> u64 {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    since_the_epoch.as_millis() as u64 // Convert to milliseconds
}

fn current_timestamp_millis_offset_by(offset_sec: u64) -> u64 {
    let offset = Duration::from_secs(offset_sec);
    let future_time = SystemTime::now() + offset;

    let since_the_epoch = future_time
        .duration_since(UNIX_EPOCH)
        .expect("Time wen't backwards")
        .as_millis();

    since_the_epoch as u64
}

fn current_timestamp_seconds() -> u64 {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    since_the_epoch.as_secs() // No conversion needed for seconds
}

#[derive(Serialize, BorshDeserialize, BorshSerialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Pokemon {
    name: String,
    votes: usize,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct PokemonContest {
    id: u64,
    max_time: u64,
    poke_first: Pokemon,
    poke_second: Pokemon,
}

impl PokemonContest {
    pub fn new(id: u64, poke_first: Pokemon, poke_second: Pokemon, max_time: u64) -> Self {
        Self {
            id,
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
    greeting: String,
    contests: Vec<PokemonContest>,
    contest_lifetime: u64,
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        let contest_lifetime = current_timestamp_millis_offset_by(3600);
        Self {
            greeting: "Ping working ;)".to_string(),
            // contests: Vector::new(b"contests".to_vec()),
            contests: Vec::new(),
            contest_lifetime,
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    pub fn new(offset_min: u64) -> Self {
        let contest_lifetime = current_timestamp_millis_offset_by(offset_min);
        Self {
            greeting: "Ping working ;)".to_string(),
            // contests: Vector::new(b"contests".to_vec()),
            contests: Vec::new(),
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
    pub fn add_contest(&mut self, id: u64, poke_first: Pokemon, poke_second: Pokemon) {
        let contest = PokemonContest::new(id, poke_first, poke_second, self.contest_lifetime);
        self.contests.push(contest);
    }
    pub fn vote(&mut self, id: u64, pokemon_name: String) {
        // let mut contest = self.contests.get(id).expect("Contest not found");
        let contest = self
            .contests
            .iter_mut()
            .filter(|c| c.id == id)
            .next()
            .expect("Contest Not found");

        contest.vote(&pokemon_name);
        println!("Voting for {}", pokemon_name);
        println!(
            "{} has {} votes",
            &pokemon_name,
            contest.get(&pokemon_name).votes
        );
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    use std::thread;

    fn setup_contract_time_offset(offset_sec: u64) -> Contract {
        let mut contract = Contract::new(offset_sec);

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

        let contest = contract.contests.get(0).expect("Contest not found");
        assert_eq!(contest.poke_first.name, "Pikachu".to_string());
        assert_eq!(contest.poke_second.name, "Charmander".to_string());
        assert_eq!(contest.total_votes(), 0);
    }

    #[test]
    fn test_vote() {
        let mut contract = setup_contract();
        println!("{:?}", contract);

        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Charmander".to_string());

        contract.vote(1, "Geodude".to_string());
        contract.vote(1, "Bulbasaur".to_string());

        assert_eq!(
            contract
                .contests
                .get(0)
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
                .get(0)
                .expect("Contest not found")
                .poke_second
                .votes,
            1
        );

        assert_eq!(
            contract
                .contests
                .get(1)
                .expect("Contest not found")
                .poke_first
                .votes,
            1
        );
        assert_eq!(
            contract
                .contests
                .get(1)
                .expect("Contest not found")
                .poke_second
                .votes,
            1
        );

        assert_eq!(
            contract
                .contests
                .get(0)
                .expect("Contest not found")
                .total_votes(),
            3
        );
        assert_eq!(
            contract
                .contests
                .get(1)
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
        let now_seconds = current_timestamp_seconds();
        let future = current_timestamp_millis_offset_by(60);

        assert!(now < future);
        assert!(now_seconds < future);
    }

    #[test]
    fn test_contract_lifetime_ends_in_the_future() {
        let contract = Contract::new(60);
        assert!(contract.contest_lifetime > current_timestamp_millis());
    }

    #[test]
    fn voting_time_passes() {
        let mut contract = setup_contract_time_offset(10);

        let contest = contract.contests.get(0).expect("Contest not found");

        assert!(contest.max_time > current_timestamp_millis());

        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Pikachu".to_string());
        contract.vote(0, "Charmander".to_string());

        assert_eq!(
            contract
                .contests
                .get(0)
                .expect("Contest not found")
                .total_votes(),
            3,
        );

        assert_eq!(
            contract
                .contests
                .get(0)
                .expect("Contest not found")
                .poke_first
                .votes,
            2
        );
    }

    #[test]
    #[should_panic]
    fn voting_time_fails() {
        let mut contract = setup_contract_time_offset(2);

        let contest = contract.contests.get(0).expect("Contest not found");

        assert!(contest.max_time > current_timestamp_millis());

        thread::sleep(Duration::from_secs(3));

        contract.vote(0, "Pikachu".to_string());
    }
}
