const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
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
  
  

  async bindOrg(e) {
    console.log(e);
    let data = e.detail.value;
    if (data.agencyOrgId) {
      wx.removeStorageSync('code');
      let code = await Api.getCode();
      data.code = code;
      Api.caregiverBindOrg(JSON.stringify(data)).then(res => {
        console.log(res);
        that.showTips("申请挂靠成功,请等待机构审核", "success");
        app.globalData.status = { code: res.code, msg: res.msg, login: (res.data ? res.data.login : false), auth: (res.data ? res.data.auth : false) };
        that.setData({
          modalorg: false
        })
      }, err => {
        console.log(err);
        that.showTips(err.msg);
      })
    }
  }

})
