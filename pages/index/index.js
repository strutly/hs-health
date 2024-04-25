var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    num: 0,
    homeData: { messageNum: 0 }
  },
  onLoad() {
    that = this;
  },
  onShow() {
    console.log("show");
    getApp().watch(function (value) {
      console.log(value);
      wx.removeStorageSync('code');
      if(value.login && value.auth){
        that.getHomeData();
      }else if(!value.auth){
        that.setData({
          modalauth:true
        })
      }else{
        that.showTips(value.msg);
      }
    })
  },
  onReady() {
    console.log("ready");
    
  },  
  getHomeData() {
    Api.homeData().then(res => {
      that.setData({
        homeData: res.data
      })
    }, err => {
      console.log(err);
      that.showTips(err.msg);
      if(err.code=="1101"){
        that.setData({
          modalauth:true
        })
      }else if(err.code=="1102"){
        that.setData({
          modalorg:true
        })
      }
    })
  },
})
