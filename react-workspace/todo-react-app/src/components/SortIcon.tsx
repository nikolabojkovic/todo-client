import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SortIcon({ sortDirection }: any) {
  return (
    <>
      <FontAwesomeIcon className={ 
        sortDirection === "asc" 
          ? "App__sorting__item__icon-up" 
          : "App__sorting__item__icon-up icon--inactive" } icon={faSortUp} />
      <FontAwesomeIcon className={ 
        sortDirection === "desc" 
          ? "App__sorting__item__icon-down" 
          : "App__sorting__item__icon-down icon--inactive" } icon={faSortDown} />
    </>
  );
}