import { useEffect, useState } from "react";

import { SortDirection, SortType } from "../../models";
import { SortIcon } from "./SortIcon";

type Props = {
  column: string,
  text: string,
  disabled: boolean,
  active: boolean,
  sortType: SortType;
  sortDirection: SortDirection,
  onClick: (column: string, direction: SortDirection) => void
};

export function SortButton({ column, text, disabled, active, sortType, sortDirection, onClick: handleSort }: Props) {

  const [direction, setDirection] = useState(sortDirection);
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    setDirection(sortDirection);
  }, [sortDirection]);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return(
    <div 
      data-testid={column + "-sort-button-direction-" + direction}
      className={"App__sorting__item" + (disabled ? " App__sorting__item--disabled" : "") + (isActive ? " App__sorting__item--active" : "")} 
      onClick={() => {
        if (disabled) {
          return;
        }

        const newDirectionState = sortType === SortType.direction 
          ? (direction !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc) 
          : SortDirection.None;
        setDirection(newDirectionState);
        setIsActive(sortType === SortType.noDirection);
        
        handleSort(column, newDirectionState);
      }}
    >
      <span>{text}</span> 
      { sortType === SortType.direction  &&
        <span className="App__sorting__item__icon">
          <SortIcon sortDirection={direction}/>
        </span>        
      }
    </div>
  );
}