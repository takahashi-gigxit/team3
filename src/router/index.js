import { createRouter, createWebHistory } from 'vue-router'

// 認証系
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegisterConfirm from '../views/RegisterConfirm.vue'
import Logout from '../views/logout.vue'

// 一般ユーザー用
import UserMain from '../views/UserMain.vue'
import Attendance from '../views/Attendance.vue'
import Application from '../views/Application.vue'
import ProfileUpdateDone from '../views/ProfileUpdateDone.vue'

// 管理者用
import AdminHome from '../views/AdminHome.vue'
import Approval from '../views/Approval.vue'


// master用
import MasterHome from '../views/MasterHome.vue'
import UserList from '../views/UserList.vue'
import UserEdit from '../views/UserEdit.vue'
import ApplicationList from '../views/ApplicationList.vue'


const routes = [
  // 認証画面
  { path: '/Login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/register/confirm', name: 'RegisterConfirm', component: RegisterConfirm },
  { path: '/Logout', name: 'Logout', component: Logout },

  // 一般ユーザー画面
  { path: '/main', name: 'UserMain', component: UserMain },
  { path: '/attendance', name: 'Attendance', component: Attendance },
  { path: '/application', name: 'Application', component: Application },
  { path: '/profile/update/done', name: 'ProfileUpdateDone', component: ProfileUpdateDone },
  { path: '/attendance/:month/:day', name: 'AttendanceWithDate', component: Attendance },

  // 管理者画面
  { path: '/admin', name: 'AdminHome', component: AdminHome },
  { path: '/admin/approval', name: 'Approval', component: Approval },
 
  // master用
  {
    path: '/master/home',
    name: 'MasterHome',
    component: MasterHome,
    meta: { requiresAuth: true, role: 'master' }
  },
   { path: '/user/list', name: 'UserList', component: UserList },
  { path: '/user/edit', name: 'UserEdit', component: UserEdit },
  { path: '/application/delete', name: 'ApplicationList', component: ApplicationList },


  // デフォルトルート
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ テスト用（ログインなしで全画面アクセス可能）
router.beforeEach((to, from, next) => {
  next()
})

export default router
