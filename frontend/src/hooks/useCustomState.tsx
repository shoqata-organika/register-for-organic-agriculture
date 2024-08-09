import { useReducer, Dispatch, Reducer } from 'react';

interface DefaultState<T = object> {
  overlay: boolean;
  rerender: number;
  list: (T & { id: number | string })[];
  item: T | null;
}

interface Action<T> {
  type:
    | 'UPDATE_STATE'
    | 'QUEUE_FOR_UPDATE'
    | 'RESET_OVERLAY_AND_ITEM'
    | 'UPDATE_LIST'
    | 'UPDATE_OVERLAY';
  payload: Partial<T>;
}

export class State<T, K extends object = object> {
  private _state: DefaultState<T> = {
    overlay: false,
    rerender: 0,
    list: [],
    item: null,
  };

  constructor(private extraState?: K) {}

  getState() {
    return {
      ...this._state,
      ...this.extraState,
    } as DefaultState<T> & K;
  }
}

function reducer<T extends DefaultState>(state: T, action: Action<T>): T {
  switch (action.type) {
    case 'UPDATE_STATE': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'RESET_OVERLAY_AND_ITEM': {
      return {
        ...state,
        rerender: action.payload.rerender,
        item: action.payload.item,
        overlay: action.payload.overlay,
      };
    }

    case 'UPDATE_LIST': {
      return {
        ...state,
        list: action.payload.list,
      };
    }

    case 'QUEUE_FOR_UPDATE': {
      return {
        ...state,
        overlay: true,
        item: action.payload.item,
      };
    }

    case 'UPDATE_OVERLAY': {
      return {
        ...state,
        overlay: action.payload.overlay,
      };
    }

    default:
      return state;
  }
}

function useCustomState<T extends DefaultState & { id?: number }>(
  initialState: T,
): {
  state: T;
  dispatch: Dispatch<Action<T>>;
  onClose: (arg?: boolean) => void;
  onEdit: (arg: number | string) => void;
} {
  const [state, dispatch] = useReducer<Reducer<T, Action<T>>>(
    reducer,
    initialState,
  );

  function onEdit(itemId: number | string): void {
    dispatch({
      type: 'QUEUE_FOR_UPDATE',
      payload: {
        item: state.list.find((it) => it.id === itemId),
      } as Partial<T>,
    });
  }

  function onClose(shouldRerender: boolean = false) {
    dispatch({
      type: 'RESET_OVERLAY_AND_ITEM',
      payload: {
        overlay: false,
        item: null,
        rerender: shouldRerender ? ++state.rerender : state.rerender,
      } as Partial<T>,
    });
  }

  return {
    state,
    dispatch,
    onClose,
    onEdit,
  };
}

export default useCustomState;
