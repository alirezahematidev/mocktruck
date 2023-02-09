#[cfg(test)]
mod tests {
    use crate::extractors::matchers::*;

    #[test]
    fn test_number_arguments_extract() {
        assert_eq!(number_arguments_extract("number(25)"), Some(25));
        assert_eq!(number_arguments_extract("number(421)"), Some(421));
        assert_eq!(number_arguments_extract("number(0)"), Some(0));
        assert_eq!(number_arguments_extract("number()"), None);
        assert_eq!(number_arguments_extract("number(ab)"), None);
    }

    #[test]
    fn test_char_arguments_extract() {
        assert_eq!(
            char_arguments_extract("char(25 , uppercase)"),
            Some(Char {
                length: Some(25),
                style: Some("uppercase".to_string()),
            })
        );
        assert_eq!(
            char_arguments_extract("char(25)"),
            Some(Char {
                length: Some(25),
                style: None,
            })
        );

        assert_eq!(
            char_arguments_extract("char(uppercase)"),
            Some(Char {
                length: None,
                style: Some("uppercase".to_string()),
            })
        );

        assert_eq!(
            char_arguments_extract("char(LOWERCASE)"),
            Some(Char {
                length: None,
                style: Some("lowercase".to_string()),
            })
        );

        assert_eq!(
            char_arguments_extract("char(uppercase)"),
            Some(Char {
                length: None,
                style: Some("uppercase".to_string()),
            })
        );

        assert_eq!(char_arguments_extract("char()"), None);
    }

    #[test]
    fn test_bool_arguments_extract() {
        assert_eq!(bool_arguments_extract("bool(0)"), Some(0.0));
        assert_eq!(bool_arguments_extract("boolean(0.42)"), Some(0.42));
        assert_eq!(bool_arguments_extract("bool(0.4)"), Some(0.4));
        assert_eq!(bool_arguments_extract("bool(1)"), Some(1.0));
        assert_eq!(bool_arguments_extract("boolean( 0.6)"), Some(0.6));
        assert_eq!(bool_arguments_extract("bool(1.2)"), None);
        assert_eq!(bool_arguments_extract("bool(-1)"), None);
        assert_eq!(bool_arguments_extract("bool(ab)"), None);
    }

    #[test]
    fn test_date_arguments_extract() {
        assert_eq!(
            date_arguments_extract("date(iso )"),
            Some("iso".to_string())
        );
        assert_eq!(
            date_arguments_extract("date( utc)"),
            Some("utc".to_string())
        );
        assert_eq!(date_arguments_extract("date(ISO)"), Some("iso".to_string()));
        assert_eq!(date_arguments_extract("date()"), None);
        assert_eq!(date_arguments_extract("date(test)"), None);
    }

    #[test]
    fn test_image_arguments_extract() {
        assert_eq!(
            image_arguments_extract("image(200 )"),
            Some(Image {
                width: Some(200),
                height: Some(200),
            })
        );

        assert_eq!(
            image_arguments_extract("image(200 , 300)"),
            Some(Image {
                width: Some(200),
                height: Some(300),
            })
        );

        assert_eq!(image_arguments_extract("image()"), None);
        assert_eq!(image_arguments_extract("image(a)"), None);
    }
}
