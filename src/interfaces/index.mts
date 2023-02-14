export namespace Truck {
  type NameTypeOptions = "firstname" | "lastname" | "fullname";

  type DateTypeOptions = "date";

  type InternetTypeOptions = "email" | "domain";

  type LoremTypeOptions = "word" | "sentence" | "paragraph" | "paragraphs";

  type UuidTypeOptions = "uuid";

  type NumberTypeOptions = "digits";

  type BoolTypeOptions = "boolean";

  type CharTypeOptions = NameTypeOptions | LoremTypeOptions;

  type ArrayTypeOptions = "array";

  type ObjectTypeOptions = "object";

  type SharedTypeOptions = {
    required?: boolean;
    nullable?: boolean;
  };

  export type AutoGenerateIdOptions = {
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
    defaultListCount?: number;
    requiredFields?: boolean;
    nullableFields?: boolean;
  }

  interface Options extends GlobalOptions {
    listOptions?: ListOptions;
  }

  type SchemaOptions =
    | CharSchema
    | ArraySchema
    | ObjectSchema
    | NumberSchema
    | UuidSchema
    | InternetSchema
    | DateSchema
    | BoolSchema;

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

  export interface CharSchema extends SharedTypeOptions {
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
  export interface BoolSchema extends SharedTypeOptions {
    readonly type: BoolTypeOptions;
    frequency?: number;
  }
  export interface DateSchema extends SharedTypeOptions {
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
  models: {
    name: "users",
    options: {
      listOptions: {
        count: 10,
        autoGenerateId: {
          field: "userId",
          strategy: "autoincrement",
        },
      },
    },
    schema: {
      fullname: {
        type: "fullname",
        case: "lowercase",
      },
      email: {
        type: "email",
        required: true,
      },
      age: {
        type: "digits",
        length: 2,
      },
      bio: {
        type: "paragraph",
        nullable: true,
      },
      createDate: {
        type: "date",
      },
      publishedDate: {
        type: "date",
        format: "UTC",
      },
    },
  },
};
