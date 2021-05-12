import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../../../entities/user.model';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {
  transform(users: User[], searchText: string): User[] {
    if (!users) {
      return [];
    }
    if (!searchText) {
      return users;
    }
    searchText = searchText.toLocaleLowerCase();

    return users.filter(it => {
      return (it.firstName.toLocaleLowerCase().includes(searchText) ||
        it.lastName.toLocaleLowerCase().includes(searchText)
      );
    });
  }
}
