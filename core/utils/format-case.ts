import _ from 'lodash'

export type Snake = Lowercase<`${string}_${string}`>
export type Camel = Capitalize<string> | `${Capitalize<string>}${Capitalize<string>}`

export type SnakeToCamel<S extends string> = S extends `${infer Start}_${infer Rest}`
  ? `${Start}${Capitalize<SnakeToCamel<Rest>>}`
  : S
export type CamelToSnake<C extends string> = C extends `${infer Start}${Capitalize<string>}${infer Rest}`
  ? `${Uncapitalize<Start>}_${Uncapitalize<CamelToSnake<Rest>>}`
  : C
export class CaseTransform {
  static snakeToCamel<S extends string>(string: S): SnakeToCamel<S> {
    const capitalize = (str: string) => (str.length === 0 ? '' : str[0].toUpperCase() + str.slice(1))

    const [start, ...rest] = string.split('_')
    return (start + rest.map(capitalize).join('')) as never
  }

  static camelToSnake<C extends string>(string: C): CamelToSnake<C> {
    return string.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase() as never
  }

  static capitalize<S extends string>(string: S): Capitalize<S> {
    return (string[0].toUpperCase() + string.slice(1)) as never
  }
}

export class ObjectTransform {
  static snakeToCamel<O extends object, K extends keyof O>(
    data: O,
  ): { [P in K as P extends Snake ? SnakeToCamel<P> : P]: O[P] } {
    if (Array.isArray(data)) {
      return data.map((item) => this.snakeToCamel(item)) as never
    } else if (typeof data === 'object' && data !== null) {
      if (typeof window !== 'undefined' && (data instanceof Blob || data instanceof File)) {
        return data as never
      }
      const result = _.mapKeys(data, (value, key) => _.camelCase(key)) as any
      for (const prop in result) {
        result[prop] = this.snakeToCamel(result[prop] as object)
      }
      return result
    } else {
      return data as never
    }
  }
  static camelToSnake<O extends object, K extends keyof O>(
    data: O,
  ): { [P in K as P extends string ? CamelToSnake<P> : P]: O[P] } {
    if (Array.isArray(data)) {
      return data.map((item) => this.camelToSnake(item)) as never
    } else if (typeof data === 'object' && data !== null) {
      if (typeof window !== 'undefined' && (data instanceof Blob || data instanceof File)) {
        return data as never
      }

      const result = _.mapKeys(data, (value, key) => CaseTransform.camelToSnake(key)) as any
      for (const prop in result) {
        result[prop] = this.camelToSnake(result[prop] as object)
      }
      return result
    } else {
      return data as never
    }
  }
}

export function toUpperCaseEachWord(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}
