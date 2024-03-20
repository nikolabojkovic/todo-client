import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd, faFilter, faDownload, IconDefinition, faGear } from '@fortawesome/free-solid-svg-icons';
import { Stack } from "react-bootstrap";
import { useState } from "react";
import { AddTodo } from '../AddTodo/AddTodo';
import { Search } from '../Search/Search';
import { FilterTodos } from '../Filter/FilterTodos';
import { ImportExport } from '../ImportExport/ImportExport';
import { useTodoList, useTodoListDispatch } from "../../context/TodoListContext";
import { Settings } from "../TodoSettings/TodoSettings";
import { IAction, TodoActions } from "../../models/Action";

type Tab = {
  name: string,
  icon: IconDefinition,
  content: JSX.Element
}

export function Tabs() {
  const [active, setActive] = useState('add-todo');
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('data-test-id', 'download-link');
  const fileReader = new FileReader(); 

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
      content: <FilterTodos filter={todoList.filter} />
    },
    {
      name: 'import-export',
      icon: faDownload,
      content: <ImportExport downloadLink={downloadLink} fileReader={fileReader} alert={window.alert}/>
    } as Tab,
    {
      name: 'settings',
      icon: faGear,
      content: <Settings />
    } as Tab
  ] as Tab [];  
  const activeChild = tabs.find((item: Tab) => item.name === active);

  function handleTabChange(tab: Tab) {
    setActive(tab.name);
    dispatch({
      type: TodoActions.activeTabChanged,
      payload: {
        activeTab: tab.name
      }
    } as IAction);
  }

  return (
    <section className="App__tabs mb-2" data-testid="tabs">
      <section className='App__tabs__header'>
        <Stack direction="horizontal" gap={1} className='align-items-end'>      
          {tabs.map((tab: Tab) => (
            <div 
              data-testid={tab.name}
              key={tab.name}
              className={ 
                active === tab.name 
                ? "App__tabs__item" 
                : "App__tabs__item App__tabs__item--inactive"
              } 
              onClick={() => handleTabChange(tab)}
            >      
              <FontAwesomeIcon icon={tab.icon} />
            </div>
          ))}
        </Stack>
      </section>      
      <section className="App__tabs__content">
        <div 
          data-testid={"tab-content-" + activeChild?.name}
          key={"tab-content-" + activeChild?.name}
          className=""
        >
          {activeChild?.content}
        </div>
      </section>     
    </section>
  );
}