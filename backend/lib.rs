use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::time;

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub id: String,
    pub name: String,
    pub photo_url: String,
    pub is_service: bool,
    pub city: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Transaction {
    pub id: String,
    pub user_id: String,
    pub amount: i64,
    pub timestamp: u64,
    pub description: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Tire {
    pub id: String,
    pub user_id: String,
    pub brand: String,
    pub size: String,
    pub season: String,
    pub tread_depth_mm: f32,
    pub production_year: u16,
    pub price: Option<u32>,
    pub image_url: String,
    pub sent_to_recycle: bool,
    pub service_id: Option<String>,
}

thread_local! {
    static USERS: std::cell::RefCell<HashMap<String, User>> = Default::default();
    static TRANSACTIONS: std::cell::RefCell<Vec<Transaction>> = Default::default();
    static TIRES: std::cell::RefCell<HashMap<String, Tire>> = Default::default();
}

#[ic_cdk::query]
fn user_exists(principal: String) -> bool {
    USERS.with(|users| users.borrow().contains_key(&principal))
}

#[ic_cdk::query]
fn get_user_by_principal(principal: String) -> Option<User> {
    USERS.with(|users| users.borrow().get(&principal).cloned())
}

#[ic_cdk::update]
fn create_user(id: String, name: String, photo_url: String, is_service: bool, city: String) {
    let caller = ic_cdk::caller();
    USERS.with(|users| {
        users.borrow_mut().insert(id.clone(), User {
            id,
            name,
            photo_url,
            is_service,
            city
        });
    });
}

#[ic_cdk::update]
fn create_tire(
    id: String,
    brand: String,
    size: String,
    season: String,
    tread_depth_mm: f32,
    production_year: u16,
    image_url: String,
) {
    let user_id = ic_cdk::caller();
    let price = estimate_price(size.clone(), tread_depth_mm, production_year);
    let tire = Tire {
        id: id.clone(),
        user_id: user_id.to_string(),
        brand,
        size,
        season,
        tread_depth_mm,
        production_year,
        price,
        image_url,
        sent_to_recycle: false,
        service_id: None,
    };
    TIRES.with(|tires| tires.borrow_mut().insert(id, tire));
}

fn estimate_price(size: String, tread: f32, year: u16) -> Option<u32> {
    let base_price = match size.as_str() {
        "205/55 R16" => 600,
        "215/60 R16" => 700,
        "225/45 R17" => 800,
        _ => 500,
    };
    let current_year = 2025;
    let age_factor = (current_year - year).min(10) as f32 * 0.05;
    let tread_factor = (8.0 - tread).min(8.0) / 8.0;
    let discount = (age_factor + tread_factor).min(0.9);
    Some((base_price as f32 * (1.0 - discount)).round() as u32)
}

#[ic_cdk::update]
fn assign_tire_to_service(tire_id: String, service_id: String) {
    TIRES.with(|tires| {
        if let Some(tire) = tires.borrow_mut().get_mut(&tire_id) {
            tire.service_id = Some(service_id);
        }
    });
}

#[ic_cdk::update]
fn create_transaction(id: String, amount: i64, description: String, ) {
    let user_id = ic_cdk::caller();
    let tx = Transaction {
        id,
        user_id: user_id.to_string(),
        amount,
        timestamp: time(),
        description,
    };
    TRANSACTIONS.with(|txs| txs.borrow_mut().push(tx));
}

#[ic_cdk::query]
fn get_all_tires() -> Vec<Tire> {
    TIRES.with(|tires| tires.borrow().values().cloned().collect())
}

#[ic_cdk::query]
fn get_transactions_by_user(user_id: String) -> Vec<Transaction> {
    TRANSACTIONS.with(|txs| {
        txs.borrow()
            .iter()
            .filter(|tx| tx.user_id == user_id)
            .cloned()
            .collect()
    })
}

#[ic_cdk::update]
fn change_tire_owner(tire_id: String, new_owner: String) {
    TIRES.with(|tires| {
        if let Some(tire) = tires.borrow_mut().get_mut(&tire_id) {
            tire.user_id = new_owner;
            tire.service_id = None;
        }
    });
}

#[ic_cdk::update]
fn recycle_tire(tire_id: String) {
    TIRES.with(|tires| {
        if let Some(tire) = tires.borrow_mut().get_mut(&tire_id) {
            tire.sent_to_recycle = true;
        }
    });
}

#[ic_cdk::query]
fn get_all_users() -> Vec<User> {
    USERS.with(|users| users.borrow().values().cloned().collect())
}

type Result<T> = std::result::Result<T, String>;

ic_cdk::export_candid!();
