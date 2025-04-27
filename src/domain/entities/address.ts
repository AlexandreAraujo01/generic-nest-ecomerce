import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Entity } from '../../core/entities/entity';

export interface AddressProps {
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
  state: string;
}

export class Address extends Entity<AddressProps> {
  constructor(props: AddressProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get uniqueAddressProp(): string {
    return `${this.street}-${this.number}-${this.zipCode}`;
  }

  get street(): string {
    return this.props.street;
  }

  set street(value: string) {
    this.street = value;
  }

  get number(): string {
    return this.props.number;
  }

  set number(value: string) {
    this.number = value;
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  set zipCode(value: string) {
    this.zipCode = value;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  set neighborhood(value: string) {
    this.neighborhood = value;
  }

  get state(): string {
    return this.props.state;
  }

  set state(value: string) {
    this.state = value;
  }
}
