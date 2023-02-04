use lazy_static::lazy_static;
use regex::Regex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn is_uuid_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(
            r"(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$"
        )
        .unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_url_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(
            r"^(?:http(s)?://)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#\[\]@!\$&'\(\)\*\+,;=.]+$"
        )
        .unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_email_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex =
            Regex::new(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:gmail|yahoo)\.com$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_iso_date_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_utc_date_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"\w+, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT").unwrap();
    }

    RE.is_match(text)
}
