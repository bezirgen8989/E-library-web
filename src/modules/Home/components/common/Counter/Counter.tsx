type CounterProps = {
  counter: number
  onSetCounter: (val: number) => void
  onResetCounter: () => void
}

const Counter: React.FC<CounterProps> = props => {
  // const { counter, onSetCounter, onResetCounter } = props
  return (
    <div>
      {/*<button onClick={() => onSetCounter(-1)}>-</button>*/}
      {/*{counter}*/}
      {/*<button onClick={() => onSetCounter(1)}>+</button>*/}
      {/*<button onClick={() => onResetCounter()}>Reset</button>*/}
    </div>
  )
}

export default Counter
