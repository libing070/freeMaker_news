const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")

Page({

    /**
    * 页面的初始数据
    */
    data: {
        isClickPlus:false,//点击的是否是加号按钮
        safeBottom:app.safeBottom,
        safeTop:app.safeTop,
        staticIcon:['/images/home/icon_home_hr@2x.png','/images/home/icon_home_video@2x.png','/images/home/icon_home_design@2x.png','/images/home/icon_home_management@2x.png','/images/home/icon_home_operation@2x.png','/images/home/icon_home_development@2x.png'],
        pageType:'',
        firstLevelJobs:[],//一级标签
        secondLevelJobs:[],//二级标签
        recommendProductInfos:[],//为你推荐
        loadmoreShowing: false

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {   
        console.log(options.scene)
     
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
        return {
            title:'欢迎入驻平台',
            path: '/pages/home/home',
            imageUrl:'https://howwork-1301749332.cos.ap-beijing.myqcloud.com/production/2020-11-10/wxebd3588df98ae1a7.o6zAJs6MrGfeTqciNsKbK7FuwdHM.NZug5zJdJUm43e1def5a672022c71acc146f6c78c9b0.png'
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
            user: app.user,
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
    },

    pageType(e){
        this.setData({
            pageType: e.detail.pageType
        })
    },
    changeName(event) {
        
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
        this.setData({
            loadmoreShowing: true
        })
        REST.noVerfiyget({
            url: API.configs,
            success: res => {
                this.setData({
                    firstLevelJobs:res.firstLevelJobs,
                    secondLevelJobs:res.secondLevelJobs,
                    recommendProductInfos:res.recommendProductInfos
                });
            },
            failed: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
            complete:(res) =>{
                this.setData({
                    loadmoreShowing: false
                })
                
            }
        })
    },
    //跳转到需求列表页面
    tapToDemandList(){
        wx.navigateTo({
            url: '/pages/demandList/demandList',
        })
    },
    //邀请好友
    tapToInvite(){
        wx.navigateTo({
            url: '/pages/invite/invite',
        })
    }
})