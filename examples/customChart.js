const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const startAndListen = require('./listen');
const {
  FFCreatorCenter,
  echarts,
  FFText,
  FFChart,
  FFScene,
  FFImage,
  FFGifImage,
  FFCreator,
} = require('../');

const createFFTask = async () => {
  const bg1 = path.join(__dirname, './assets/imgs/bg/07.jpg');
  const bg2 = path.join(__dirname, './assets/imgs/bg/01.jpeg');
  const logo2 = path.join(__dirname, './assets/imgs/logo/dl-logo.png');
  const img1 = path.join(__dirname, './assets/imgs/mario.png');
  const cart = path.join(__dirname, './assets/imgs/gif/cart.gif');
  const hert = path.join(__dirname, './assets/imgs/gif/hert.gif');
  const rock = path.join(__dirname, './assets/imgs/rock.png');
  // const data1 = path.join(__dirname, './assets/data/country.json');
  const dataJson = path.join(__dirname, './assets/data/life-expectancy-table.json');
  const audio = path.join(__dirname, './assets/audio/05.wav');
  const font2 = path.join(__dirname, './assets/font/font2.ttf');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const width = 576;
  const height = 1024;
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    // debug: true,
    // ffmpeglog: true,
    highWaterMark: '3mb',
    parallel: 8,
    // audio,
    ext: 'mov',
    cacheFormat: 'png',
    defaultOutputOptions: {
      merge: false,
      options: [
        // '-hide_banner', // hide_banner - parameter, you can display only meta information
        // '-map_metadata',
        // '-1',
        // '-map_chapters',
        // '-1',
        // '-profile:v',
        // 'main',
        // '-c:v',
        // 'libx264',
        '-vcodec',
        'qtrle',
        // '-pix_fmt',
        // 'yuva420p',
        // '-movflags',
        // 'faststart',
        // '-r',
        // '30'
      ]
    },
    // render: 'gl'
  });

  // create FFScene
  const scene1 = new FFScene();
  // const scene2 = new FFScene();
  // scene1.setBgColor('green');
  // scene2.setBgColor('#b33771');

  // add scene1 background
  // const fbg1 = new FFImage({path: bg1, x: width / 2, y: height / 2});
  // scene1.addChild(fbg1);

  ///////////////////////////////////////////////////////////////////////////////////
  //
  //    FFChart Demo
  //    文档: https://tnfe.github.io/FFCreator/#/guide/chart
  //    配置: https://echarts.apache.org/examples/zh/editor.html?c=bar-race-country
  //
  ///////////////////////////////////////////////////////////////////////////////////


  // const option = {
  //   // Make gradient line here
  //   // visualMap: [
  //   //   {
  //   //     show: false,
  //   //     type: 'continuous',
  //   //     seriesIndex: 0,
  //   //     min: 0,
  //   //     max: 400
  //   //   }
  //   // ],
  //   // title: [
  //   //   {
  //   //     left: 'center',
  //   //     text: '基金净值走势图'
  //   //   }
  //   // ],
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   xAxis: [
  //     {
  //       data: dateList
  //     },
  //   ],
  //   yAxis: [
  //     {},
  //   ],
  //   grid: [
  //     {
  //       // bottom: '60%'
  //     },
  //   ],
  //   series: [
  //     {
  //       type: 'line',
  //       name: '本基金',
  //       showSymbol: false,
  //       endLabel: {
  //         show: true,
  //         formatter: function (params) {
  //           return params.seriesName;
  //         }
  //       },
  //       data: valueList,
  //     },
  //     {
  //       type: 'line',
  //       name: '业绩基准',
  //       showSymbol: false,
  //       endLabel: {
  //         show: true,
  //         formatter: function (params) {
  //           return params.seriesName;
  //         }
  //       },
  //       data: valueList1,
  //     },
  //   ],
  //
  //   animationDelay: 1000,
  //   animationDuration: 8000,
  //   animationDurationUpdate: 0,
  //   animationEasing: 'linear',
  //   animationEasingUpdate: 'linear',
  // };
  function run(_rawData) {
    // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
    const countries = [
      'Finland',
      'France',
      'Germany',
      'Iceland',
      'Norway',
      'Poland',
      'Russia',
      'United Kingdom'
    ];
    const datasetWithFilters = [];
    const seriesList = [];
    countries.forEach(function (country) {
      let datasetId = 'dataset_' + country;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 1950 },
              { dimension: 'Country', '=': country }
            ]
          }
        }
      });
      seriesList.push({
        type: 'line',
        datasetId: datasetId,
        showSymbol: false,
        name: country,
        endLabel: {
          show: true,
          formatter: function (params) {
            return params.value[3] + ': ' + params.value[0];
          }
        },
        labelLayout: {
          moveOverlap: 'shiftY'
        },
        emphasis: {
          focus: 'series'
        },
        encode: {
          x: 'Year',
          y: 'Income',
          label: ['Country', 'Income'],
          itemName: 'Year',
          tooltip: ['Income']
        }
      });
    });
    const option = {
      animationDuration: 10000,
      dataset: [
        {
          id: 'dataset_raw',
          source: _rawData
        },
        ...datasetWithFilters
      ],
      // title: {
      //   text: 'Income of Germany and France since 1950'
      // },
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle'
      },
      yAxis: {
        // name: 'Income'
      },
      grid: {
        right: 140
      },
      series: seriesList
    };
    return option;
    // myChart.setOption(option);
  }

  const fchart = new FFChart({
    theme: 'light',
    option: run(await fs.readJson(dataJson)),
    x: width / 2,
    y: height / 2 + 50,
    width: width,
    height: 600,
  });

  const option2 = {
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + '\n (' + param.percent * 2 + '%)';
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        data: [
          {value: 4864326, name: '进攻资产'},
          {value: 34532324, name: '固收资产'},
          {value: 3418174, name: '流动资产'},
          {value: 1007923, name: '保障资产'},
          {value: 0, name: '其他资产'}
        ]
      }
    ],
    animationDurationUpdate: 500,
  }
  const data2 = [
    [5086483, 54128209, 1746071, 14955480, 0],
    [4057280, 62211603, 991779, 22901082, 0],
    [5051608, 83438622, 0, 85703136, 0],
    [14042073, 53640722, 0, 213158682, 0],
    [24199564, 30351994, 0, 355610528, 0],
    [5455663, 45629185, 0, 444884558, 0],
    [7039948, 17279872, 0, 593275629, 22399836],
    [8576881, 12475463, 0, 664318435, 94345695],
    [15303545, 0, 0, 716565993, 168338997],
    [15612324, 0, 0, 638023666, 387185652],
    [17370450, 0, 0, 678605616, 462053997],
  ]
  //fchart.addEffect(['rotateIn', 'zoomIn'], 1.2, 0);
  // let startIndex = 1;
  let t = 1;
  fchart.update(chart => {
    t++;
    if (t > 14) {
      const item = data2.shift()
      if (item) {
        option2.series[0].data[0].value = item[0]
        option2.series[0].data[1].value = item[1]
        option2.series[0].data[2].value = item[2]
        option2.series[0].data[3].value = item[3]
        option2.series[0].data[4].value = item[4]
        chart.setOption(option2)
      }
    } else if (t > 12) {
      chart.setOption(option2, true)
    }
    // startIndex += 2;
    // updateData(++startIndex);
    //
    // function updateData(index) {
    //   // let source = data.slice(1).filter(d => d[4] === year);
    //   option.series[0].data = valueList.slice(0, index);
    //   option.xAxis[0].data = dateList.slice(0, index);
    //   // option.graphic.elements[0].style.text = year;
    //   chart.setOption(option);
    // }
  }, 1000);
  fchart.updateNow();
  // fchart.addEffect(['rotateIn', 'zoomIn'], 1.2, 1);
  // scene1.removeAllDisplayChildren();
  scene1.addChild(fchart);
  // scene1.setDuration(valueList.length * 1000);
  // scene1.removeAllDisplayChildren();
  // creator.removeAllDisplayChildren();
  const flogo1 = new FFImage({path: logo2, x: width / 2, y: 60});
  flogo1.setScale(0.65);
  scene1.addChild(flogo1);

  // add logo
  // const flogo1 = new FFImage({path: logo2, x: width / 2, y: 60});
  // flogo1.setScale(0.65);
  // scene1.addChild(flogo1);

  // add FFText Component
  // const text1 = new FFText({text: '定力图表组件 Demo', x: width / 2, y: 160, fontSize: 40});
  // text1.setColor('#ffffff');
  // text1.setBackgroundColor('#0030cd');
  // text1.addEffect('fadeInUp', 1, 0.5);
  // text1.alignCenter();
  // text1.setFont(font2);
  // text1.setStyle({padding: 10});
  // scene1.addChild(text1);

  // add gif image
  // const fcart = new FFGifImage({path: cart, x: width / 2, y: height - 100});
  // fcart.addEffect('zoomIn', 2, 1);
  // fcart.setScale(0.3);
  // scene1.addChild(fcart);

  // const fhert = new FFGifImage({ path: hert, x: width / 2, y: height / 2 });
  // fhert.addEffect('fadeIn', 1.5, 0.5);
  // fhert.addEffect('fadeOut', 1.5, 3.5);
  // scene1.addChild(fhert);

  // const frock = new FFImage({
  //   path: rock,
  //   x: width / 2,
  //   y: height / 2,
  //   scale: 0.75,
  //   rotate: 3.1415 / 2,
  // });
  // frock.addAnimate({
  //   from: { x: -200 },
  //   to: { x: width + 200 },
  //   time: 1.5,
  //   delay: 6.5,
  // });
  // scene1.addChild(frock);

  scene1.setDuration(25);
  // scene1.setTransition('WaterWave', 1.5);
  // creator.setD
  // creator.addChild()
  creator.addChild(scene1);

  // add scene2 background
  // const fbg2 = new FFImage({path: bg2, x: width / 2, y: height / 2});
  // scene2.addChild(fbg2);
  // add logo
  // const flogo2 = new FFImage({path: logo2, x: width / 2, y: height / 2 - 80});
  // flogo2.setScale(0.9);
  // flogo2.addEffect('fadeInDown', 1, 1.2);
  // scene2.addChild(flogo2);

  // scene2.setDuration(3);
  // creator.addChild(scene2);

  creator.start();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(colors.red(`FFCreator error: ${e.error}`));
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

FFCreatorCenter.addTask(createFFTask)

// module.exports = () => startAndListen(() => {
//   FFCreatorCenter.openLog();
//   FFCreatorCenter.addTask(createFFTask)
// });
