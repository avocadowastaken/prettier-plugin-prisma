extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn format(input: &str) -> String {
    datamodel::ast::reformat::Reformatter::new(input).reformat_to_string()
}
