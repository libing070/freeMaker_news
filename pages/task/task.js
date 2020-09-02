// pages/task/task.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        isFixedTop: false, //是否固定顶部
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
        if (this.data.navbarInitTop == 0) {
    
          //获取节点距离顶部的距离
          wx.createSelectorQuery().select('#navbar').boundingClientRect((rect)=> {
            if (rect && rect.top > 0) {
              var navbarInitTop = parseInt(rect.top);
              this.setData({
                navbarInitTop: navbarInitTop
              });
              console.log(this.data.navbarInitTop);
            }
          }).exec();
    
        }
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
        var that = this;
        var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    
        //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
        var isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
        //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
        if (that.data.isFixedTop === isSatisfy) {
          return false;
        }
    
        that.setData({
            isFixedTop: isSatisfy
        });

    }
})