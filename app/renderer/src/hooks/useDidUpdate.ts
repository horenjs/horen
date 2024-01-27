import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useDidUpdate(fn: EffectCallback, deps: DependencyList) {
  const mounted = useRef(false);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (mounted.current) {
      return fn();
    }

    mounted.current = true;
    return undefined;
  }, deps);
}
