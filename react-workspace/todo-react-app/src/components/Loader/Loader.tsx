type Props = {
  height: number;
}

export function Loader({ height }: Props) {
  return (<div id="loader" data-testid="loader" style={{height: height + 'px'}} className='loader-container d-flex justify-content-center align-items-center fade-in'>
            <div className='loader'></div>
          </div>);
}