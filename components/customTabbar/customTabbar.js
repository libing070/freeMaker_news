const config = require('./tabbarConfig.js')
const app = getApp()
Component({
    
    properties: {
        activeIndex: {
            type: Number,
            value: 0,//默认当前选中第一项
        },
    },
    
    // 进入页面时需要隐藏掉原有的tabbar
    // 有时ios下会有问题，于是写了两遍保险一点
    // 见 https://developers.weixin.qq.com/community/develop/doc/000ea2e6db4e50f0c8763741756000?highline=wx.hideTabBar%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E8%B0%83%E7%94%A8%E5%A4%B1%E8%B4%A5
    created() {
        // wx.hideTabBar({
        //     aniamtion: false,
        //     fail() {
        //         setTimeout(function () {
        //             wx.hideTabBar({ aniamtion: false })
        //         }, 500)
        //     }
        // })
    },
    ready() {
        // wx.hideTabBar({
        //     aniamtion: false,
        //     fail() {
        //         setTimeout(function () {
        //             wx.hideTabBar({ aniamtion: false })
        //         }, 500)
        //     }
        // })
    },

    data: config,
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () { 

        },
        hide: function () { 
            this.setData({
                shadeShowing:false
            })
        },
        resize: function () { },
    },
    methods: {
        clickTag(e) {
            let idx = e.currentTarget.dataset.index
            this.changeTag(idx)
        },
        // 点击中间的大加号等于点击第三项
        clickPlus() {
            this.changeTag(2)
        },
        changeTag(idx) {
            //如果点击当前所在的项，不会跳转
            if (idx == this.data.activeIndex)
                return;
            // 特定需求，中间页的样式有点特别，那个页面没有底部tabbar
            // 因此这个要用页面跳转
            if (idx === 2) {
                this.setData({
                    shadeShowing:!this.data.shadeShowing
                })
                if(this.data.shadeShowing){
                    this.setData({
                        user: app.user
                    })
                }
            }
            else {
                let pageUrl = this.data.tabs[idx].data
                wx.switchTab({
                    url: pageUrl,
                })
            }
        },
        //显示隐藏
        shadeShowing(e) {

            if (e.currentTarget.dataset.id != "shadeMain") {
                this.setData({
                    shadeShowing: !this.data.shadeShowing
                });
            }
        },
        //子父传值
        valChildToParent(e){
            let pageType=e.currentTarget.dataset.pagetype
            this.triggerEvent('pageType', {
                pageType:pageType
            })
        },
        //发布需求
        tapToDemand(e){
            let pageType=e.currentTarget.dataset.pagetype
            this.triggerEvent('pageType', {
                pageType:pageType
            })
            // 未登录
            if (!app.user) {
                this.setData({
                    showAuthModal: true
                })
                return
            }
            wx.navigateTo({
                url: '/pages/publishDemand/publishDemand?type=0', //type: 0 发布需求 ,1 购买服务
            })
        },
        //发布需求
        tapToProduct(e){
            let pageType=e.currentTarget.dataset.pagetype
            this.triggerEvent('pageType', {
                pageType:pageType
            })
            // 未登录
            if (!app.user) {
                this.setData({
                    showAuthModal: true
                })
                return
            }
            wx.navigateTo({
                url: '/pages/publishProduct/publishProduct',
            })
        }
    }
})