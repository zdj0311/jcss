<template>
  <div class="charts">
    <canvas ref="myChart" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
  import F2 from '@antv/f2'
  
  const config = [
    'padding',
    'animate'
  ]
  const methodConfig = [
    'legend'
  ]
  let jcharts = {}
  
  export default {
    name: 'charts',
    props: {
      width: {
        type: String,
        default: '320'
      },
      height: {
        type: String,
        default: '200'
      },
      source: {
        type: Array,
        require: true
      },
      geom: {
        type: String,
        default: 'interval',
        validator: val=> ['pie','interval','line'].indexOf(val) > -1
      },
      type: {
        type: String
      },
      padding: [Number,Array,String],
      animate: {
        type: Boolean,
        default: false
      },
      legend: {
        type: Boolean,
        default: false
      },
      color: String
    },

    data() {
      return {
        
      };
    },
    
    mounted() {
      // 饼图 
      if(this.geom === 'pie') {
        jcharts = this.$refs.myChart
        let merge = {
          id: jcharts,
          pixelRatio: window.devicePixelRatio // 指定分辨率
        }
        config.forEach((item,index)=>{
          merge[item] = this[item]
        })
        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart(merge)
        // Step 2: 载入数据源
        chart.source(this.source, {
          x: {
            formatter: function formatter(val) {
              return val * 100 + '%';
            }
          }
        })
        chart.legend({
          position: 'right',
          itemFormatter: function itemFormatter(val) {
            return val;
          }
        });
        chart.tooltip(false); // 提示工具
        chart.coord('polar', {
          transposed: true,
          radius: 0.85
        });
        chart.axis(false);
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart.interval().position('x*y').color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']).adjust('stack').style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        }).animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });
        // Step 4: 渲染图表
        chart.render();
      }else { // 柱图 折线图
        jcharts = this.$refs.myChart
        let merge = {
          id: jcharts,
          pixelRatio: window.devicePixelRatio // 指定分辨率
        }
        config.forEach((item,index)=>{
          merge[item] = this[item]
        })
        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart(merge)
        // Step 2: 载入数据源
        chart.source(this.source)
        methodConfig.forEach((item,index)=>{
          if(this[item]) chart[item]()
        })
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart[this.geom]().position('x*y').color(this.color?this.color:'x')
        // Step 4: 渲染图表
        chart.render();
      }
    },

    methods: {
      
    }
  }

</script>
