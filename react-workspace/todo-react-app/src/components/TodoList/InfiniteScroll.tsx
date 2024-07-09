import { ReactNode, useEffect, useState } from "react";
import { delay, Subject } from "rxjs";

import { useTodoList } from "../../context";
import { Loader, LoadMore } from "..";
import { ListContainerType } from "../../models";

type Props = {
  children: ReactNode,
  setEndIndex: (index: number) => void
}

export function InfiniteScroll({children, setEndIndex}: Props) {
  const todoList = useTodoList();

  const itemheight = 55;
  const [infiniteScroll, setInfiniteScroll] = useState({ 
    startIndex: 0, 
    endIndex: calculateinfiniteScrollEndIndex(),
    isLoading: false,
    fetch: new Subject<number>()
  });

  const hasMoreItemsToLoad = !infiniteScroll.isLoading && (infiniteScroll.endIndex < todoList.displayList.length);

  useEffect(() => {
    setEndIndex(calculateinfiniteScrollEndIndex());
    const subscription = infiniteScroll.fetch
      .pipe(
        delay(1000),
      )
      .subscribe((endIndex: number) => {
        const end = endIndex + 5;
        setInfiniteScroll({...infiniteScroll, endIndex: end, isLoading: false});
        setEndIndex(end);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    const endIndex = calculateinfiniteScrollEndIndex();
    setEndIndex(endIndex);
    setInfiniteScroll({
      startIndex: 0, 
      endIndex,
      isLoading: false,
      fetch: infiniteScroll.fetch
    });
  }, [todoList.settings.general.listSizeType]);

  const handleScroll = () => {
    if (infiniteScroll.isLoading) {
      return;
    }

    let { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (todoList.settings.general.listSizeType === ListContainerType.Fixed) {
      scrollTop = document.getElementById('todo-list-container')!.scrollTop;
      clientHeight = document.getElementById('todo-list-container')!.clientHeight;      
      scrollHeight = document.getElementById('todo-list-container')!.scrollHeight;
    }

    if ((scrollTop + clientHeight >= scrollHeight - 20) 
     && !infiniteScroll.isLoading 
     && hasMoreItemsToLoad) {
      setInfiniteScroll({...infiniteScroll, isLoading: true });
      infiniteScroll.fetch.next(infiniteScroll.endIndex);
    }    
  };
  
  function calculateinfiniteScrollEndIndex(): number {
    const endIndex = (todoList.settings.general.listSizeType === ListContainerType.Fixed  
      ? ((todoList.settings.general.fixedListSize) / itemheight)
      : (document.documentElement.clientHeight - 200) / itemheight);

    return endIndex;
  }
  
  return (
    <div 
      onScroll={handleScroll}     
      style={ 
        todoList.settings.general.listSizeType === ListContainerType.Fixed 
        ? { 
            height: todoList.settings.general.fixedListSize,
            overflow: 'overlay'
          } : {}
        }
      
    >
      { children }
      { infiniteScroll.isLoading &&
        <Loader height={150} />
      }  
      { hasMoreItemsToLoad && 
        <LoadMore />
      } 
    </div>
  );
}