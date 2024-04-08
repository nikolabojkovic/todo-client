import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SortDirection } from '../../models';

type Props = {
  sortDirection: SortDirection,
};

export function SortIcon({ sortDirection }: Props) {
  return (
    <>
      <FontAwesomeIcon className={ 
        sortDirection === SortDirection.Asc 
          ? "App__sorting__item__icon-up" 
          : "App__sorting__item__icon-up icon--inactive" } icon={faSortUp} />
      <FontAwesomeIcon className={ 
        sortDirection === SortDirection.Desc 
          ? "App__sorting__item__icon-down" 
          : "App__sorting__item__icon-down icon--inactive" } icon={faSortDown} />
    </>
  );
}