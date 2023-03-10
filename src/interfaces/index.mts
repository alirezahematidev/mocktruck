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

  export type TypeOptions = {
    optional?: boolean;
    nullable?: boolean;
  };

  export interface TName extends TypeOptions {
    readonly type: "firstName" | "lastName" | "fullName";
    gender?: "male" | "female";
  }

  export interface TDate extends TypeOptions {
    readonly type: "date";
    format?: "iso" | "utc";
  }

  export interface TInternet extends TypeOptions {
    readonly type: "email" | "password" | "url" | "ip";
  }

  export interface TLorem extends TypeOptions {
    readonly type: "word" | "sentence" | "paragraph" | "paragraphs";
    case?: "uppercase" | "lowercase" | "capitalize";
  }

  export interface TInteger extends TypeOptions {
    readonly type: "bigInt" | "float" | "number";
    length?: number;
  }

  export interface TUuid extends TypeOptions {
    readonly type: "uuid";
  }

  export interface TBool extends TypeOptions {
    readonly type: "boolean";
  }

  export interface TArray extends TypeOptions {
    readonly type: "array";
    schema: Schema;
    autoGenerateId?: AutoGenerateIdOptions;
    count?: number;
  }

  export interface TStruct extends TypeOptions {
    readonly type: "object";
    schema: Schema;
  }

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
    | TName
    | TDate
    | TLorem
    | TInternet
    | TInteger
    | TBool
    | TUuid
    | TArray
    | TStruct;

  export type ConfigModel = {
    name: string;
    schema: Schema;
    options?: Options;
  };

  export type Schema = {
    [p: string]: SchemaOptions;
  };

  export interface Configuration {
    models: ConfigModel | Array<ConfigModel>;
    globalOptions?: GlobalOptions;
    plugins?: Plugin[];
  }

  export interface ConfigurationOptions extends Omit<Configuration, "models"> {}
}

export default Truck;
