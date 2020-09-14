//app.js
App({
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
      
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
     /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow(options) {
        this.checkForUpdate();
    },
    //登录
    login() {
        wx.login({
            success: res => {
                console.log(res);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    //强制用户更新
    checkForUpdate() {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
            if (res.hasUpdate) { // 请求完新版本信息的回调
                updateManager.onUpdateReady(function() {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        confirmColor: '#FA2878',
                        success: function(res) {
                            if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                wx.clearStorage();//清除本地缓存
                                updateManager.applyUpdate()
                            }
                        }
                    })
                });
                updateManager.onUpdateFailed(function() {
                    wx.showModal({// 新的版本下载失败
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索进入哟~',
                    })
                })
            }
        })
    },
    /**
     * 网络请求 携带用户身份
     * @param url String PathName无需域名前缀
     * @param data Object [可选] request.body
     * @param method String [可选] 默认POST
     * @param success Function [可选] 成功
     * @param fail Function [可选] 失败
     * @param complete Function [可选] 完成
     */
    request(object) {
        wx.request({ 
            url: this.globalData.domain + object.url,
            data: object.data,
            header: {
                cookie: this.globalData.cookie,
                'content-type': object.contentType || 'application/json'
            },
            method: object.method || 'POST',
            success: res => {
                let body = res.data

                if (object.success) {
                    object.success(res)
                }
            },
            fail: res => {
                if (object.fail) {
                    object.fail(res)
                }
            },
            complete: res => {
                if (object.complete) {
                    object.complete(res)
                }
            }
        })
    },
    globalData: {
        domain: 'https://www.xxx.com', //域名

        cookie:'',

        userInfo: null,

        selectedTab:0//我的页面 当前选择的菜单
        
    }
})