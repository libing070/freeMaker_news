// pages/worksDetail/worksDetail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        collect:false,
        currentPhotoIndex:1,
        obj:{
            imgList:["//img14.360buyimg.com/pop/jfs/t1/114735/33/2427/35818/5ea17d3aE7018d774/acf7950db4ef2c51.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/88961/36/19902/34141/5ea17d3aEf82710e9/6465b378faf4ea0b.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/111272/19/2307/93015/5ea17d3aEb521c837/7b9ac8fb948993f0.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/110316/1/13554/178993/5ea17d3aE88af5e39/1e6dfb8dfb8259f6.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/119502/34/1004/98273/5ea17d49Ed74b4fa5/49e7bdfc7ab97813.png"]
        },
        num: 4,//后端给的分数，显示的星星
        one_1: '',//点亮的星星数
        two_1: '',//没有点亮的星星数
        shadeShowing:false,
        currShadeItem:0,//当前点击弹窗的信息集合
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            one_1: this.data.num,
            two_1: 5 - this.data.num
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
        // mark: 登录成功
    loginSuccess(login) {
        this.setData({
            user: app.user,  
        })
        if(login){
               //do something.....
        }
    },
    tapCollect(e){
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        this.setData({
            collect:!this.data.collect
        })

        if(this.data.collect){
            wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 2000
            });
        }else{
            wx.showToast({
                title: '已取消收藏',
                icon: 'none',
                duration: 2000
            });  
        }
    },
    //切换图片
    changeSwiper(e) {
        let currentPhotoIndex = e.detail.current + 1
        this.setData({
            currentPhotoIndex
        })

    },
    // 点击图片
    tapBanner(e) {
        let current = 'http:' + e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.obj.imgList) {
            urls.push('http:' + item)
        }

        wx.previewImage({
            current,
            urls,
        })
    },

    //显示隐藏
    shadeShowing(e) {
        let currShadeItem = e.currentTarget.dataset.item;
        this.setData({
            currShadeItem
        })
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing
            });
        }

    },
    //购买服务事件(发布需求)
    tapToPublishDemand(e){
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        }
        wx.navigateTo({
          url: '/pages/publishDemand/publishDemand?type=1',
        })
    },
    //一键复制
    tapCopy(e){
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success (res) {
                console.log(res);
            }
        })
    }

})