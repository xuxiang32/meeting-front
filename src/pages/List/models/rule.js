import { queryMeetList , addMeetRoom , deleteMeetList } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMeetList, payload);
      // console.log('response----',response);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *addMeet({ payload },{ call }){
      const response = yield call(addMeetRoom, payload);
      return response;
    },
    *deleteMeet({ payload },{ call }){
      // console.info('payload----',payload);
      const response = yield call(deleteMeetList, payload);
      return response
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
  },
};
