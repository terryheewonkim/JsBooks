import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const INIT_STATE: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = INIT_STATE, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    // NOT USING IMMER (no mutation):
    // return {
    //   ...state,
    //   data: {
    //     ...state.data,
    //     [id]: {
    //       ...state.data[id],
    //       content: content,
    //     },
    //   },
    // };
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);

      return state;
    case ActionType.MOVE_CELL: {
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;

      return state;
    }
    case ActionType.INSERT_CELL_AFTER: {
      const cell: Cell = {
        id: generateRandId(),
        type: action.payload.type,
        content: '',
      };

      state.data[cell.id] = cell;

      const index = state.order.findIndex((id) => id === action.payload.id);

      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }

      return state;
    }
    default:
      return state;
  }
}, INIT_STATE);

const generateRandId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
