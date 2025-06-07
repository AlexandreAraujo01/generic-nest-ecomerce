import { User } from '@/domain/entities/user';

export const userPresenter = (user: User) => {
  return {
    name: user.name,
    email: user.email,
    addresses: user.addresses,
    phone: user.phone,
    role: user.role,
  };
};
