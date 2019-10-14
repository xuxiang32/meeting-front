import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { loginPost, getFakeCaptcha, logOut } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginPost, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'success') {
        sessionStorage.setItem('token', response.data.token);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(logOut);
      if (response.status === 'success') {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const userType = payload.data.department === 1 ? 'admin' : 'user';
      setAuthority(userType);
      return {
        ...state,
        status: payload.status,
        data: payload.data,
      };
    },
    logOut(state, { payload }) {
      const userType = payload.data.department === 1 ? 'admin' : 'user';
      setAuthority(userType);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
