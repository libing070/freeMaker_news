const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isClickPlus:false,//点击的是否是加号按钮
        safeTop: 0,
        selectedTab: 0,
        currentPage:1,
        pageType: '',
        tabs: ['我的需求', '我的订单', '我的服务'],
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
                'text': '已下单',
                'value': '10',
                'checked': false
            },
            {
                'text': '待接单',
                'value': '20',
                'checked': false
            },
            {
                'text': '已拒单',
                'value': '30',
                'checked': false
            },
            {
                'text': '待支付',
                'value': '40',
                'checked': false
            },
            {
                'text': '制作中',
                'value': '50',
                'checked': false
            },
            {
                'text': '待验收',
                'value': '60',
                'checked': false
            },
            {
                'text': '验收不通过',
                'value': '70',
                'checked': false
            },
            {
                'text': '验收仍不通过',
                'value': '71',
                'checked': false
            },
            {
                'text': '已完成',
                'value': '80',
                'checked': false
            },
            {
                'text': '已评价',
                'value': '90',
                'checked': false
            },
            {
                'text': '已取消',
                'value': '100',
                'checked': false
            }
        ],
        totalIncome: 0,
        demandCount: {
            total: 0,
            opened: 0,
            closed: 0
        },
        orderTypeIndex: 10, //全部
        loadmoreShowing:false
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
            selectedTab: app.globalData.selectedTab || 0,
            currentPage:1,
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
        this.setData({
            currentPage:1
        })
        let tab = this.data.selectedTab
        if (tab == 0) {
            this.getDemandListByEmployerId()
        } else if (tab == 1) {
            this.getOrderList()
        } else if (tab == 2) {
            this.getProductionListByFreelancerId()
        }

        wx.stopPullDownRefresh({
            success:(e)=>{
            },
            fail:(e)=>{
            },
            complete:(e)=>{
            },
        }) 
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.noMoreProduct) {
            return
        }

        this.data.currentPage += 1
        let tab = this.data.selectedTab
        if (tab == 0) {
            this.getDemandListByEmployerId()
        } else if (tab == 1) {
            this.getOrderList()
        } else if (tab == 2) {
            this.getProductionListByFreelancerId()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //获取个人信息接口
    getCurrentInfo(){
        REST.get({
            url: API.getCurrentInfo,
            success:res => {
            
                app.user.nickName=res.name
                app.user.avatarUrl=res.headImg

                this.setData({
                    user:app.user,
                    company:res.employerInfo.company,
                })

                wx.setStorageSync('user', app.user)

            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
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
    //点击子组件 加号 返回值 true
    parentClickPlus(e){
        let isClickPlus = e.detail.isClickPlus
        this.setData({
            isClickPlus
        })
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
            showAuthModal: false,
        })
        if (login) {
            let customtabbarComponent = this.selectComponent('#customtabbarComponent'); // 页面获取自定义组件实例
            customtabbarComponent.clickPlus(this.data.isClickPlus); // isClickPlus:true 点击的是加号 自动弹出弹窗

            //废弃
            // let customtabbarComponent = this.selectComponent('#customtabbarComponent'); // 页面获取自定义组件实例
            // if(this.data.pageType=='demand'){
            //     let e={
            //         currentTarget:{
            //             dataset:{
            //                 pagetype:'demand'
            //             }
            //         }
            //     }
            //     customtabbarComponent.tapToDemand(e); // 通过实例调用组件事件 跳转到发布需求
            // }else if(this.data.pageType=='product'){
            //     let e={
            //         currentTarget:{
            //             dataset:{
            //                 pagetype:'product'
            //             }
            //         }
            //     }
            //     customtabbarComponent.tapToProduct(e); // 通过实例调用组件事件 跳转到发布作品
            // }
        }

        if(app.user){
            this.getCurrentInfo()         
            this.getIncome()
            if (this.data.selectedTab == 0) {
                this.getDemandListByEmployerId()
                this.getDemandGroupCount()
            } else if (this.data.selectedTab  == 1) {
                this.getOrderList()
            } else if (this.data.selectedTab  == 2) {
                this.getProductionListByFreelancerId()
            }

        }
    },

    Relogin(){
       this.setData({
        showAuthModal:true
       })
    },
    pageType(e) {
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
            currentPage:1,
           
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
            currentPage:1
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
            currentPage:1,
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
            options2Text: options2Text,
            currentPage:1,
        })
        this.getOrderList()
    },
    //跳转到我的作品详情
    tapToProductDetails(e) {
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/myproductDetails/myproductDetails?prodId='+e.currentTarget.dataset.prodId,
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
            }
        })
    },
    getOrderList() {
        this.setData({
            loadmoreShowing: true
        })
        let that = this
        REST.get({
            url: API.getOrderListByStakeholder,
            data: {
                currentPage: this.data.currentPage,
                pageSize: 10,
                orderType: this.data.orderTypeIndex,
                status: this.data.status
            },
            success:(res)=> {
                if(!res.data) return
                if(res.totalPages >= this.data.currentPage){ //有数据了
                    this.noMoreProduct = false
                }else{
                    this.noMoreProduct = true
                }
                if (this.data.currentPage == 1) {
                    this.setData({
                        orderList:res.data
                    })

                } else {
                    this.setData({
                        orderList: this.data.orderList.concat(res.data)
                    })
                }

                this.setData({
                    selectedTab: this.data.selectedTab
                })
            },
            failed(res) {
                console.error(res)
            },
            complete:res => {
                this.setData({
                    loadmoreShowing: false
                })
            }
        })
    },
    getDemandListByEmployerId() {
        this.setData({
            loadmoreShowing: true
        })
        let that = this
        REST.get({
            url: API.getDemandListByEmployerId,
            data: {
                currentPage: this.data.currentPage,
                pageSize: 10,
                status: this.data.selectedDemandTab
            },
            success:(res)=> {
                if(!res.data) return
                if(res.totalPages >= this.data.currentPage){ //有数据了
                    this.noMoreProduct = false
                }else{
                    this.noMoreProduct = true
                }
                if (this.data.currentPage == 1) {
                    this.setData({
                        demandList:res.data
                    })

                } else {
                    this.setData({
                        demandList: this.data.demandList.concat(res.data)
                    })
                }

                this.setData({
                    selectedTab: this.data.selectedTab
                })
            },
            failed(res) {
                console.error(res)
            },
            complete:(res) =>{
                this.setData({
                    loadmoreShowing: false
                })
                
            }
        })
    },
    getProductionListByFreelancerId() {
        this.setData({
            loadmoreShowing: true
        })
        let that = this
        REST.get({
            url: API.getByLoginUser,
            data: {
                currentPage: this.data.currentPage,
                pageSize: 10
            },
            success:(res)=> {
                if(!res.data) return
                if(res.totalPages >= this.data.currentPage){ //有数据了
                    this.noMoreProduct = false
                }else{
                    this.noMoreProduct = true
                }
                if (this.data.currentPage == 1) {
                    this.setData({
                        productionList:res.data
                    })

                } else {
                    this.setData({
                        productionList: this.data.productionList.concat(res.data)
                    })
                }

                this.setData({
                    selectedTab: this.data.selectedTab
                })

            },
            failed(res) {
                console.error(res)
            },
            complete:(res) =>{
                this.setData({
                    loadmoreShowing: false
                })
                
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
    tapEdit(e) {
        // wx.navigateTo({
        //     url: '/pages/publishProduct/publishProduct?prodId='+e.currentTarget.dataset.prodId,
        // })
    },
    //跳转我的个人信息页面
    tapMyInfo(){
        //未登录
        if(!app.user){
            return
        }
        app.globalData.selectedTab = this.data.selectedTab
        wx.navigateTo({
            url: '/pages/myInfo/myInfo?headImg='+app.user.avatarUrl + '&name='+app.user.nickName
        })
    },
    //无数据跳转页面
    tapNoData(e){
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        let index = e.currentTarget.dataset.index
        app.globalData.selectedTab = index

        if(index == 0){//跳转发布需求页面
            if(this.data.company){
                wx.navigateTo({
                    url: '/pages/publishDemand/publishDemand?type=0', //type: 0 发布需求 ,1 编辑需求
                })
            }else{
                wx.navigateTo({
                    url: '/pages/employerMovein/employerMovein',
                })
            }
            
        }else if(index == 1){//跳转到首页
            wx.switchTab({
                url: '/pages/home/home'
            })
        }else if(index == 2){//跳转发布作品页面
            wx.navigateTo({
                url: '/pages/talentMovein/talentMovein?currStep=1'
             })
        }

    },
    //分享专属海报
    tapShare(e){
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        wx.navigateTo({
            url: '/pages/invite/invite',
         })
    }
})