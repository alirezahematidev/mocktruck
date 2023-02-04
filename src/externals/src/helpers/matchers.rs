use lazy_static::lazy_static;
use regex::Regex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn is_number(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?number$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_number_with_len(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?number\((\s*)?\d+(\s*)?\)$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_number_err_with_len(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?number\((\s*)?\D+(\s*)?\)$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_char(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?char$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_char_with_len(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?char\((((\s*)?\d+(\s*)?|((\s*)?lower|upper)case(\s*)?)|((\s*)?\d+(\s+)?,(\s+)?((\s*)?lower|upper)case)(\s*)?)\)$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_bool(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?(bool(ean)?)$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_bool_with_freq(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex =
            Regex::new(r"(?i)^(\?)?(bool(ean)?)\(([0]{1}(\.\d+)?|1)\)?$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_bool_err_with_freq(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex =
            Regex::new(r"(?i)^(\?)?(bool(ean)?)\(([a-z]+(\.\D+)?|[a-z])\)?$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_date(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?date$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_date_with_format(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?date\((iso|utc)\)$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_uuid(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?uuid$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_url(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?url$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_email(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?email$").unwrap();
    }

    RE.is_match(text)
}

#[wasm_bindgen]
pub fn is_image(text: &str) -> bool {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?i)^(\?)?image\(\d+((\s+)?,(\s+)?\d+)?\)$").unwrap();
    }

    RE.is_match(text)
}
