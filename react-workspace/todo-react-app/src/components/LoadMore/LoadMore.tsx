import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function LoadMore() {
  return (
    <div id="infinite-scroll-end" className="App__todo-list__infinite-scroll-end">
      <div className="App__todo-list__infinite-scroll-end--bouncing">
        <FontAwesomeIcon icon={faAngleDown} />
        <div>Scroll down to load more</div>
      </div>            
    </div>
  );
}