import React from 'react';

export const { Provider: StateProvider, Consumer: StateConsumer } = React.createContext({});

export const withState = Comp => {
  const WrappedComponent = props => (
    <StateConsumer>
      {({ state, dispatch }) => (
        <Comp {...props} state={state} dispatch={dispatch} />
      )}
    </StateConsumer>
  );
  WrappedComponent.displayName = `WithState(${Comp.displayName || Comp.name})`;
  return WrappedComponent;
};
