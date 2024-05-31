var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
import wxCharts from "../../utils/wxChart";
CustomPage({

  data: {
    statisticsData:{size:0,total:0}
  },

  onLoad(options) {
    that = this;
  },

  onReady() {
    Api.statistics().then(res => {
      console.log(res)
      that.setData({
        statisticsData:res.data
      })
      that.showPie(res.data.chartDataList||[]);
    }, err => {
      that.showTips(err.msg);
    })
  },
  showPie(data) {
    console.log(data.map(item=>item.data))
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      return that.showToast("统计图生成失败");
    }
    new wxCharts({
      animation: true,
      canvasId: 'myChart',
      type: 'column',
      animation: true,
      categories: data.map(item=>item.name),
      series: [{
        name: '服务数量',
        data: data.map(item=>item.data)
      }],
      yAxis: {        
        title: '次数',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 300,
    })
  },
  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})