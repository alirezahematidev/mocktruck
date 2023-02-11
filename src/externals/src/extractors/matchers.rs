use lazy_static::lazy_static;
use regex::Regex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn number_arguments_extract(text: &str) -> Option<i32> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?P<len>\d+)").unwrap();
    }

    match RE.captures(text) {
        Some(caps) => caps.name("len").map(|m| m.as_str().parse().unwrap()),
        None => None,
    }
}

// #[wasm_bindgen]
// #[derive(Debug, PartialEq)]
// pub struct Char {
//     pub(crate) length: Option<i16>,
//     pub(crate) style: Option<String>,
// }

// #[wasm_bindgen]
// impl Char {
//     #[wasm_bindgen(constructor)]
//     pub fn new(length: Option<i16>, style: Option<String>) -> Char {
//         Char { length, style }
//     }

//     pub fn get_length(&self) -> Option<i16> {
//         self.length.clone()
//     }
//     pub fn get_style(&self) -> Option<String> {
//         self.style.clone()
//     }
// }

#[wasm_bindgen]
#[derive(Debug, PartialEq)]
pub struct CharParams {
    pub(crate) length: i32,
    pub(crate) case: String,
}

#[wasm_bindgen]
pub fn char_arguments_extract(text: &str) -> Option<CharParams> {
    lazy_static! {
        static ref RE: Regex =
            Regex::new(r"(?i)^char\((?P<len>\d+)?,?(?P<case>(upper|lower)case)?\)$").unwrap();
    }

    match RE.captures(text) {
        Some(caps) => {
            let length = caps.name("len")?.as_str().parse().ok()?;
            let case = caps.name("case")?.as_str().to_owned();
            Some(CharParams { length, case })
        }
        None => None,
    }

    // if RE.is_match(text) {
    //     let length = RE
    //         .captures(text)
    //         .unwrap()
    //         .name("length")
    //         .map_or("0", |x| x.as_str().trim())
    //         .parse::<i16>()
    //         .unwrap_or(0);

    //     let style = RE
    //         .captures(text)
    //         .unwrap()
    //         .name("style")
    //         .map_or("", |x| x.as_str().trim())
    //         .to_string()
    //         .to_lowercase();

    //     let valid_length = if length != 0 { Some(length) } else { None };
    //     let valid_style = if !style.is_empty() { Some(style) } else { None };

    //     if valid_length == None && valid_style == None {
    //         None
    //     } else {
    //         Some(Char::new(valid_length, valid_style))
    //     }
    // } else {
    //     None
    // }
}

#[wasm_bindgen]
pub fn bool_arguments_extract(text: &str) -> Option<f64> {
    lazy_static! {
        static ref RE: Regex = Regex::new(
            r"(?i)^(bool(ean)?)\(((\s+)?(?P<freq>[0]{1}(\.\d+)?(\s+)?|(\s+)?1))(\s+)?\)$"
        )
        .unwrap();
    }

    if RE.is_match(text) {
        let freq = RE
            .captures(text)
            .unwrap()
            .name("freq")
            .map_or("0.0", |x| x.as_str().trim())
            .parse::<f64>()
            .unwrap_or(0.0);

        Some(freq)
    } else {
        None
    }
}

#[wasm_bindgen]
pub fn date_arguments_extract(text: &str) -> Option<String> {
    lazy_static! {
        static ref RE: Regex =
            Regex::new(r"(?i)^date\((\s+)?(?P<format>iso|utc)(\s+)?\)$").unwrap();
    }

    if RE.is_match(text) {
        let format = RE
            .captures(text)
            .unwrap()
            .name("format")
            .map_or("iso", |x| x.as_str().trim())
            .to_string()
            .to_lowercase();

        Some(format)
    } else {
        None
    }
}

#[wasm_bindgen]
#[derive(Debug, PartialEq)]
pub struct Image {
    pub(crate) width: Option<i16>,
    pub(crate) height: Option<i16>,
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(constructor)]
    pub fn new(width: Option<i16>, height: Option<i16>) -> Image {
        Image { width, height }
    }

    pub fn get_width(&self) -> Option<i16> {
        self.width.clone()
    }
    pub fn get_height(&self) -> Option<i16> {
        self.height.clone()
    }
}

#[wasm_bindgen]
pub fn image_arguments_extract(text: &str) -> Option<Image> {
    lazy_static! {
        static ref RE: Regex = Regex::new(
            r"(?i)^image\(((\s+)?(?P<width>\d+)(\s+)?(,(\s+)?(?P<height>\d+)(\s+)?)*)\)$"
        )
        .unwrap();
    }

    if RE.is_match(text) {
        let width = RE
            .captures(text)
            .unwrap()
            .name("width")
            .map_or("0", |x| x.as_str().trim())
            .parse::<i16>()
            .unwrap_or(0);

        let height = RE
            .captures(text)
            .unwrap()
            .name("height")
            .map_or("0", |x| x.as_str().trim())
            .parse::<i16>()
            .unwrap_or(0);

        let valid_width = if width != 0 { Some(width) } else { None };
        let valid_height = if height != 0 {
            Some(height)
        } else {
            Some(width)
        };

        if valid_width == None && valid_height == None {
            None
        } else {
            Some(Image::new(valid_width, valid_height))
        }
    } else {
        None
    }
}
