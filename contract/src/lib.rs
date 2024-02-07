// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::env::log_str;
use near_sdk::json_types::U128;
use near_sdk::near_bindgen;
use near_sdk::serde::Serialize;

use chrono::{DateTime, Utc};

#[derive(Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Pokemon {
    name: String,
    votes: usize,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PokemonContest {
    id: u64,
    max_time: U128,
    poke_first: Pokemon,
    poke_second: Pokemon,
}

impl PokemonContest {
    pub fn new(id: u64, poke_first: Pokemon, poke_second: Pokemon) -> Self {
        Self {
            id,
            poke_first,
            poke_second,
            max_time: U128(0),
        }
    }

    pub fn vote(&mut self, poke: Pokemon) {
        if poke.name == self.poke_first.name {
            self.poke_first.votes += 1;
            return;
        } else if poke.name == self.poke_second.name {
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
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    greeting: String,
    contests: Vector<PokemonContest>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        Self {
            greeting: "Hello".to_string(),
            contests: Vector::new(b"contests".to_vec()),
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the greeting saved, defaulting to DEFAULT_GREETING
    pub fn get_greeting(&self) -> String {
        return self.greeting.clone();
    }

    // Public method - accepts a greeting, such as "howdy", and records it
    pub fn set_greeting(&mut self, greeting: String) {
        log_str(&format!("Saving greeting: {greeting}"));
        self.greeting = greeting;
    }
    pub fn add_contest(&mut self, id: u64, poke_first: Pokemon, poke_second: Pokemon) {
        let contest = PokemonContest::new(id, poke_first, poke_second);
        self.contests.push(&contest);
    }
    pub fn vote(&mut self, id: u64, poke: Pokemon) {
        let mut contest = self.contests.get(id).expect("Contest not found");
        contest.vote(poke);
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_default_greeting() {
        let contract = Contract::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(contract.get_greeting(), "Hello".to_string());
    }

    #[test]
    fn set_then_get_greeting() {
        let mut contract = Contract::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(contract.get_greeting(), "howdy".to_string());
    }
}
