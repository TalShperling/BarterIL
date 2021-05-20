import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../../../entities/item.model';

@Pipe({
  name: 'filterItems'
})
export class FilterItemsPipe implements PipeTransform {
  transform(items: Item[], searchText: string): Item[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return (it.name.toLocaleLowerCase().includes(searchText) ||
        it.description.toLocaleLowerCase().includes(searchText)
      );
    });
  }
}
