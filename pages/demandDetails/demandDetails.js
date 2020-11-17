// pages/demandDetails/demandDetails.js
const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIosSystem:app.isIosSystem,
        safeBottom: app.safeBottom,
        demandCode: '',
        demandDetail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //禁止转发 分享朋友圈
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.setData({
            demandCode: options.demandCode
        })
        this.getDemandDetail()
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
        })
        if (login) {
            this.setData({
                showAuthModal:false,
                showAuthPhone:false
            })
            this.getDemandDetail()
        }

    },
    //mark: 重新登录
    Relogin(){
        this.setData({
         showAuthModal:true
        })
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
    //跳转到需求推送人列表
    tapToPushUserList(e) {
        app.globalData.myDemandDetailData={
            title:this.data.demandDetail.summarize,
            description:this.data.demandDetail.description
        }
        wx.navigateTo({
            url: '/pages/pushUserList/pushUserList?id='+e.currentTarget.dataset.id,
        })
    },
    //关闭需求
    tapCloseDemand(e) {
        wx.showModal({
            title: '提示信息',
            content: '确认关闭当前需求吗？',
            showCancel: true,
            confirmColor: '#FFBA20',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.updateDemandStatus(e.currentTarget.dataset.status)
                    wx.showToast({
                        title: '需求已关闭',
                        icon: 'none',
                        duration: 2000,
                        success: ()=> {
                            wx.navigateBack({
                                delta: 1,
                                success: function (e) {
                                    let page = getCurrentPages().pop();
                                    if (page == undefined || page == null) {
                                        return
                                    };
                                    page.getDemandListByEmployerId();
                                }
                            })
                        }
                    });
                }
            },
        })
    },
    //跳转到需求编辑页面（发布需求页面）
    tapEditDemand() {
        wx.navigateTo({
            url: '/pages/publishDemand/publishDemand?type=1&demandCode='+this.data.demandDetail.code,
        })
    },
    getDemandDetail() {
        let that = this
        REST.get({
            url: API.getDemandDetail,
            data: {
                demandCode: this.data.demandCode
            },
            success(res) {
                that.setData({
                    demandDetail: res
                }) 
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    },
    //todo 和mine.js方法可抽取共用，Page中的方法如何export当成组件，不晓得
    updateDemandStatus(status) {
        let that = this
        REST.get({
            url: API.updateDemandStatus,
            data: {
                demandCode: this.data.demandDetail.code,
                status: status
            },
            success(res) {
                that.getDemandDetail()
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    },
})