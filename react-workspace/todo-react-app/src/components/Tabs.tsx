import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd, faFilter, faDownload, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Stack } from "react-bootstrap";
import { useState } from "react";

import { AddTodo } from './AddTodo';
import { Search } from './Search';
import { FilterTodos } from './FilterTodos';
import { ImportExport } from './ImportExport';

type Tab = {
  name: string,
  icon: IconDefinition,
  content: JSX.Element
}

export function Tabs() {
  const [active, setActive] = useState('add-todo');

  const tabs: Tab[] = [{
      name: 'add-todo',
      icon: faAdd,
      content: <AddTodo/>
    } as Tab,
    {
      name: 'search-todos',
      icon: faSearch,
      content: <Search placeholder='Search by title or description' />
    } as Tab,
    {
      name: 'filter-todos',
      icon: faFilter,
      content: <FilterTodos/>
    },
    {
      name: 'import-export',
      icon: faDownload,
      content: <ImportExport/>
    } as Tab
  ] as Tab [];  
  const activeChild = tabs.find((item: Tab) => item.name === active);

  return (
    <section className="App__tabs mb-2" data-testid="tabs">
      <Stack direction="horizontal" gap={1}>      
        {tabs.map((tab: Tab) => (
          <div 
            data-testid={tab.name}
            key={tab.name}
            className={ 
              active === tab.name 
              ? "App__tabs__item" 
              : "App__tabs__item App__tabs__item--inactive"
            } 
            onClick={()=> setActive(tab.name)}
          >      
            <FontAwesomeIcon icon={tab.icon} />
          </div>
        ))}
      </Stack>
      <section className="App__tabs-content">
        <div 
          data-testid={"tab-content-" + activeChild?.name}
          key={"tab-content-" + activeChild?.name}
          className="fade-in"
        >
          {activeChild?.content}
        </div>
      </section>     
    </section>
  )
}