import * as actions from "../actions/actionTypes";
import initialState from "../store/initialState";


const rootReducer = function (state = initialState, action) {
  let newState;

  switch (action.type) {
    // results

    case actions.SEQUENCE:
      return Object.assign({}, state, { sequence: action.sequence });

    case actions.RFAM_TRACK:
      return Object.assign({}, state, { rfamHits: action.rfamHits });

    case actions.SEQUENCE_FEATURES:
      return Object.assign({}, state, {
        anticodon: action.anticodon,
        conservedRnaStructure: action.conservedRnaStructure,
        cpatOrf: action.cpatOrf,
        matureProduct: action.matureProduct,
      });

    default:
      return state;
  }
};

export default rootReducer;