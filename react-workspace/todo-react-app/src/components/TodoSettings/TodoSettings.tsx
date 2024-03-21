import { useState } from "react";
import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { PaginationSettings } from "./PaginationSettings/PaginationSettings";
import { SearchSettings } from "./SearchSettings/SearchSettings";

export function Settings() {
  
  const [paginationEnabled, setPaginationSwitch] = useState(true);
  
  return (
    <div className='App__settings'>
      <GeneralSettings {...{paginationSwitch: paginationEnabled, onPaginationSwitch: setPaginationSwitch}}></GeneralSettings>
      <SearchSettings></SearchSettings>
      <PaginationSettings isDisabled={!paginationEnabled}></PaginationSettings>
    </div>
  );
}