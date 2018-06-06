/**
 * 时间格式化
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 百度坐标系转腾讯坐标系
 */
const BdmapEncryptToMapabc = (bd_lat, bd_lon) => {
  var point = new Object();
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = new Number(bd_lon - 0.0065);
  var y = new Number(bd_lat - 0.006);
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var Mars_lon = z * Math.cos(theta);
  var Mars_lat = z * Math.sin(theta);
  point.lng = Mars_lon;
  point.lat = Mars_lat;
  return point;  
}

/**
 * 腾讯坐标系转百度坐标系
 */
const MapabcEncryptToBdmap = (gg_lat, gg_lon) => {
  var point = new Object();
  // var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  // var x = new Number(gg_lon);
  // var y = new Number(gg_lat);
  // var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  // var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  // var bd_lon = z * Math.cos(theta) + 0.0065;
  // var bd_lat = z * Math.sin(theta) + 0.006;
  point.lng = gg_lon + 0.1;
  point.lat = gg_lat - 0.08;
  return point;
}

/**
 * 暴露接口
 */
module.exports = {
  formatTime: formatTime,
  BdmapEncryptToMapabc: BdmapEncryptToMapabc,
  MapabcEncryptToBdmap: MapabcEncryptToBdmap
}
