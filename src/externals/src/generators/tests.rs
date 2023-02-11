#[cfg(test)]
mod tests {
    use crate::generators::gen::*;

    #[test]
    fn test_generate_number() {
        assert_eq!(generate_number(12).to_string().len(), 12);
        assert_eq!(generate_number(0).to_string().len(), 8);
    }

    #[test]
    fn test_generate_bool() {
        assert_eq!(generate_bool(1.0), true);
        assert_eq!(generate_bool(0.0), false);
    }

    #[test]
    fn test_generate_image() {
        assert_eq!(
            generate_image("100", None),
            "https://loremflickr.com/100/100"
        );
        assert_eq!(
            generate_image("200", Some("300".to_string())),
            "https://loremflickr.com/200/300"
        );
    }
}
