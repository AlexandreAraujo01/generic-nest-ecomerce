import { beforeEach, describe, expect, it } from 'vitest';
import { NumberWatchedList } from './number-watched-list';

let numberWatchedList: NumberWatchedList;

describe('Testing watched-list class', () => {
  beforeEach(() => {
    const initialNumbers = [1, 2, 3];
    numberWatchedList = new NumberWatchedList(initialNumbers);
  });

  it('should be able to add new item', () => {
    numberWatchedList.addItem(4);
    expect(numberWatchedList.currentItems.length).toEqual(4);
    expect(numberWatchedList.currentItems).toEqual([1, 2, 3, 4]);
    expect(numberWatchedList.newItems).toEqual([4]);
  });

  it('should not be able to add duplicated Item', () => {
    numberWatchedList.addItem(3);
    expect(numberWatchedList.currentItems.length).toEqual(3);
    expect(numberWatchedList.currentItems).toEqual([1, 2, 3]);
  });

  it('should be able to remove an item', () => {
    numberWatchedList.addItem(4);
    numberWatchedList.removeItem(4);
    expect(numberWatchedList.currentItems.length).toEqual(3);
    expect(numberWatchedList.currentItems).toEqual([1, 2, 3]);
    expect(numberWatchedList.newItems).toEqual([]);
  });

  it('should not be able to add an item in the news if it was already in the initial list', () => {
    numberWatchedList.removeItem(2);
    numberWatchedList.addItem(2);
    expect(numberWatchedList.newItems).toEqual([]);
  });

  it('should re-add item to newItems if it was added and removed before', () => {
    numberWatchedList.addItem(5);
    numberWatchedList.removeItem(5);
    numberWatchedList.addItem(5);
    expect(numberWatchedList.newItems).toEqual([5]);
  });

  it('should add item to removedItems if removed', () => {
    numberWatchedList.removeItem(2);
    expect(numberWatchedList.removedItems).toEqual([2]);
  });

  it('should not remove item that is not in the list', () => {
    numberWatchedList.removeItem(10);
    expect(numberWatchedList.currentItems).toEqual([1, 2, 3]);
    expect(numberWatchedList.removedItems).toEqual([]);
  });
});
