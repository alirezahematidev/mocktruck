const matchers = {
  date: ["date"],
  array: ["array"],
  object: ["object"],
  boolean: ["boolean"],
  uuid: ["uuid"],
  net: ["email", "url", "password", "ip"],
  name: ["firstName", "lastName", "fullName"],
  integer: ["number", "float", "bigInt"],
  lorem: ["word", "sentence", "paragraph", "paragraphs"],
} as const;

export { matchers };
