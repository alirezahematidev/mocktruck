#[cfg(test)]
mod tests {
    use crate::validators::formatters::*;

    #[test]
    fn test_is_uuid_format() {
        assert_eq!(is_uuid_format("0accd8a8-a3ed-4a13-8e49-abfdee5d657c"), true);
        assert_eq!(is_uuid_format("0accd8a8-a3ed-4a13-8e49-abdee5d657c"), false);
    }

    #[test]
    fn test_is_url_format() {
        assert_eq!(is_url_format("http://google.com"), true);
        assert_eq!(is_url_format("google"), false);
    }

    #[test]
    fn test_is_email_format() {
        assert_eq!(is_email_format("alireza@gmail.com"), true);
        assert_eq!(is_email_format("alireza.com"), false);
    }

    #[test]
    fn test_is_iso_date_format() {
        assert_eq!(is_iso_date_format("2023-02-04T14:50:10.526Z"), true);
        assert_eq!(is_iso_date_format("2023-02-04T14:50:10.526"), false);
    }

    #[test]
    fn test_is_utc_date_format() {
        assert_eq!(is_utc_date_format("Sat, 04 Feb 2023 14:50:34 GMT"), true);
        assert_eq!(is_utc_date_format("Sat, 04 Feb 2023 14:50:34"), false);
    }
}
