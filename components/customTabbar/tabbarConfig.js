const app = getApp()
module.exports = {
    safeBottom:app.safeBottom,
    shadeShowing:false,
    tabStyle: {
        //触发时的文字颜色
        activeColor: '#0C2032',
        //未触发时的文字颜色
        inactiveColor: '#8B959D',
    },

    tabs: [
        {
            "content": "首页", //显示的文字（可选）
            "activeImg": "/images/common/tabbar_home_s_2x.png", //触发时的图片（可选，如没有的话不会显示图片）
            "inactiveImg": "/images/common/tabbar_home_n_2x.png", //未触发时的图片（如果没有activeImg不会生效）
            "data": "/pages/home/home", //按钮对应的路径
        },
        {
            "content": "我的",
            "activeImg": "/images/common/tabbar_my_s_2x.png",
            "inactiveImg": "/images/common/tabbar_my_n_2x.png",
            "data": "/pages/mine/mine"
        },
    ],
}