//app.js

const API = require("./utils/api.js")
const ENV = require("./utils/env.js")
const REST = require("./utils/restful.js")

App({
    globalData: {
        //domain: ENV.Dev, //本地
          domain: ENV.Test, //测试
        // domain: ENV.Prod, //正式
        cookie: '',

        userInfo: null,

        selectedTab: 0, //我的页面 当前选择的菜单

        userToken: '',

        code:''//登录官方凭证

    },
    API,
    onLaunch: function () {


        //wx.clearStorage();//真机调试 清除缓存 注：正式环境删除
        let info = wx.getSystemInfoSync()
        // 屏幕宽高
        this.screenWidth = info.screenWidth
        this.screenHeight = info.screenHeight
        // 窗口宽高
        this.windowWidth = info.windowWidth
        this.windowHeight = info.windowHeight
        // 异形屏安全区域
        if (info.safeArea && info.safeArea.top) {
            this.safeTop = info.safeArea.top
            this.safeBottom = info.screenHeight - info.safeArea.bottom
        } else {
            this.safeTop = info.statusBarHeight
            this.safeBottom = 0
        }

        this.user = wx.getStorageSync('user') || ''
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow(options) {
        this.checkForUpdate();
    },
    //登录
    login() {
        wx.showLoading({
            title: '正在登录',
            mask: true,
        })

        wx.login({
            success: res => {
                this.globalData.code = res.code
                getUserInfo(res.code)
            },
            fail: res => {
                fail()
            }
        })


        let getUserInfo = code => {

            wx.getUserInfo({
                withCredentials: true,
                success: res => {
                    this.globalData.userInfo = res.userInfo //中间层传给获取手机号接口使用 authPhone.js
                    //向后台同步用户信息
                    REST.post({
                        url: API.syncUserInfo,
                        data: {
                            code: code,
                            nickName: this.user.nickName,
                            language: this.user.language,
                            province: this.user.province,
                            city: this.user.city,
                            avatarUrl: this.user.avatarUrl,
                            gender: this.user.gender
                        },
                        success: (data) => {
                            this.globalData.userToken = data.userToken  //中间层传给获取手机号接口使用 authPhone.js

                            if(data.hasPhone){
                                this.user= this.globalData.userInfo
                                wx.setStorageSync('user', this.globalData.userInfo)
                                wx.setStorageSync('token', this.globalData.userToken)
                                // 登录成功 通知当前页面
                                let currentPage = this.currentPage()
                                if (currentPage.loginSuccess) {
                                    currentPage.loginSuccess(true)
                                }
                                wx.showToast({
                                    title: '登录成功',
                                    duration: 1000
                                })
                            }else{
                                // 授权成功 通知当前页面 获取手机号码
                                let currentPage = this.currentPage()
                                if (currentPage.authSuccess) {
                                    currentPage.authSuccess(true)
                                }
                            }
                           
                            wx.hideLoading() 
                        },
                        fail: res => {
                            fail()
                        },
                    })
                },
                fail: res => {
                    wx.showToast({
                        title: '系统错误，请重试',
                        icon: 'none',
                    })
                }
            })
        }
        let fail = () => {
            wx.showToast({
                title: '登录失败，请重试',
                icon: 'none',
            })
            wx.hideLoading() 
            wx.clearStorage()//清除所有缓存
            this.user=""
            this.globalData.userToken=""
        }
    },
    //登录失效 跳转到我的页面
    navbackMinePage(){
        wx.navigateTo({
            url: '/pages/mine/mine'
        })
    },
    // 当前显示的页面实例
    currentPage() {
        let page = getCurrentPages().pop()
        return page || {}
    },
    //强制用户更新
    checkForUpdate() {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            if (res.hasUpdate) { // 请求完新版本信息的回调
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        confirmColor: '#FA2878',
                        success: function (res) {
                            if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                wx.clearStorage(); //清除本地缓存
                                updateManager.applyUpdate()
                            }
                        }
                    })
                });
                updateManager.onUpdateFailed(function () {
                    wx.showModal({ // 新的版本下载失败
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索进入哟~',
                    })
                })
            }
        })
    }
})