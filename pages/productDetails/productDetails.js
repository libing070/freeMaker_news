// pages/worksDetail/worksDetail.js
const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
const area = require("../../utils/area");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        collect:false,
        currentPhotoIndex:1,
        freelancerId:0,
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
        currShadeItem:0,//
        data:{},
        evaluationInfo: {},
        evaluationDetailInfos: [],
        evaluationOrderInfos: [],
        currentPage:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            code:options.code,
            productionId:options.productionId, //作品ID
            one_1: this.data.num,
            two_1: 5 - this.data.num
        })
        console.log(this.data.code);
        this.loadData()
        this.loadOtherProudcts()
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
    //获取数据
    loadData(){
        REST.noVerfiyget({
            url: API.getProdDetail,
            data:{ id : this.data.productionId },
            success: res => {

                console.log(res);

                this.setData({
                    data:res
                })

                this.initAreaName()
                this.loadEvaluationInfo()
                this.loadEvaluationOrderInfo()
            },
            failed: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
    },
    initAreaName() {
        let freelancerInfo = this.data.data.freelancerInfo
        if (freelancerInfo.provinceCode != null && freelancerInfo.cityCode != null && freelancerInfo.districtCode != null) {
            let areaName = ''
            if (freelancerInfo.provinceCode != '110000' && freelancerInfo.provinceCode != '120000' && freelancerInfo.provinceCode != '500000' && freelancerInfo.provinceCode != '310000' ) {
                areaName += area.default.province_list[Number(freelancerInfo.provinceCode)] + ' '
            }

            areaName += area.default.city_list[Number(freelancerInfo.cityCode)] + ' ' + area.default.county_list[Number(freelancerInfo.districtCode)]

            this.setData({
                [`data.freelancerInfo.areaName`]: areaName 
            })
        }
    },
    loadEvaluationInfo() {
        REST.get({
            url: API.findOverallEvaluationByCateAndFreelancer,
            data:{ 
                jobCateId : this.data.data.jobCateId,
                freelancerId : this.data.data.freelancerId
            },
            success: res => {
                console.log(res);
                this.setData({
                    evaluationInfo:res
                })

            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
        
    },
    loadEvaluationOrderInfo() {
        REST.get({
            url: API.findByCateAndFreelancer,
            data:{ 
                jobCateId : this.data.data.jobCateId,
                freelancerId : this.data.data.freelancerId,
                recent: 3
            },
            success: res => {
                console.log(res);
                this.setData({
                    evaluationOrderInfos:res
                })

            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })

    },
    //其他作品
    loadOtherProudcts(){
        REST.noVerfiyget({
            url: API.getByCatePostOther,
            data:{
                productionId :  this.data.productionId,
                limit:6,
             },
            success: res => {
                this.setData({
                    otherProductdata:res
                })

                console.log(this.data.otherProductdata);
            },
            failed: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
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
        let current =  e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.data.images) {
            urls.push(item.fullPath)
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
        
        if (e.currentTarget.dataset.item== 3) {
            REST.get({
                url: API.findByCateAndFreelancer,
                data:{ 
                    jobCateId : this.data.data.jobCateId,
                    freelancerId : this.data.data.freelancerId
                },
                success: res => {
                    console.log('综合评价详情：');
                    console.log(res);
                    this.setData({
                        evaluationDetailInfos: res
                    })
    
                },
                fail: res => {
                    wx.showToast({
                        title: '获取失败',
                        icon: 'none',
                        duration: 2000
                    });
                },
            })
        }

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
            this.setData({
                showAuthModal:false,
                showAuthPhone:false
            })
        }
    },
    //mark: 重新登录
    Relogin(){
        this.setData({
         showAuthModal:true
        })
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
        let id = this.data.data.freelancerInfo.id  //自由职业者id
        let name = this.data.data.freelancerInfo.name //自由职业者名称
        let headImg = this.data.data.freelancerInfo.headImg //头像url
        let domainCateName = this.data.data.domainCate.cateName //领域名称
        let postCateId = this.data.data.postCate.id //岗位ID
        let postCateName = this.data.data.postCate.cateName //岗位名称
        let hourlyWage = this.data.data.hourlyWage //时薪
        let provinceCode = this.data.data.freelancerInfo.provinceCode // 省
        let cityCode = this.data.data.freelancerInfo.cityCode // 城市
        let districtCode = this.data.data.freelancerInfo.districtCode // 区
        wx.navigateTo({
          url: '/pages/publishOrder/publishOrder?type=1&freelancerId='+id
          +"&freelancerName="+name
          +"&headImg="+headImg
          +"&domainCateName="+domainCateName
          +"&hourlyWage="+hourlyWage
          +"&postCateId="+postCateId
          +"&postCateName="+postCateName
          +"&provinceCode="+provinceCode
          +"&cityCode="+cityCode
          +"&districtCode="+districtCode,
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
    },
    //一键呼叫
    freeTell(e){
        let content = e.currentTarget.dataset.content;
        wx.makePhoneCall({

            phoneNumber: content,
      
          })
    },
    //其他作品跳转
    tapToWorksDetail(e){
        let code = e.currentTarget.dataset.code
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/productDetails/productDetails?code=' + code + '&productionId='+id,
        })
    }

})