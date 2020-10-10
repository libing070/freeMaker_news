// components/authPhone/authPhone.js
// pages/loginPages/authModal/authModal.js

const app = getApp()

const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: Boolean,
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    pageLifetimes: {
        // 页面被隐藏
        hide() {
            this.dismiss()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tapCancel() {
            this.dismiss()
            app.globalData.userToken = "" //授权成功的时候赋值了  这里拒绝 就清空
        },

        authDone(e) {
            let that = this
            REST.post({
                url: API.updatePhone,
                data: {
                    code: app.globalData.code,
                    encryptedData: e.detail.detail.encryptedData,
                    iv:e.detail.detail.iv
                },
                success(res) {
                    if(e.detail.detail.errMsg =="getPhoneNumber:ok") {
                        app.user= app.globalData.userInfo
                        wx.setStorageSync('user', app.globalData.userInfo)
                        wx.setStorageSync('token', app.globalData.userToken)
                        // 登录成功 通知当前页面
                        let currentPage = app.currentPage()
                        if (currentPage.loginSuccess) {
                            currentPage.loginSuccess(true)
                        }
                        wx.showToast({
                            title: '登录成功',
                            duration: 1000
                        })
                        that.dismiss()
                    }

                },
                failed(res) {
                    console.error(res)
                },
                complete(res) {
                }
            })
        },

        dismiss() {
            this.setData({
                show: false
            })
        }
    }
})
