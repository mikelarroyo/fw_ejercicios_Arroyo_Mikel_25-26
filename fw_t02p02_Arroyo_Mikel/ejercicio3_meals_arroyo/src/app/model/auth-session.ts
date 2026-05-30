export class AuthSession {

  constructor(
    public userId: number,
    public name: string,
    public loginDate: Date
  ) {}

  getId(): number {
    return this.userId;
  }
}
