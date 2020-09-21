// pages/uploadTest/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

      imageList:[],
      canvasShowing:true

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
    upload(){
        var that = this;
        wx.chooseImage({
            count: 4,  //这个是上传的最大数量，默认为9
            sizeType: ['compressed'],  //这个可以理解为上传的图片质量类型（官方给的），虽然没什么卵用，要不然还要我们自己写压缩做什么
            sourceType: ['album', 'camera'],  //这个是图片来源，相册或者相机
            success: function (res) {
                var tempFilePaths = res.tempFilePaths  //这个是选择后返回的图片列表
              
                that.getCanvasImg(0, 0, tempFilePaths);  //进行压缩

            } 
        });
    },
     //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
    getCanvasImg: function (index,failNum, tempFilePaths){
        var that = this;
     
        if (index < tempFilePaths.length){

            //获得原始图片大小
            wx.getImageInfo({
                src: tempFilePaths[index],
                success(res) {
                    var originWidth, originHeight;
                    originHeight = res.height;
                    originWidth = res.width;

                    var targetWidth = 750
                    //压缩比例
                    let ratio=originWidth/originHeight
                    let targetHeight=targetWidth/ratio
                    // //压缩比例
                    // // 最大尺寸限制
                    // var maxWidth = 750,maxHeight = 600;
                    // // 目标尺寸
                    // var targetWidth = originWidth,
                    //   targetHeight = originHeight;
                    // //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
                    // if (originWidth > maxWidth || originHeight > maxHeight) {
                    //     if (originWidth / originHeight > maxWidth / maxHeight) {
                    //         // 要求宽度*(原生图片比例)=新图片尺寸
                    //         targetWidth = maxWidth;
                    //         targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    //     } else {
                    //         targetHeight = maxHeight;
                    //         targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    //     }
                    // }
                    that.setData({
                        canvasSize: `width: ${targetWidth}px; height: ${targetHeight}px;`,
                    },()=>{
                        const ctx = wx.createCanvasContext('attendCanvasId');
                        ctx.clearRect(0, 0, targetWidth, targetHeight);
                        ctx.drawImage(tempFilePaths[index], 0, 0, targetWidth, targetHeight);
                        ctx.draw(true, function () {
                            index = index + 1;//上传成功的数量，上传成功则加1
                            wx.canvasToTempFilePath({
                                canvasId: 'attendCanvasId',
                                success: function success(rest) {
                                  //  that.uploadCanvasImg(res.tempFilePath);
                                  console.log(rest.tempFilePath);
                                    that.setData({
                                        imageList: that.data.imageList.concat(rest.tempFilePath)
                                    },()=>{
                                        that.getCanvasImg(index,failNum,tempFilePaths);
                                    })
                                }, fail: function (e) {
                                    failNum += 1;//失败数量，可以用来提示用户
                                    that.getCanvasImg(inedx,failNum,tempFilePaths);
                                }
                            });
                        });
                    })

                }
            })

        }
   },
})