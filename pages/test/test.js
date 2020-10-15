// pages/test/test.js
const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

const uploadFile = require("./../../utils/upload.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  upload() {
    uploadFile('demand', function (url) {

      console.log(url)

    })

  },
  openMessage(e) {
    let tmplids = e.currentTarget.dataset.tmplids
    wx.requestSubscribeMessage({

      tmplIds: [tmplids], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个

      success(res) {

        console.log(res) //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁

      }

    })
  }
})