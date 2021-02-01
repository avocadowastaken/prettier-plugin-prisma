extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

use datamodel::ast::reformat::Reformatter;

#[wasm_bindgen]
pub fn format(input: &str) -> String {
    Reformatter::new(input).reformat_to_string()
}
