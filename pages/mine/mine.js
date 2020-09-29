const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeTop: 0,
        selectedTab: 0,
        pageType: '',
        tabs: ['我的需求', '我的订单', '我的作品'],
        safeBottom: app.safeBottom,
        selecteddemandTab: 0,
        dropdownShowing1: false,
        options1Text: '全部订单',
        options2Text: '全部状态',
        dropdownShowing2: false,
        options1: [{
                'text': '我发起的',
                'value': '0',
                'checked': false
            },
            {
                'text': '我收到的',
                'value': '1',
                'checked': false
            }
        ],
        options2: [{
                'text': '全部',
                'value': '0',
                'checked': false
            },
            {
                'text': '进行中',
                'value': '1',
                'checked': false
            },
            {
                'text': '待接单',
                'value': '2',
                'checked': false
            },
            {
                'text': '已完成',
                'value': '3',
                'checked': false
            },
            {
                'text': '已关闭',
                'value': '4',
                'checked': false
            },
        ],
        totalIncome: 0,
        orderList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            safeTop: app.safeTop
        });
        this.getIncome()
        this.getOrderList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loginSuccess()
        console.log(app.globalData.selectedTab);
        this.setData({
            selectedTab: app.globalData.selectedTab || 0
        })
        // 监听屏幕滚动 关键位置
        this.scrollChangeNavigationBar = 44
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onPageScroll(e) {
        // 导航栏 变白色
        if (e.scrollTop >= this.scrollChangeNavigationBar) {
            if (!this.data.whiteNavigationBar) {
                this.setData({
                    whiteNavigationBar: true
                })

                wx.setNavigationBarColor({
                    backgroundColor: '#ffffff',
                    frontColor: '#000000',
                })
            }

        } else {
            if (this.data.whiteNavigationBar) {
                this.setData({
                    whiteNavigationBar: false
                })

                wx.setNavigationBarColor({
                    backgroundColor: '#ffffff',
                    frontColor: '#000000',
                })
            }
        }
    },
    // mark: 登录成功
    loginSuccess(login) {
        this.setData({
            user: app.user,
        })
        if (login) {
            let customtabbarComponent = this.selectComponent('#customtabbarComponent'); // 页面获取自定义组件实例
            if (this.data.pageType == 'demand') {
                customtabbarComponent.tapToDemand(); // 通过实例调用组件事件 跳转到发布需求
            } else if (this.data.pageType == 'product') {
                customtabbarComponent.tapToProduct(); // 通过实例调用组件事件 跳转到发布作品
            }
        }
    },
    pageType(e) {
        console.log(e.detail.pageType);
        this.setData({
            pageType: e.detail.pageType
        })
    },
    //tab切换
    tapTab(e) {
        let tab = e.currentTarget.dataset.tab
        this.setData({
            selectedTab: tab,
            dropdownShowing1: false,
            dropdownShowing2: false,
        })
    },
    //我的需求 二级菜单切换事件
    tapdemandTab(e) {
        let tab = e.currentTarget.dataset.tab
        this.setData({
            selecteddemandTab: tab,
        })
    },
    //跳转到需求详情
    tapToDemandDetails() {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/demandDetails/demandDetails',
        })
    },
    //跳转到订单详情
    tapToOrderDetails(e) {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/orderDetails/orderDetails',
        })

    },
    //我的订单 下拉菜单显示隐藏1
    dropdownShowing1(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                dropdownShowing1: !this.data.dropdownShowing1,
                dropdownShowing2: false
            });
        }
    },
    //下拉菜单切换事件1
    tapChangedropdown1(e) {
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        let optionss = [...this.data.options1]
        let options1Text = ""
        for (let i = 0; i < optionss.length; i++) {
            if (i == index) {
                optionss[i].checked = true
                options1Text = optionss[i].text
            } else {
                optionss[i].checked = false
            }
        }
        this.setData({
            options1: optionss,
            dropdownShowing1: !this.data.dropdownShowing1,
            options1Text: options1Text
        })
    },
    //我的订单 下拉菜单显示隐藏2
    dropdownShowing2(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                dropdownShowing2: !this.data.dropdownShowing2,
                dropdownShowing1: false,

            });
        }
    },
    //下拉菜单切换事件2
    tapChangedropdown2(e) {
        let index = e.currentTarget.dataset.index
        let optionss = [...this.data.options2]
        let options2Text = ""
        for (let i = 0; i < optionss.length; i++) {
            if (i == index) {
                optionss[i].checked = true
                options2Text = optionss[i].text
            } else {
                optionss[i].checked = false
            }
        }
        this.setData({
            options2: optionss,
            dropdownShowing2: !this.data.dropdownShowing2,
            options2Text: options2Text
        })
    },
    //跳转到我的作品详情
    tapToProductDetails() {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/myproductDetails/myproductDetails',
        })
    },
    getIncome() {
        let that = this
        REST.get({
            url: API.getTotalIncome,
            success(res) {
                that.setData({
                    totalIncome: res.totalIncome
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化累计收入完成:", that.data.totalIncome)
            }
        })
    },
    loginCallback: function (e) {
        this.getIncome()
        console.log('登录回调事件', e)
    },
    getOrderList() {
        let that = this
        REST.get({
            url: API.getOrderListByStakeholder,
            data: {
                currentPage: 1,
                pageSize: 10
            },
            success(res) {
                that.setData({
                    orderList: res.data
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化订单列表完成:", that.data.orderList)
            }
        })
    }
})