use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use serde_json::{self, Value};
use candid::Nat;
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

#[derive(Serialize, Deserialize)]
struct Context {
    bucket_start_time_index: usize,
    closing_price_index: usize,
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

    // the formula, that calculates the tyre price automatically
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

#[ic_cdk::update]
fn create_user_transaction(id: String, amount: i64, description: String, user_id: String) {
    let tx = Transaction {
        id,
        user_id,
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
fn recycle_tire(tire_id: String, amount: i64) {
    TIRES.with(|tires| {
        if let Some(tire) = tires.borrow_mut().get_mut(&tire_id) {
            tire.sent_to_recycle = true;

            
            let brand = tire.brand.clone();
            let tx = Transaction {
                id: tire_id,
                user_id: tire.user_id.clone(),
                amount,
                timestamp: time(),
                description: format!("10 % for recycling tire \"{brand}\""),
            };
            TRANSACTIONS.with(|txs| txs.borrow_mut().push(tx));
        }
    });
}

#[ic_cdk::query]
fn get_all_users() -> Vec<User> {
    USERS.with(|users| users.borrow().values().cloned().collect())
}

#[ic_cdk::update]
async fn get_user_city(lat: String, lon: String) -> String {
    let apiKey = "8739517405194a86adfc82e0c169c068";
    let url = format!("https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={apiKey}&language=en");
    let request_headers = vec![
        HttpHeader {
            name: "User-Agent".to_string(),
            value: "exchange_rate_canister".to_string(),
        },
    ];
    let context = Context {
        bucket_start_time_index: 0,
        closing_price_index: 4,
    };
    let request = CanisterHttpRequestArgument {
        url: url.to_string(),
        method: HttpMethod::GET,
        body: None,
        max_response_bytes: None,
        transform: Some(TransformContext::from_name(
            "transform".to_string(),
            serde_json::to_vec(&context).unwrap(),
        )),
        headers: request_headers,
    };

    match http_request(request, 22000000000).await {
        Ok((response,)) => {
            let str_body = String::from_utf8(response.body)
                .expect("Transformed response is not UTF-8 encoded.");

            str_body
        }
        Err((r, m)) => {
            let message =
                format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}");

            message
        }
    }
}

// Strips all data that is not needed from the original response.
#[ic_cdk::query]
fn transform(raw: TransformArgs) -> HttpResponse {

    let headers = vec![
        HttpHeader {
            name: "Content-Security-Policy".to_string(),
            value: "default-src 'self'".to_string(),
        },
        HttpHeader {
            name: "Referrer-Policy".to_string(),
            value: "strict-origin".to_string(),
        },
        HttpHeader {
            name: "Permissions-Policy".to_string(),
            value: "geolocation=(self)".to_string(),
        },
        HttpHeader {
            name: "Strict-Transport-Security".to_string(),
            value: "max-age=63072000".to_string(),
        },
        HttpHeader {
            name: "X-Frame-Options".to_string(),
            value: "DENY".to_string(),
        },
        HttpHeader {
            name: "X-Content-Type-Options".to_string(),
            value: "nosniff".to_string(),
        },
    ];
    

    let mut res = HttpResponse {
        status: raw.response.status.clone(),
        body: raw.response.body.clone(),
        headers,
        ..Default::default()
    };

    if res.status == Nat::from(200u32) {

        res.body = raw.response.body;
    } else {
        ic_cdk::api::print(format!("Received an error from coinbase: err = {:?}", raw));
    }
    res
}

type Result<T> = std::result::Result<T, String>;

ic_cdk::export_candid!();
