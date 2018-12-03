export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'home',
        icon: 'dashboard',
        component: './Dashboard/Analysis',
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'userlist',
            component: './List/TableList',
          },
          {
            path: '/list/List',
            name: 'roomlist',
            component: './List/List',
          },
        ],
      },
      {
        path:'/appoint',
        icon:'form',
        name:'appoint',
        component:'./Appoint/Appoint'
      },
      {
        component: '404',
      },
    ],
  },
];
