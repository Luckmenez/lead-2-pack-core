export abstract class BaseEntity {
  protected constructor(public readonly id: string) {}

  public equals(other: BaseEntity): boolean {
    if (other == null || other === undefined) {
      return false;
    }

    if (!(other instanceof this.constructor)) {
      return false;
    }

    return this.id === other.id;
  }
}
