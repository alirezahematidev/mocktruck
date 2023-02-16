export namespace Truck {
  type NameTypeOptions = "firstname" | "lastname" | "fullname";

  type DateTypeOptions = "date";

  type InternetTypeOptions = "email" | "domain";

  type LoremTypeOptions = "word" | "sentence" | "paragraph" | "paragraphs";

  type UuidTypeOptions = "uuid";

  type DigitTypeOptions = "digits" | "bigint";

  type BoolTypeOptions = "boolean";

  type CharTypeOptions = NameTypeOptions | LoremTypeOptions;

  type ArrayTypeOptions = "array";

  type StructTypeOptions = "object";

  export type SharedTypeOptions = {
    optional?: boolean;
    nullable?: boolean;
  };

  export type AutoGenerateIdOptions = {
    field?: string;
    strategy?: "uuid" | "autoincrement";
  };

  export type ListOptions = {
    count?: number;
    autoGenerateId?: AutoGenerateIdOptions;
  };

  interface GlobalOptions {
    generateEnumsAsType?: boolean;
    generateSeparateSchemaType?: boolean;
    defaultListCount?: number;
    requiredFields?: boolean;
    nullableFields?: boolean;
  }

  interface Options extends GlobalOptions {
    listOptions?: ListOptions;
  }

  type SchemaOptions =
    | TChar
    | TArray
    | TStruct
    | TDigit
    | TUuid
    | TInternet
    | TDate
    | TBool;

  export type ConfigModel = {
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

  export interface TChar extends SharedTypeOptions {
    readonly type: CharTypeOptions;
    case?: "uppercase" | "lowercase" | "capitalize";
  }

  export interface TArray extends SharedTypeOptions {
    readonly type: ArrayTypeOptions;
    schema: Schema;
    autoGenerateId?: AutoGenerateIdOptions;
    count?: number;
  }

  export interface TStruct extends SharedTypeOptions {
    readonly type: StructTypeOptions;
    schema: Schema;
  }

  export interface TDigit extends SharedTypeOptions {
    readonly type: DigitTypeOptions;
    length?: number;
  }
  export interface TUuid extends SharedTypeOptions {
    readonly type: UuidTypeOptions;
  }
  export interface TInternet extends SharedTypeOptions {
    readonly type: InternetTypeOptions;
  }
  export interface TBool extends SharedTypeOptions {
    readonly type: BoolTypeOptions;
    frequency?: number;
  }
  export interface TDate extends SharedTypeOptions {
    readonly type: DateTypeOptions;
    format?: "ISO" | "UTC";
  }

  export interface Configuration {
    models: ConfigModel | Array<ConfigModel>;
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
      options: {
        listOptions: {
          count: 5,
          autoGenerateId: {
            field: "userId",
            strategy: "autoincrement",
          },
        },
      },
      schema: {
        email: {
          type: "email",
        },
        firstname: {
          type: "firstname",
        },
        employees: {
          type: "array",
          autoGenerateId: {
            field: "employeeId",
            strategy: "autoincrement",
          },
          schema: {
            name: {
              type: "firstname",
            },
          },
        },
      },
    },
    {
      name: "posts",
      options: {
        listOptions: {
          count: 5,
          autoGenerateId: {
            field: "userId",
            strategy: "autoincrement",
          },
        },
      },
      schema: {
        email: {
          type: "email",
        },
        firstname: {
          type: "firstname",
        },
      },
    },
  ],
};
