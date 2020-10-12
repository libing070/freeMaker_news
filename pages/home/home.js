const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")

Page({

    /**
    * 页面的初始数据
    */
    data: {
        safeBottom:app.safeBottom,
        safeTop:app.safeTop,
        staticIcon:['/images/home/icon_home_hr@2x.png','/images/home/icon_home_video@2x.png','/images/home/icon_home_design@2x.png','/images/home/icon_home_management@2x.png','/images/home/icon_home_operation@2x.png','/images/home/icon_home_development@2x.png'],
        pageType:'',
        firstLevelJobs:[],//一级标签
        secondLevelJobs:[],//二级标签
        recommendProductInfos:[]//为你推荐
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {        
        this.loadFirstLevelJobs()
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

        this.loadFirstLevelJobs()
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

    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

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
                showAuthModal:false
            })
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
    },

    pageType(e){
        console.log(e.detail.pageType);
        this.setData({
            pageType: e.detail.pageType
        })
    },
    changeName(event) {
        
        console.log(event.detail)
    },
    //跳转到homelist
    tapTohomeList(e) {

        let type=e.currentTarget.dataset.type
        let cateName=e.currentTarget.dataset.catename
        wx.navigateTo({
            url: '/pages/homeList/homeList?cateName=' + cateName + "&domaintype=" + type,
        })
    },
    //获取一级领域接口
    loadFirstLevelJobs(){
        REST.noVerfiyget({
            url: API.configs,
            success: res => {
                this.setData({
                    firstLevelJobs:res.firstLevelJobs,
                    secondLevelJobs:res.secondLevelJobs,
                    recommendProductInfos:res.recommendProductInfos
                });
                console.log(res.recommendProductInfos);
            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
    }
})