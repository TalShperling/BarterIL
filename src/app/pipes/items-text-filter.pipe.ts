import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../../entities/item.model';

@Pipe({
  name: 'itemsTextFilter'
})
export class ItemsTextFilterPipe implements PipeTransform {
  transform(items: Item[], searchText: string): Item[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => it.name.toLocaleLowerCase().includes(searchText)
      || it.description.toLocaleLowerCase().includes(searchText));
  }
}
