import { SortButton } from './SortButton';

const sortByColumns = [
  {
    name: 'title',
    text: 'Title'
  },
  {
    name: 'description',
    text: 'Description'
  },
  {
    name: 'createdAt',
    text: 'Date'
  },
  {
    name: 'completed',
    text: 'Completed'
  }
];

export function Sorting() {
  return (
    <section className="App__sorting d-flex flex-wrap">
      {
        sortByColumns.map((item: any) => (
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