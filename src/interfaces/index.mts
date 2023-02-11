export namespace Truck {
  type NameTypeOptions = "firstname" | "lastname" | "fullname";

  type DateTypeOptions = "date";

  type InternetTypeOptions = "email" | "domain";

  type LoremTypeOptions = "word" | "sentence" | "paragraph";

  type UuidTypeOptions = "uuid";

  type NumberTypeOptions = "digits";

  type CharTypeOptions = NameTypeOptions | LoremTypeOptions;

  type ArrayTypeOptions = "array";

  type ObjectTypeOptions = "object";

  type SharedTypeOptions = {
    required?: boolean;
    nullable?: boolean;
  };

  type AutoGenerateIdOptions = {
    field?: string;
    strategy?: "uuid" | "autoincrement";
  };

  type ListOptions = {
    count?: number;
    autoGenerateId?: AutoGenerateIdOptions;
  };

  interface GlobalOptions {
    generateEnumsAsType?: boolean;
    generateSeparateSchemaType?: boolean;
    requiredFields?: boolean;
    nullableFields?: boolean;
  }

  interface Options extends GlobalOptions {
    listOptions?: ListOptions;
  }

  type SchemaOptions =
    | NameSchema
    | ArraySchema
    | ObjectSchema
    | NumberSchema
    | UuidSchema
    | InternetSchema
    | DateSchema;

  type ConfigModel = {
    name: string;
    schema: Schema;
    options?: Options;
  };

  type RequestOptions = {
    useAxios?: boolean;
    delayedTime?: number;
    methods?: string[];
    port?: number;
  };

  export interface Schema {
    [property: string]: SchemaOptions;
  }

  export interface NameSchema extends SharedTypeOptions {
    readonly type: CharTypeOptions;
    case?: "uppercase" | "lowercase" | "capitalize";
  }

  export interface ArraySchema extends SharedTypeOptions {
    readonly type: ArrayTypeOptions;
    schema: Schema;
    autoGenerateId?: AutoGenerateIdOptions;
    count?: number;
  }

  export interface ObjectSchema extends SharedTypeOptions {
    readonly type: ObjectTypeOptions;
    schema: Schema;
  }

  export interface NumberSchema extends SharedTypeOptions {
    readonly type: NumberTypeOptions;
    length?: number;
  }
  export interface UuidSchema extends SharedTypeOptions {
    readonly type: UuidTypeOptions;
  }
  export interface InternetSchema extends SharedTypeOptions {
    readonly type: InternetTypeOptions;
  }
  export interface DateSchema extends SharedTypeOptions {
    readonly type: DateTypeOptions;
    format?: "ISO" | "UTC";
  }

  export interface Configuration {
    models: Array<ConfigModel>;
    globalOptions?: GlobalOptions;
    requests?: RequestOptions;
    output?: string;
    entry?: string;
    ignoreTypes?: boolean;
  }
}

export const configs: Truck.Configuration = {
  models: [
    {
      name: "users",
      schema: {
        firstname: { type: "firstname", case: "lowercase" },
        lastname: {
          type: "lastname",
        },
        email: {
          type: "email",
        },
        bio: {
          type: "paragraph",
        },
        createDate: {
          type: "date",
        },
        publishedDate: {
          type: "date",
          format: "UTC",
        },
        location: {
          type: "object",
          schema: {
            city: {
              type: "word",
            },
            country: {
              type: "word",
            },
          },
        },
      },
    },
  ],
};
