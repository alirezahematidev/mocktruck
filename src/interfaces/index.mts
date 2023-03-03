declare namespace Truck {
  enum TypeNotation {
    STRING = "string",
    NUMBER = "number",
    BOOL = "boolean",
    BIGINT = "bigint",
    UNKNOWN = "unknown",
    OBJECT = "object",
    ARRAY = "array",
    NULL = "null",
    UNDEFINED = "undefined",
  }

  type IPrimitive = string | number | bigint | boolean;

  type IObject = Record<string, IPrimitive>;

  type IArray = IObject[];

  type IComplex = IPrimitive | IObject | IArray;

  type IReturnArray = [string, IArray];

  type IReturnPrimitive = [string, IPrimitive];

  type IReturnObject = [string, IObject];

  type IMapping = [string, IComplex];

  type IReturnEntries = Record<string, IComplex>;

  type IMock = IReturnEntries | IReturnEntries[];

  type PluginEnteries = IMock;

  type Plugin = (data: PluginEnteries) => PluginEnteries;

  type TypeReference = {
    [ref: string]: string;
  };

  type ITypeRecord = {
    infer: string;
    reference: Map<string, string>;
  };

  type IType = Record<string, ITypeRecord>;

  type IOptions = Record<string, Truck.Options>;

  type TypedProperty = {
    property: string;
    notation: TypeNotation;
  };

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

  export type FileOptions = {
    data: string;
    type?: string;
  };

  export interface GlobalOptions {
    enumsAsType?: boolean;
    distinctTypes?: boolean;
    defaultListCount?: number;
    requiredFields?: boolean;
    nullableFields?: boolean;
    clean?: boolean;
    useTypes?: boolean;
  }

  export interface Options extends Omit<GlobalOptions, "clean"> {
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

  export type Schema = {
    [property: string]: SchemaOptions;
  };

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
    plugins?: Plugin[];
  }

  export interface ConfigurationOptions extends Omit<Configuration, "models"> {}
}

export default Truck;
