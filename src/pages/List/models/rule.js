import {
  queryMeetList,
  addMeetRoom,
  deleteMeetList,
  queryUserList,
  addUser,
  deleteUser,
} from '@/services/api';

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
    *addMeet({ payload }, { call, put }) {
      const response = yield call(addMeetRoom, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },
    *deleteMeet({ payload }, { call }) {
      // console.info('payload----',payload);
      const response = yield call(deleteMeetList, payload);
      return response;
    },
    *getUsers({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *addUsers({ payload }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },
    *deleteUsers({ payload }, { call }) {
      // console.info('payload----',payload);
      const response = yield call(deleteUser, payload);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
