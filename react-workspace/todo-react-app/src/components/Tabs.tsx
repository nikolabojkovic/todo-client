import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd, faFilter, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Stack } from "react-bootstrap";
import { useState } from "react";

export function Tabs({ children }: any) {
  const [active, setActive] = useState('add-todo');
  const activeChild = children.find((item: any) => item.key === active);
  const tabs = [{
    name: 'add-todo',
    icon: faAdd,
  },
  {
    name: 'search-todos',
    icon: faSearch
  },
  {
    name: 'filter-todos',
    icon: faFilter
  },
  {
    name: 'import-export',
    icon: faDownload
  }
];

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
          key={"tab-content-" + activeChild.key}
          className="fade-in"
        >
          {activeChild}
        </div>
      </section>     
    </section>
  )
}