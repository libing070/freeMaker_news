// pages/loginPages/authButton/authButton.js

/*
    使用方法
    1. 页面.json 导入自定义组件
    2. 页面.wxml 按钮位置插入自定义组件 注意：绝对布局充满父节点
    3. 页面.js 输入以下代码
    onShow() {
        this.loginSuccess()
    },
    mark: 登录成功
    loginSuccess(login) {
        this.setData({
            user: app.user,
        })

        if (login) {

        }
    },
*/

const app = getApp()

Component({
    /**
     * 组件的方法列表
     */
    /**
     * 组件的属性列表
     */
    properties: {},

    methods: {
        getUserInfo(e) {
            let allow = e.detail.errMsg == 'getUserInfo:ok'
            if (allow) {
                app.login()
            }
        }
    },

})