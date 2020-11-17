// pages/canOrdersList/canOrdersList.js
const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        currentPage:1,
        chooseRadioIndex:'',
        canClick:false
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
            demandId:options.demandId
        })
        this.getProductionListByFreelancerId()

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
   
        this.getProductionListByFreelancerId()
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
    getProductionListByFreelancerId() {
        let that = this
        REST.get({
            url: API.getByLoginUser,
            data: {
                currentPage: this.data.currentPage,
                pageSize: 10000
            },
            success:(res)=> {
                if(!res.data) return
                let productionList=[]
                for(let i=0;i<res.data.length;i++){
                    if(res.data[i].status == 40)
                    productionList.push(res.data[i])
                }
                this.setData({
                    productionList
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },
    //切换事件
    tapChooseRadio(e){
        let index = e.currentTarget.dataset.index
        let orderId = e.currentTarget.dataset.orderid

        this.setData({
            chooseRadioIndex: index,
            canClick:true,
            orderId:orderId
        }) 
    },
    //跳转到作品详情
    tapToProductDetails(e){
        wx.navigateTo({
            url: '/pages/myproductDetails/myproductDetails?prodId='+e.currentTarget.dataset.prodId,
        })
    },
  //返回上一页
    tapCancle(){
        wx.navigateBack({
            delta: 1
        })
    },
    //接单
    tapReceiveOrder(e) {
        if(!this.data.canClick){
            wx.showToast({
                title: '请选择一项接单所需要的服务',
                icon: 'none',
                duration: 2000
            });
            return
        }

        REST.post({
            url: API.recommend,
            data: {
                demandId: this.data.demandId,
                productionIds: [this.data.orderId+""]
            },
            success:(res)=> {
                app.globalData.selectedTab = 0 
                wx.showToast({
                    title: '接单成功',
                    duration: 1000
                })
                setTimeout(() => {
                    wx.switchTab({
                        url: '/pages/mine/mine',
                        success: function (e) {
                            // let page = getCurrentPages().pop();
                            // if (page == undefined || page == null) {
                            //     return
                            // };
                            // page.getDemandListByEmployerId();
                        }
                    })  
                }, 2000);
            
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },
})