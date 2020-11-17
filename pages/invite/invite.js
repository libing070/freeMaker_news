// pages/invite/invite.js
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
        scanImage:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.showShareMenu({
        //   withShareTicket: true,
        //   menus: ['shareAppMessage', 'shareTimeline']
        // })
        let allP=[]
        allP.push(this.loadBg())
        allP.push(this.referralCode())
        allP.push(this.myRecord())

        Promise.all(allP).then((result) => {
            this.loadAvatar()
        }).catch((error) => {

        })
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
      return {
        title: 'HowWork',
        path: '/pages/home/home',
        imageUrl:'/images/mine/1.png'
      }
    },
    // //用户点击右上角分享朋友圈
    // onShareTimeline: function () {
    //   return {
    //       title: 'HowWork',
    //       query: '/pages/home/home',
    //       imageUrl: '/images/mine/1.png'
    //     }
    // },
    //获取战绩
    myRecord(){
      return new Promise((resolve, reject) => {
        REST.get({ 
            url: API.myRecord,
            success: res => {
                this.setData({
                  productionPass:res.productionPass,
                  publishProduction:res.publishProduction,
                  recommended:res.recommended

                })  
                resolve()
            },
            fail: res => {
                wx.showToast({
                    title: '获取战绩失败',
                    icon: 'none',
                    duration: 2000
                });
                reject()
            },
        }) 
    })
    },
    //获取当前用户专属太阳码
    referralCode(){
        return new Promise((resolve, reject) => {
            REST.get({ 
                url: API.referralCode,
                success: res => {
                    this.setData({
                        scanImage:res
                    })  
                    resolve()
                },
                fail: res => {
                    wx.showToast({
                        title: '获取太阳码失败',
                        icon: 'none',
                        duration: 2000
                    });
                    reject()
                },
            }) 
        })
      
    },
    loadBg(){
        return new Promise((resolve, reject) => {
            // 下载文件
            wx.downloadFile({
                url: 'https://howwork-1301749332.cos.ap-beijing.myqcloud.com/user/2020-11-11/wxebd3588df98ae1a7.o6zAJs6MrGfeTqciNsKbK7FuwdHM.VUTMgg9N3ycR2b16297005b6984ec685da198bd09b1d.jpg',
                success: res => {

                    if (res.statusCode == 200) {
                        this.setData({
                            bg:res.tempFilePath
                        })
                        resolve()
                    } else {
                        
                    }
                },
                fail: res => {
                    reject()
                },
            })
        })

    },
    loadAvatar(){
      // 下载文件
      wx.downloadFile({
        url: this.data.scanImage,
        success: res => {

            if (res.statusCode == 200) {
                this.scanPath = res.tempFilePath

                this.startDraw()

            } else {
                
            }
        },
        fail: res => {
           
        },
      })
    },
    //开始绘分享卡片内容
    startDraw(){
      let width = 340, height = 506
      this.setData({
          canvasSize: `width: ${width}px; height: ${height}px;`,
      },() => {
          let context = wx.createCanvasContext('poster', this)
              // 圆角白底
              context.moveTo(0, 20)
              context.arcTo(0, 0, 0, 0, 0)
              context.arcTo(width, 0, width, 0, 0)
              context.arcTo(width, height, width - 0, height, 0)
              context.arcTo(0, height, 0, height - 0, 0)
              context.closePath()
              context.fillStyle = 'white'
              context.fill()

              context.save()
              context.drawImage(this.data.bg, 0, 0,width,height)
              context.drawImage(this.scanPath, 230, 410,80,80)

              context.draw(true, res => {
                  if (res.errMsg == "drawCanvas:ok") {
                      // 导出文件
                      wx.canvasToTempFilePath({
                          canvasId: 'poster',
                          destWidth: width * 2,
                          destHeight: height * 2,
                          success: res => {
                              this.setData({
                                  canvasSize: null,
                                  poster: res.tempFilePath,
                              })
                              console.log(this.data.poster)
                          },
                          fail: res => {
                          }
                      }, this)

                  } else {
                  }
              })
      })
  
      
    },
    // 保存到相册
    savePoster() {
      if(!this.data.poster){
        wx.showToast({
            title: '请稍后...',
            icon: 'none',
        })
        return
      }
      if (this.posterSaved) {
          wx.showToast({
              title: '已经保存过了',
              icon: 'none',
          })
          return
      }

      let imagePath = this.data.poster

      wx.showLoading({
          title: '正在保存',
          mask: true,
      })

      // 判断权限
      wx.getSetting({
          success: res => {
              let auth = res.authSetting['scope.writePhotosAlbum']

              if (auth === true) {
                  save()

              } else if (auth === false) {
                 // preview()

              } else {
                  // 获取权限
                  wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success: res => {
                          save()
                      },
                      fail: res => {
                       //   preview()
                      }
                  })
              }
          },
      })

      let save = () => {
          wx.saveImageToPhotosAlbum({
              filePath: imagePath,
              success: res => {
                  this.posterSaved = true

                  wx.showToast({
                      title: '已保存至系统相册',
                      icon: 'none',
                  })
              },
              fail: res => {
                  wx.showToast({
                      title: '保存失败，请重试',
                      icon: 'none',
                  })
              }
          })
      }

      let preview = () => {
          wx.hideLoading()

          wx.showModal({
              title: '提示',
              content: '长按图片保存到相册哦～',
              showCancel: false,
              confirmColor: '#FA2878',
              confirmText: '我知道了',
              success: res => {
                  wx.previewImage({
                      urls: [imagePath]
                  })
              }
          })
      }
    },
})