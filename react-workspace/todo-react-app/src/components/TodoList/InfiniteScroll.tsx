import { ReactNode, useEffect, useRef, useState } from "react";
import { delay, Subject } from "rxjs";

import { useTodoList } from "../../context";
import { Loader, LoadMore } from "..";
import { ListContainerType } from "../../models";

type Props = {
  children: ReactNode,
  updateEndIndex: (index: number) => void,
  fetch: Subject<number>,
  itemHeight: number
}

export function InfiniteScroll({children, updateEndIndex, fetch, itemHeight}: Props) {
  const todoList = useTodoList();

  const scrollableContainerRef = useRef(null as any);

  const [endIndex, setEndIndex] = useState(calculateEndIndex());
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreItemsToLoad = !isLoading && (endIndex < todoList.displayList.length);

  useEffect(() => {
    updateEndIndex(calculateEndIndex());
    const subscription = fetch
      .pipe(
        delay(1000),
      )
      .subscribe((endIndex: number) => {
        setEndIndex(endIndex);
        setIsLoading(false);
        updateEndIndex(endIndex);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onDocumentScroll = () => {
      if (todoList.settings.general.listSizeType !== ListContainerType.Dynamic) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      handleScroll (scrollTop, clientHeight, scrollHeight);
    };

    window.addEventListener("scroll", onDocumentScroll);
    return () => {
      window.removeEventListener("scroll", onDocumentScroll);
    };
  });

  useEffect(() => {
    const endIndex = calculateEndIndex();
    updateEndIndex(endIndex);
    setEndIndex(endIndex);
    setIsLoading(false);
  }, [todoList.settings.general.listSizeType]);

  const handleScroll = (scrollTop: number, clientHeight: number, scrollHeight: number) => {
    if (isLoading) {
      return;
    }

    if ((scrollTop + clientHeight >= scrollHeight - 20) 
     && !isLoading 
     && hasMoreItemsToLoad) {
      setIsLoading(true);
      fetch.next(endIndex + 5);
    }    
  };
  
  function calculateEndIndex(): number {
    const endIndex = (todoList.settings.general.listSizeType === ListContainerType.Fixed  
      ? ((todoList.settings.general.fixedListSize) / itemHeight)
      : (document.documentElement.clientHeight - 200) / itemHeight);

    return endIndex;
  }
  
  return (
    <div 
      id="scrollable-container"  
      data-testid="scrollable-container"
      ref={scrollableContainerRef}
      onScroll={() => {
        if (todoList.settings.general.listSizeType !== ListContainerType.Fixed) return;

        handleScroll(scrollableContainerRef.current.scrollTop, scrollableContainerRef.current.clientHeight, scrollableContainerRef.current.scrollHeight);
      }}     
      style={ 
        todoList.settings.general.listSizeType === ListContainerType.Fixed 
        ? { 
            height: todoList.settings.general.fixedListSize,
            overflow: 'overlay'
          } : {}
        }
      
    >
      { children }
      { isLoading &&
        <Loader height={150} />
      }  
      { hasMoreItemsToLoad && 
        <LoadMore />
      } 
    </div>
  );
}