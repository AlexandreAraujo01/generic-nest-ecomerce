import { WatchedList } from '@/core/entities/watched-list';
import { Address } from './address';

export class AddressesWatchedList extends WatchedList<Address> {
  compare(A: Address, B: Address): boolean {
    if (A.uniqueAddressProp === B.uniqueAddressProp) {
      return true;
    }

    return false;
  }
}
