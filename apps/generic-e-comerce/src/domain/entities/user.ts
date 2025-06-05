import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { AddressesWatchedList } from './address-watched-list';

export interface UserProps {
  name: string;
  email: string;
  password: string;
  addresses: AddressesWatchedList;
  phone: string;
  role: string;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
  }

  get password(): string {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  get addresses() {
    return this.props.addresses;
  }

  get phone(): string {
    return this.props.phone;
  }

  set phone(value: string) {
    this.props.phone = value;
  }

  get role(): string {
    return this.props.role;
  }
}
