import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';

// Pages
import Dashboard from '@/pages/Dashboard/Dashboard';
import Icons from '@/pages/Icons/Icons'
import Charts from '@/pages/Charts/Charts'
import Maps from '@/pages/Maps/Google'
import Error from "@/pages/Error/Error";
import Login from "@/pages/Login/Login";
import Role from "@/pages/Role/Role";
import Student from "@/pages/Student/Student";
import Teacher from "@/pages/Teacher/Teacher";
import Academy from "@/pages/Academy/Academy";
import Major from "@/pages/Major/Major";
import Clazz from "@/pages/Clazz/Clazz";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
    path: '/',
    redirect: 'login',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'role',
        name: 'Role',
        component: Role
      },
      {
        path: 'student',
        name: 'Student',
        component: Student
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: Teacher
      },
      {
        path: 'depart',
        name: 'Depart',
        component: Academy
      },
      {
        path: 'major',
        name: 'Major',
        component: Major
      },
      {
        path: 'clazz',
        name: 'Clazz',
        component: Clazz
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'charts',
        name: 'Charts',
        component: Charts
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps
      },
    ],
  },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ],
});
