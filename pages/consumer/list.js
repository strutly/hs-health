const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    consumers:[],
    params:{pageNum:0,pageSize:8,name:''}
  },
  onLoad(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    that.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  getList(){
    let params = that.data.params;
    params.pageNum++;
    let consumers = that.data.consumers||[];
    Api.consumerList(params).then(res=>{
      console.log(res);
      
      that.setData({
        consumers:consumers.concat(res.data.content),
        endline:res.data.last,
        params: params
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  touchstart(e) {    
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  touchmove: function (e) {
    var index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 30) return;
    that.setData({
      move: touchMoveX < startX,
      moveIndex: touchMoveX < startX ? index : -1
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  submit(e){
    console.log(e);
    let params = that.data.params;
    params.pageNum=0;
    params.name = e.detail.value;
    that.setData({
      consumers:[],
      params:params
    })
    that.getList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})