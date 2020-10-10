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
        selectedDemandTab: 0,
        dropdownShowing1: false,
        options1Text: '全部订单',
        options2Text: '全部状态',
        status: 0,
        dropdownShowing2: false,
        options1: [{
                'text': '全部订单',
                'value': '10',
                'checked': false
            }, {
                'text': '我发起的',
                'value': '20',
                'checked': false
            },
            {
                'text': '我收到的',
                'value': '30',
                'checked': false
            }
        ],
        options2: [{
                'text': '全部',
                'value': '0',
                'checked': false
            },
            {
                'text': '制作中',
                'value': '40',
                'checked': false
            },
            {
                'text': '已下单',
                'value': '10',
                'checked': false
            },
            {
                'text': '已完成',
                'value': '70',
                'checked': false
            },
            {
                'text': '已评价',
                'value': '80',
                'checked': false
            },
        ],
        totalIncome: 0,
        orderList: [],
        demandList: [],
        productionList: [],
        demandCount: {
            total: 0,
            opened: 0,
            closed: 0
        },
        orderTypeIndex: 10 //全部
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            safeTop: app.safeTop
        });
        //todo zyc 待处理登录后再回调
        // if(app.globalData.userToken){

        // }
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
        this.setData({
            selectedTab: app.globalData.selectedTab || 0
        })
        // 监听屏幕滚动 关键位置
        this.scrollChangeNavigationBar = 44
        this.loginSuccess()
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
    // mark: 授权成功
    authSuccess(login) {
        if(login){
            this.setData({
                showAuthPhone:true //打开获取手机号自定义弹窗
            })
        }
    },
    // mark: 登录成功 （获取手机号成功）
    loginSuccess(login){
        this.setData({
            user: app.user,
            showAuthModal:false
        })
        if (login) {
            let customtabbarComponent = this.selectComponent('#customtabbarComponent'); // 页面获取自定义组件实例
            if(this.data.pageType=='demand'){
                let e={
                    currentTarget:{
                        dataset:{
                            pagetype:'demand'
                        }
                    }
                }
                customtabbarComponent.tapToDemand(e); // 通过实例调用组件事件 跳转到发布需求
            }else if(this.data.pageType=='product'){
                let e={
                    currentTarget:{
                        dataset:{
                            pagetype:'product'
                        }
                    }
                }
                customtabbarComponent.tapToProduct(e); // 通过实例调用组件事件 跳转到发布作品
            }
        }

        if(this.data.user){
                        
            this.getIncome()
            this.getDemandGroupCount()
            this.getDemandListByEmployerId()
            this.getOrderList()
        }
    },

    Relogin(){
       console.log("重新登录");
       this.setData({
        showAuthModal:true
       })
    },
    pageType(e) {
        console.log(e.detail.pageType);
        this.setData({
            pageType: e.detail.pageType
        })
    },
    //tab切换
    tapTab(e) {
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        let tab = e.currentTarget.dataset.tab
        this.setData({
            selectedTab: tab,
            dropdownShowing1: false,
            dropdownShowing2: false,
        })
        if (tab == 0) {
            this.getDemandListByEmployerId()
            this.getDemandGroupCount()
        } else if (tab == 1) {
            this.getOrderList()
        } else if (tab == 2) {
            this.getProductionListByFreelancerId()
        }
    },
    //我的需求 二级菜单切换事件
    tapdemandTab(e) {
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        let tab = e.currentTarget.dataset.tab
        this.setData({
            selectedDemandTab: tab,
        })
        this.getDemandListByEmployerId()
    },
    //跳转到需求详情
    tapToDemandDetails(e) {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/demandDetails/demandDetails?demandCode='+e.currentTarget.dataset.demandCode,
        })
    },
    //跳转到订单详情
    tapToOrderDetails(e) {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/orderDetails/orderDetails?orderId='+e.currentTarget.dataset.orderId,
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
    //我的订单 下拉菜单显示隐藏2
    dropdownShowing2(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                dropdownShowing2: !this.data.dropdownShowing2,
                dropdownShowing1: false,

            });
        }
    },
    //下拉菜单切换事件1
    tapChangedropdown1(e) {
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        let optionss = [...this.data.options1]
        let options1Text = ""
        this.data.orderTypeIndex = index

        let self = this
        for (let op of optionss) {
            if (op.value == index) {
                op.checked = true
                options1Text = op.text
            } else {
                op.checked = false
            }
        }
        this.setData({
            options1: optionss,
            dropdownShowing1: !this.data.dropdownShowing1,
            options1Text: options1Text,
        })
        this.getOrderList()
    },
    //下拉菜单切换事件2
    tapChangedropdown2(e) {
        let index = e.currentTarget.dataset.index
        let optionss = [...this.data.options2]
        let options2Text = ""
        this.data.status = optionss[index].value
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
        this.getOrderList()
    },
    //跳转到我的作品详情
    tapToProductDetails(e) {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/myproductDetails/myproductDetails?prodCode='+e.currentTarget.dataset.prodCode,
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
    getOrderList() {
        let that = this
        REST.get({
            url: API.getOrderListByStakeholder,
            data: {
                currentPage: 1,
                pageSize: 10,
                orderType: this.data.orderTypeIndex,
                status: this.data.status
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
    },
    getDemandListByEmployerId() {
        let that = this
        REST.get({
            url: API.getDemandListByEmployerId,
            data: {
                currentPage: 1,
                pageSize: 10,
                status: this.data.selectedDemandTab
            },
            success(res) {
                that.setData({
                    demandList: res.data
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化订单列表完成:", that.data.demandList)
            }
        })
    },
    getProductionListByFreelancerId() {
        let that = this
        REST.get({
            url: API.getByLoginUser,
            data: {
                currentPage: 1,
                pageSize: 10
            },
            success(res) {
                that.setData({
                    productionList: res.data
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化订单列表完成:", that.data.demandList)
            }
        })
    },
    updateDemandStatus(e) {
        let that = this
        REST.get({
            url: API.updateDemandStatus,
            data: {
                demandCode: e.currentTarget.dataset.code,
                status: e.currentTarget.dataset.status
            },
            success(res) {
                that.getDemandListByEmployerId()
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    },
    getDemandGroupCount() {
        let that = this
        REST.get({
            url: API.getDemandGroupCount,
            success(res) {
                that.setData({
                    'demandCount.total': res.total,
                    'demandCount.opened': res.opened,
                    'demandCount.closed': res.closed
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    },
    //跳转到需求编辑页面（发布需求页面）
    tapEditDemand(e) {
        wx.navigateTo({
            url: '/pages/publishDemand/publishDemand?demandCode='+e.currentTarget.dataset.demandCode,
        })
    },
})