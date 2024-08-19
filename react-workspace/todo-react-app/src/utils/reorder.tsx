import { ITodo } from "../models";

export  const reorder = (list: Array<ITodo>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // update sort index for each item
  result.forEach((item: ITodo, index: number) => item.sortId = index);

  return result;
};