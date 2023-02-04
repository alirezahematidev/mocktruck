#[cfg(test)]
mod tests {
    use crate::helpers::matchers::*;

    #[test]
    fn test_is_number() {
        assert_eq!(is_number("number"), true);
        assert_eq!(is_number("?number"), true);
        assert_eq!(is_number("NUMBER"), true);
        assert_eq!(is_number("char"), false);
        assert_eq!(is_number("number("), false);
    }

    #[test]
    fn test_is_number_with_len() {
        assert_eq!(is_number_with_len("number(52)"), true);
        assert_eq!(is_number_with_len("number( 52)"), true);
        assert_eq!(is_number_with_len("number(52 )"), true);
        assert_eq!(is_number_with_len("number(ab)"), false);
        assert_eq!(is_number_with_len("number"), false);
    }

    #[test]
    fn test_is_number_err_with_len() {
        assert_eq!(is_number_err_with_len("number(ab)"), true);
        assert_eq!(is_number_err_with_len("number( ab)"), true);
        assert_eq!(is_number_err_with_len("number(ab )"), true);
        assert_eq!(is_number_err_with_len("number(25)"), false);
        assert_eq!(is_number_err_with_len("number"), false);
    }

    #[test]
    fn test_is_char() {
        assert_eq!(is_char("char"), true);
        assert_eq!(is_char("CHAR"), true);
        assert_eq!(is_char("?char"), true);
        assert_eq!(is_char("number"), false);
        assert_eq!(is_char("char("), false);
    }

    #[test]
    fn test_is_char_with_len() {
        assert_eq!(is_char_with_len("char(52)"), true);
        assert_eq!(is_char_with_len("char(25,lowercase)"), true);
        assert_eq!(is_char_with_len("char(25 ,lowercase)"), true);
        assert_eq!(is_char_with_len("char(25, lowercase)"), true);
        assert_eq!(is_char_with_len("char(LOWERCASE)"), true);
    }

    #[test]
    fn test_is_bool() {
        assert_eq!(is_bool("bool"), true);
        assert_eq!(is_bool("?bool"), true);
        assert_eq!(is_bool("BOOL"), true);
        assert_eq!(is_bool("boolean"), true);
        assert_eq!(is_bool("bool("), false);
    }

    #[test]
    fn test_is_bool_with_freq() {
        assert_eq!(is_bool_with_freq("bool(0)"), true);
        assert_eq!(is_bool_with_freq("?bool(1)"), true);
        assert_eq!(is_bool_with_freq("BOOL(1)"), true);
        assert_eq!(is_bool_with_freq("boolean(0.5)"), true);
        assert_eq!(is_bool_with_freq("bool(.5)"), false);
        assert_eq!(is_bool_with_freq("bool(1.2)"), false);
        assert_eq!(is_bool_with_freq("bool"), false);
    }

    #[test]
    fn test_is_bool_err_with_freq() {
        assert_eq!(is_bool_err_with_freq("bool(ab)"), true);
        assert_eq!(is_bool_err_with_freq("?bool(ab)"), true);
        assert_eq!(is_bool_err_with_freq("BOOL(ab)"), true);
        assert_eq!(is_bool_err_with_freq("boolean(0.5)"), false);
        assert_eq!(is_bool_err_with_freq("bool"), false);
    }

    #[test]
    fn test_is_date() {
        assert_eq!(is_date("date"), true);
        assert_eq!(is_date("?date"), true);
        assert_eq!(is_date("DATE"), true);
        assert_eq!(is_date("date("), false);
    }

    #[test]
    fn test_is_date_with_format() {
        assert_eq!(is_date_with_format("date(iso)"), true);
        assert_eq!(is_date_with_format("?date(ISO)"), true);
        assert_eq!(is_date_with_format("DATE(utc)"), true);
        assert_eq!(is_date_with_format("date("), false);
        assert_eq!(is_date_with_format("date"), false);
    }

    #[test]
    fn test_is_uuid() {
        assert_eq!(is_uuid("uuid"), true);
        assert_eq!(is_uuid("?uuid"), true);
        assert_eq!(is_uuid("UUID"), true);
        assert_eq!(is_uuid("uuid("), false);
    }

    #[test]
    fn test_is_url() {
        assert_eq!(is_url("url"), true);
        assert_eq!(is_url("?url"), true);
        assert_eq!(is_url("URL"), true);
        assert_eq!(is_url("url("), false);
    }

    #[test]
    fn test_is_email() {
        assert_eq!(is_email("email"), true);
        assert_eq!(is_email("?email"), true);
        assert_eq!(is_email("EMAIL"), true);
        assert_eq!(is_email("email("), false);
    }
    #[test]
    fn test_is_image() {
        assert_eq!(is_image("image(200)"), true);
        assert_eq!(is_image("?image(200)"), true);
        assert_eq!(is_image("IMAGE(200,300)"), true);
        assert_eq!(is_image("image(200 ,300)"), true);
        assert_eq!(is_image("image(200, 300)"), true);
        assert_eq!(is_image("image()"), false);
        assert_eq!(is_image("image"), false);
    }
}
