// pages/demandDetails/demandDetails.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom:app.safeBottom,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


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
    tapToPushUserList(){
        wx.navigateTo({
            url: '/pages/pushUserList/pushUserList',
        })
    },
    //关闭需求
    tapCloseDemand(){
        wx.showModal({
            title: '提示信息',
            content: '确认关闭当前需求吗？',
            showCancel: true,
            confirmColor: '#FFBA20',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    wx.showToast({
                        title: '需求已关闭',
                        icon: 'none',
                        duration: 2000
                    }); 
                }
            },
        })
    },
    //跳转到需求编辑页面（发布需求页面）
    tapEditDemand(){
        wx.navigateTo({
            url: '/pages/publishDemand/publishDemand?type=0',
        })
    },
})