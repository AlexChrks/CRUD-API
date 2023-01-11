export class User {
  public id?: string
  public name: string | undefined
  public age: number | undefined
  public hobby: Array<string> | [] | undefined

  constructor(
    name?: string,
    age?: number,
    hobby?: string[] | [],
    id?: string
  ) {
    this.name = name
    this.age = age
    this.id = id
    this.hobby = hobby
  }
}

