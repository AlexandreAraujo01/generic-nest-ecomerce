import { WatchedList } from './watched-list';

export class NumberWatchedList extends WatchedList<number> {
  compare(A: number, B: number): boolean {
    if (A === B) {
      return true;
    }
    return false;
  }
}
