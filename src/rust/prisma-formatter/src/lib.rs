use datamodel::ast::reformat::Reformatter;

pub fn format(input: &str) -> String {
    Reformatter::new(input).reformat_to_string()
}
