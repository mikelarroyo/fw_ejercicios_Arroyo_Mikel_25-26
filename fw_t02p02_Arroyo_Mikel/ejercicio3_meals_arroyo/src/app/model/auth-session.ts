export class AuthSession {
  constructor(
    private userId: number,
    private name: string,
    private loginDate: Date
  ) {}

  get id(): number {
    return this.userId;
  }

  get userName(): string {
    return this.name;
  }
  
  get login(): Date {
    return this.loginDate;
  }
}
