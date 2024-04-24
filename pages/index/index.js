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
    let msgMap = { "1102": '您未授权,请先授权', "1101": "您不是照护师,请先注册" };
    console.log("show");
    getApp().watch(function (value) {
      console.log(value);
      wx.removeStorageSync('code');
      switch (value.code) {
        case "0":
          if (value.login && value.auth) {
            let loginEnd = that.data.loginEnd;
            if (!loginEnd) that.showTips('登录成功', 'success');
            that.setData({
              modalauth: false,
              loginEnd: true
            })
            that.getHomeData();
          } else {
            that.showTips("您未挂靠机构,请选择挂靠机构", "info");
            that.setData({
              modalorg: true
            })
          }
          break;
        case "401":
          console.log(401)
          that.showTips(msgMap[value.code]);
          that.setData({
            modalauth: true
          })
          break;
        case "1101":
          console.log(1101)
          that.showTips(msgMap[value.code]);
          that.setData({
            modalauth: true
          })
          break;
      }

    })
  },
  onReady() {
    console.log("ready");
    Api.getAllAgencyOrg().then(res => {
      that.setData({
        orgs: res.data
      })
    }, err => {
      that.showTips(err.msg);
    })
  },
  reg() {
    wx.navigateTo({
      url: '/pages/index/reg',
    })
  },
  getHomeData() {
    Api.homeData().then(res => {
      that.setData({
        homeData: res.data
      })
    }, err => {
      that.showTips(err.msg);
    })
  },
  pickerChange(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let formData = that.data.formData || {};
    formData[type] = e.detail.value;
    that.setData({
      formData: formData
    })
  },
  async getPhoneNumber(e) {
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      let code = await Api.getCode();
      Api.phone({
        encryptedData: e.detail.encryptedData,
        code: code,
        iv: e.detail.iv
      }).then(res => {
        console.log(res);
        app.globalData.status = { code: res.code, msg: res.msg, login: (res.data ? res.data.login : false), auth: (res.data ? res.data.auth : false) };
        if (res.data.auth && res.data.login) {
          wx.setStorageSync('token', res.data.token);
        } else {
          wx.removeStorageSync('code');
          wx.removeStorageSync('token');
          that.setData({
            modalauth: false
          })
        }

      }, err => {
        console.log(err);
        wx.removeStorageSync('code');
        //that.showTips(err.msg);
        that.setData({
          modalauth: false
        })
      })
    }
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
