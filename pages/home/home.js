const app = getApp()
Page({

      /**
       * 页面的初始数据
       */
      data: {
          safeBottom:app.safeBottom,
          list:[
              { id: 1, name: '11111' ,collect:true},
              { id: 2, name: '22222' ,collect:true },
              { id: 3, name: '33333' ,collect:false},
              { id: 4, name: '44444' ,collect:true},
              { id: 5, name: '55555' ,collect:false},
              { id: 6, name: '66666' ,collect:true},
              { id: 7, name: '77777' ,collect:false},
              { id: 8, name: '88888' ,collect:true},
              { id: 9, name: '99999' ,collect:false},
              { id: 10, name: '10101' ,collect:false},
          ]
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
      changeName(event) {
          console.log(event.detail)
      }
})