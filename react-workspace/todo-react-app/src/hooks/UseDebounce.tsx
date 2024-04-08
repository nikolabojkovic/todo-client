import { useEffect, useState } from 'react';
import { Subject, debounceTime } from 'rxjs';

export function useDebounce(time: number, initialValue: string, handleEvent: (((value: string) => void) | undefined) = undefined) {
  const [value, setValue] = useState(initialValue);
  const [strim] = useState(() => new Subject<string>());

  useEffect(() => {
    const subscription = strim.pipe(
        debounceTime(time)
      )
      .subscribe((strimEventValue: string) => {
        setValue(strimEventValue);
        
        if (handleEvent) {
          handleEvent(strimEventValue);
        }
      });
      
    return () => subscription.unsubscribe();
  }, [time, strim]);

  return [value, (value: string) => strim.next(value)] as const;
 }