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
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/common/star/icon-normal.png',   
    half_0_1_point5_src:"/images/common/star/icon-half-0.5-1.5.png",
    half_2_point5_src:"/images/common/star/icon-half-2.5.png",
    half_3_point5_src:"/images/common/star/icon-half-3.5.png",
    half_4_point5_src: '/images/common/star/icon-half-4.5.png',
    selected_1_2_src: '/images/common/star/icon-selected-1-2.png',
    selected_3_src: '/images/common/star/icon-selected-3.png',
    selected_4_src: '/images/common/star/icon-selected-4.png',
    selected_5_src: '/images/common/star/icon-selected-5.png',

    half:'',
    selected:'',
    key: 0,//评分
    starMinX:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
      wx.createSelectorQuery().select('#box').boundingClientRect((res)=>{
            console.log(res)
            this.setData({
              starMinX: res.left
            })
      }).exec()
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


    })

  },
  openMessage(e) {
    let tmplids = e.currentTarget.dataset.tmplids
    wx.requestSubscribeMessage({

      tmplIds: [tmplids], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个

      success(res) {

        //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁

      }

    })
  },
   //点击左边,半颗星
   
   selectLeft: function (e) {
   
    var key = e.currentTarget.dataset.key
   
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
   
     //只有一颗星的时候,再次点击,变为0颗
   
     key = 0;
   
    }
   
        console.log("得" + key + "分")
      
        if(key == 0.5){
              this.setData({key:key,half :this.data.half_0_1_point5_src,selected :this.data.selected_1_2_src})
        }else if(key == 1.5){
              this.setData({key:key,half :this.data.half_0_1_point5_src,selected :this.data.selected_1_2_src})
        }else if(key == 2.5){
              this.setData({key:key,half :this.data.half_2_point5_src,selected :this.data.selected_3_src})
        }else if(key == 3.5){
              this.setData({key:key,half :this.data.half_3_point5_src,selected :this.data.selected_4_src})
        }else if(key == 4.5){
              this.setData({key:key,half :this.data.half_4_point5_src,selected :this.data.selected_5_src})
        }
   
   },
   
   //点击右边,整颗星
   
   selectRight: function (e) {
   
    var key = e.currentTarget.dataset.key
   
    console.log("得" + key + "分")

        if(key ==1){
            this.setData({key:key,selected :this.data.selected_1_2_src,half :this.data.half_0_1_point5_src})
        }else if(key ==2){
            this.setData({key:key,selected :this.data.selected_1_2_src,half :this.data.half_0_1_point5_src})
        }else if(key == 3){
            this.setData({key:key,selected :this.data.selected_3_src,half :this.data.half_2_point5_src})
        }else if(key == 4){
            this.setData({key:key,selected :this.data.selected_4_src,half :this.data.half_3_point5_src})
        }else if(key == 5){
            this.setData({key:key,selected :this.data.selected_5_src,half :this.data.half_4_point5_src})
        }
   
   },
  changeScore(e){
      
   // console.log(e)
      var that = this;
      var num = 0;//临时数字,动态确定要传入的分数
      var touchX = e.touches[0].pageX;//获取当前触摸点X坐标
     
      var starMinX = this.data.starMinX;//最左边第一颗星的X坐标
      var starWidth = 50;//星星图标的宽度
      var starLen = 25;//星星之间的距离
      var starMaxX = starWidth * 5 + starLen * 4 + this.data.starMinX;//最右侧星星最右侧的X坐标,需要加上5个星星的宽度和4个星星间距 和起始位置的坐标
     // console.log("touchX: "+touchX+ ", starMinX:" + starMinX + ", starMaxX: "+ starMaxX);
      if (touchX > starMinX && touchX < starMaxX) {//点击及触摸的初始位置在星星所在空间之内
            //使用Math.ceil()方法取得当前触摸位置X坐标相对于(星星+星星间距)之比的整数,确定当前点击的是第几个星星
            num = (touchX - starMinX) / (starWidth + starLen);          
            if(0 <=num && num <= 0.5){
               this.setData({key: 0.5,half:this.data.half_0_1_point5_src})
            }else if(0.5 <num && num<= 1){
               this.setData({key: 1,selected:this.data.selected_1_2_src})
            }else if(1 <num && num<= 1.5){
               this.setData({key: 1.5,half:this.data.half_0_1_point5_src})
            }else if(1.5 <num && num<= 2){
               this.setData({key: 2,selected:this.data.selected_1_2_src})
            }else if(2 <num && num<= 2.5){
               this.setData({key: 2.5,half:this.data.half_2_point5_src,selected :this.data.selected_3_src})
            }else if(2.5 <num && num<= 3){
               this.setData({key: 3,selected:this.data.selected_3_src})
            }else if(3 <num&& num <= 3.5){
               this.setData({key: 3.5,half:this.data.half_3_point5_src,selected :this.data.selected_4_src})
            }else if(3.5 <num && num<= 4){
               this.setData({key: 4,selected:this.data.selected_4_src})
            }else if(4 <num && num<= 4.5){
               this.setData({key: 4.5,half:this.data.half_4_point5_src,selected :this.data.selected_5_src})
            }else if(4.5 <num && num<= 5){
               this.setData({key: 5,selected:this.data.selected_5_src})
            }else if(5 <num){
               this.setData({key: 5,selected:this.data.selected_5_src})
            }
            
      }else if(touchX < starMinX){//如果点击或触摸位置在第一颗星星左边,则恢复默认值,否则第一颗星星会一直存在
           this.setData({key: ''})
      }

  }
  
})