import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../../entities/item.model';

@Pipe({
  name: 'itemsCategoryFilter'
})
export class ItemsCategoryFilterPipe implements PipeTransform {
  transform(items: Item[], categoryIds: string[]): Item[] {
    if (!items) {
      return [];
    } else if (!categoryIds || !categoryIds.length) {
      return items;
    }

    return items.filter(it => it.categories.find(itemCategory =>
      categoryIds.includes(itemCategory.id)));
  }
}
