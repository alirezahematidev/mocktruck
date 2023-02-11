use chrono::{Datelike, Duration, NaiveDate, NaiveDateTime, NaiveTime, TimeZone, Utc};
use faker_rand::{
    en_us::{
        addresses::Address,
        company::CompanyName,
        internet::{Domain, Email},
        names::{FirstName, FullName, LastName},
        phones::PhoneNumber,
    },
    lorem::{Paragraph, Paragraphs, Sentence, Word},
};
use rand::Rng;
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_number(count: u32) -> i64 {
    let valid_count = if count <= 0 { 8 } else { count };

    let min = i64::pow(10, valid_count - 1);
    let max = i64::pow(10, valid_count) - 1;

    let mut rng = rand::thread_rng();

    rng.gen_range(min..max).to_string().parse().unwrap()
}

#[wasm_bindgen]
pub fn generate_bool(freq: f64) -> bool {
    let mut rng = rand::thread_rng();

    rng.gen_bool(freq)
}

#[wasm_bindgen]
pub fn generate_uuid() -> String {
    Uuid::new_v4().to_string()
}

#[wasm_bindgen]
pub fn generate_email() -> String {
    rand::random::<Email>().to_string()
}

#[wasm_bindgen]
pub fn generate_firstname() -> String {
    rand::random::<FirstName>().to_string()
}

#[wasm_bindgen]
pub fn generate_lastname() -> String {
    rand::random::<LastName>().to_string()
}

#[wasm_bindgen]
pub fn generate_fullname() -> String {
    rand::random::<FullName>().to_string()
}

#[wasm_bindgen]
pub fn generate_company() -> String {
    rand::random::<CompanyName>().to_string()
}

#[wasm_bindgen]
pub fn generate_phone_number() -> String {
    rand::random::<PhoneNumber>().to_string()
}

#[wasm_bindgen]
pub fn generate_address() -> String {
    rand::random::<Address>().to_string()
}

#[wasm_bindgen]
pub fn generate_paragraph() -> String {
    rand::random::<Paragraph>().to_string()
}

#[wasm_bindgen]
pub fn generate_paragraphs() -> String {
    rand::random::<Paragraphs>().to_string()
}

#[wasm_bindgen]
pub fn generate_domain() -> String {
    rand::random::<Domain>().to_string()
}

#[wasm_bindgen]
pub fn generate_word() -> String {
    rand::random::<Word>().to_string()
}

#[wasm_bindgen]
pub fn generate_sentence() -> String {
    rand::random::<Sentence>().to_string()
}

#[wasm_bindgen]
pub fn generate_iso_date() -> String {
    let mut rng = rand::thread_rng();

    let start_date = NaiveDate::from_ymd_opt(2000, 1, 1).unwrap();

    let now = Utc::now();

    let end_date = NaiveDate::from_ymd_opt(now.year(), now.month(), now.day()).unwrap();

    let num_days = end_date.signed_duration_since(start_date).num_days();

    let random_day = rng.gen_range(0..num_days);

    let random_duration = Duration::days(random_day);

    let random_date = start_date + random_duration;

    let random_time = NaiveTime::from_hms_opt(
        rng.gen_range(0..24),
        rng.gen_range(0..60),
        rng.gen_range(0..60),
    )
    .unwrap();

    let random_iso_date = NaiveDateTime::new(random_date, random_time);

    random_iso_date.format("%Y-%m-%dT%H:%M:%S.000Z").to_string()
}

#[wasm_bindgen]
pub fn generate_utc_date() -> String {
    let mut rng = rand::thread_rng();

    let start_date = Utc
        .with_ymd_and_hms(
            2000,
            1,
            1,
            rng.gen_range(0..24),
            rng.gen_range(0..60),
            rng.gen_range(0..60),
        )
        .unwrap();

    let end_date = Utc::now();

    let random_seconds = (end_date - start_date).num_seconds();

    let random_duration = Duration::seconds(rng.gen_range(0..random_seconds));

    (start_date + random_duration).to_rfc2822()
}

#[wasm_bindgen]
pub fn generate_image(width: &str, height: Option<String>) -> String {
    let mut url = String::from("https://loremflickr.com/");

    let h = height.clone().unwrap_or((&width).to_string());

    url.push_str(&width);
    url.push('/');
    url.push_str(&h);

    url
}
