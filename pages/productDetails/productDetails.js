// pages/worksDetail/worksDetail.js
const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
const area = require("../../utils/area");
const util = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIosSystem:app.isIosSystem,
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
        currentPage:1,

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
        let code = this.data.code
        let productionId = this.data.productionId //作品ID
        return {
            path:  '/pages/productDetails/productDetails?code=' + code + '&productionId='+id,
            success: function (res) {
              　// 转发成功之后的回调
    　　　　　　 if(res.errMsg == 'shareAppMessage:ok'){
    　　　　　　 }
            },
            fail: function (res) {
              // 转发失败
            }
        }
    },
    //获取数据
    loadData(){
        REST.noVerfiyget({
            url: API.getProdDetail,
            data:{ id : this.data.productionId },
            success: res => {


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
            // if (freelancerInfo.provinceCode != '110000' && freelancerInfo.provinceCode != '120000' && freelancerInfo.provinceCode != '500000' && freelancerInfo.provinceCode != '310000' ) {
            //     areaName += area.default.province_list[Number(freelancerInfo.provinceCode)] + ','
            // }
            areaName += area.default.province_list[Number(freelancerInfo.provinceCode)] + ','

            areaName += area.default.city_list[Number(freelancerInfo.cityCode)] + ',' + area.default.county_list[Number(freelancerInfo.districtCode)]

            this.setData({
                [`data.freelancerInfo.areaName`]: areaName 
            })
        }
    },
    loadEvaluationInfo() {
        REST.noVerfiyget({
            url: API.findOverallEvaluationByCateAndFreelancer,
            data:{ 
                jobCateId : this.data.data.jobCateId,
                freelancerId : this.data.data.freelancerId
            },
            success: res => {
                let keys=[
                    {id:'responseSpeed',value:res.responseSpeed},
                    {id:'communicateCapacity',value:res.communicateCapacity},
                    {id:'completionTime',value:res.completionTime},
                    {id:'accomplishQuality',value:res.accomplishQuality},
                    {id:'recommendScore', value:res.recommendScore}
                    ]

                for(let i = 0;i < keys.length;i++){
                    if(keys[i].value <= 0.5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}half`] :this.data.half_0_1_point5_src,[`${keys[i].id}selected`] :this.data.selected_1_2_src})
                    }else if(keys[i].value <=1){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}selected`] :this.data.selected_1_2_src,[`${keys[i].id}half`] :this.data.half_0_1_point5_src})
                    }else if(keys[i].value <= 1.5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}half`] :this.data.half_0_1_point5_src,[`${keys[i].id}selected`] :this.data.selected_1_2_src})
                    }else if(keys[i].value <=2){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}selected`] :this.data.selected_1_2_src,[`${keys[i].id}half`] :this.data.half_0_1_point5_src})
                    }else if(keys[i].value <= 2.5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}half`] :this.data.half_2_point5_src,[`${keys[i].id}selected`] :this.data.selected_3_src})
                    }else if(keys[i].value <= 3){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}selected`] :this.data.selected_3_src,[`${keys[i].id}half`] :this.data.half_2_point5_src})
                    }else if(keys[i].value <= 3.5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}half`] :this.data.half_3_point5_src,[`${keys[i].id}selected`] :this.data.selected_4_src})
                    }else if(keys[i].value <= 4){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}selected`] :this.data.selected_4_src,[`${keys[i].id}half`] :this.data.half_3_point5_src})
                    }else if(keys[i].value <= 4.5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}half`] :this.data.half_4_point5_src,[`${keys[i].id}selected`] :this.data.selected_5_src})
                    }else if(keys[i].value <= 5){
                        this.setData({[`${keys[i].id}key`]:keys[i].value,[`${keys[i].id}selected`] :this.data.selected_5_src,[`${keys[i].id}half`] :this.data.half_4_point5_src})
                    }
                }
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
        REST.noVerfiyget({
            url: API.findByCateAndFreelancer,
            data:{ 
                jobCateId : this.data.data.jobCateId,
                freelancerId : this.data.data.freelancerId,
                currentPage:1,
                pageSize:3,
                storeSort:0 ,//10降序 ，20 升序
                timeSort:0 ,//10降序 ，20 升序
            },
            success: res => {
                let keys = res.data
                
                for(let i = 0;i < keys.length;i++){
                    keys[i].i = i

                    if(keys[i].totalScore <= 0.5){
                        keys[i].half = this.data.half_0_1_point5_src
                        keys[i].selected=this.data.selected_1_2_src
                    }else if(keys[i].totalScore <=1){
                        keys[i].half = this.data.half_0_1_point5_src
                        keys[i].selected=this.data.selected_1_2_src
                    }else if(keys[i].totalScore <= 1.5){
                        keys[i].half = this.data.half_0_1_point5_src
                        keys[i].selected=this.data.selected_1_2_src
                    }else if(keys[i].totalScore <=2){
                        keys[i].half = this.data.half_0_1_point5_src
                        keys[i].selected=this.data.selected_1_2_src
                    }else if(keys[i].totalScore <= 2.5){
                        keys[i].half = this.data.half_2_point5_src
                        keys[i].selected=this.data.selected_3_src
                    }else if(keys[i].totalScore <= 3){
                        keys[i].half = this.data.half_2_point5_src
                        keys[i].selected=this.data.selected_3_src
                    }else if(keys[i].totalScore <= 3.5){
                        keys[i].half = this.data.half_3_point5_src
                        keys[i].selected=this.data.selected_4_src
                    }else if(keys[i].totalScore <= 4){
                        keys[i].half = this.data.half_3_point5_src
                        keys[i].selected=this.data.selected_4_src
                    }else if(keys[i].totalScore <= 4.5){
                        keys[i].half = this.data.half_4_point5_src
                        keys[i].selected=this.data.selected_5_src
                    }else if(keys[i].totalScore <= 5){
                        keys[i].half = this.data.half_4_point5_src
                        keys[i].selected=this.data.selected_5_src
                    }
                }

                this.setData({
                    evaluationOrderInfos:keys
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
    // 点击图片
    tapEvaluateBanner(e) {
        let current =  e.currentTarget.dataset.item
        let index =  e.currentTarget.dataset.index

        let urls = []
        for (let item of this.data.evaluationOrderInfos[index].images) {
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
                    res.forEach(item => {
                        item.description = util.deleteHtmlTag(item.description)
                    })

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

    //跳转到全部评价页面
    tapEvaluateList(e){
        wx.navigateTo({
          url: '/pages/evaluateList/evaluateList?jobCateId='+this.data.data.jobCateId +"&freelancerId="+this.data.data.freelancerId,
        })
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
        let budgetType = this.data.data.budgetType //计算方式
        let hourlyWage = this.data.data.hourlyWage //时薪
        let provinceCode = this.data.data.freelancerInfo.provinceCode // 省
        let cityCode = this.data.data.freelancerInfo.cityCode // 城市
        let districtCode = this.data.data.freelancerInfo.districtCode // 区
        wx.requestSubscribeMessage({
            tmplIds: ['cv5hTnU_ABBjp8spFDvQacYttU2ZC3guvvJAoGKC8bA','0mfM9FVKOJzkD-tbXC9M1d5d5pfouIhjxDMBUzYogFI'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
            success:res=> {
                //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁
                wx.navigateTo({
                    url: '/pages/publishOrder/publishOrder?type=1&freelancerId='+id
                    +"&freelancerName="+name
                    +"&headImg="+headImg
                    +"&domainCateName="+domainCateName
                    +"&budgetType="+budgetType
                    +"&hourlyWage="+hourlyWage
                    +"&postCateId="+postCateId
                    +"&postCateName="+postCateName
                    +"&provinceCode="+provinceCode
                    +"&cityCode="+cityCode
                    +"&districtCode="+districtCode,
                })

            },
            fail:res=>{
            },
            complete:res=>{
            },
    
        })
     

    },
    //一键复制
    tapCopy(e){
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success (res) {
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
    },

})