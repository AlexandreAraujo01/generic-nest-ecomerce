import { faker } from '@faker-js/faker';
import { Address, AddressProps } from '@/domain/entities/address';

export function MakeAdressFactory(
  addressProps: Partial<AddressProps>,
): Address {
  const address = new Address({
    street: faker.location.streetAddress(),
    state: faker.location.state(),
    neighborhood: 'fake neighborhood',
    zipCode: faker.location.zipCode(),
    number: faker.number.int().toString(),
    ...addressProps,
  });
  return address;
}
