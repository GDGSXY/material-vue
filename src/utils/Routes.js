import constants from "@/utils/PermissionConstant";

export const validPermission = permission => {
    const routes = [
        {title: '首页', icon: 'mdi-home', link: '/dashboard'},
        {title: '学生管理', icon: 'mdi-account', link: '/student', permission: constants.STUDENT_MANAGEMENT},
        {title: '教职工管理', icon: 'fa-graduation-cap', link: '/teacher', permission: constants.TEACHER_MANAGEMENT},
        {title: '学院管理', icon: 'mdi-account', link: '/depart', permission: constants.ACADEMY_MANAGEMENT},
        {title: '专业管理', icon: 'mdi-account', link: '/major', permission: constants.MAJOR_MANAGEMENT},
        {title: '班级管理', icon: 'mdi-account', link: '/clazz', permission: constants.CLASS_MANAGEMENT},
        {title: '角色管理', icon: 'mdi-account', link: '/role', permission: constants.ROLE_MANAGEMENT},
        {title: '用户管理', icon: 'mdi-account', link: '/user', permission: constants.USER_MANAGEMENT}
    ]
    const validRoutes = []
    for (let route of routes) {
        let pms = route.permission;
        if (!pms || permission.indexOf(pms) !== -1){
            validRoutes.push(route)
        }
    }
    return validRoutes
}