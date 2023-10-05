import { SortButton } from './SortButton';

type Sort = {
  name: string,
  text: string
}

const sortByColumns: Sort[] = [
  {
    name: 'title',
    text: 'Title'
  } as Sort,
  {
    name: 'description',
    text: 'Description'
  } as Sort,
  {
    name: 'createdAt',
    text: 'Date'
  } as Sort,
  {
    name: 'completed',
    text: 'Completed'
  } as Sort
];

export function Sorting() {
  return (
    <section className="App__sorting d-flex flex-wrap">
      {
        sortByColumns.map((item: Sort) => (
          <SortButton 
            key={item.name}
            column={item.name}
            text={item.text}
          />
        ))
      }
    </section>
  );
}