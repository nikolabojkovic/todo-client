import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd, faFilter, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Stack } from "react-bootstrap";
import { useState } from "react";

import { AddTodo } from './AddTodo';
import { Search } from './Search';
import { FilterTodos } from './FilterTodos';
import { ImportExport } from './ImportExport';

export function Tabs() {
  const [active, setActive] = useState('add-todo');
  const tabs: any = [{
      name: 'add-todo',
      icon: faAdd,
      content: <AddTodo/>
    },
    {
      name: 'search-todos',
      icon: faSearch,
      content: <Search placeholder='Search by title or description' />
    },
    {
      name: 'filter-todos',
      icon: faFilter,
      content: <FilterTodos/>
    },
    {
      name: 'import-export',
      icon: faDownload,
      content: <ImportExport/>
    }
  ];  
  const activeChild = tabs.find((item: any) => item.name === active);

  return (
    <section className="App__tabs mb-2">
      <Stack direction="horizontal" gap={1}>      
        {tabs.map((tab: any) => (
          <div 
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
          key={"tab-content-" + activeChild.name}
          className="fade-in"
        >
          {activeChild.content}
        </div>
      </section>     
    </section>
  )
}