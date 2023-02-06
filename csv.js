// console.time('create list');
let chart;

function convertToFive (myNum, myFixed) {
  if (isNaN(myNum))  return '     ';
  if (myNum === null) return '     ';
  let result = '', str = '' + myNum.toFixed(myFixed);
  for (let i = 1; i <= (5 - str.length) ; i++) {
    result += ' ';
  }
  result = result + str;
  return result;
}

Highcharts.setOptions({
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  lang: {
    months: [
      'Січень', 'Лютий', ',Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ],
    shortMonths: [
      'Січ', 'Лют', 'Берез', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Верес', 'Жовт', 'Листоп', 'Груд'
    ],
    weekdays: [
      'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'
    ],
    printChart: 'Надрукувати графік',
    contextButtonTitle: 'Контекстне меню',
    exportData: {
      categoryDatetimeHeader: 'Дата та час'
    },
    downloadCSV: 'Завантажити CSV',
    downloadJPEG: 'Завантажити JPEG',
    downloadPDF: 'Завантажити PDF',
    downloadPNG: 'Завантажити PNG',
    downloadSVG: 'Завантажити SVG',
    downloadXLS: 'Завантажити XLS',
    loading: 'Завантаження...',
    resetZoomTitle: 'Скинути масштабування до 1:1',
    resetZoom: 'Скинути масштабування',
    viewData: 'Показати у вигляді таблиці',
    hideData: 'Сховати таблицю',
    viewFullscreen: 'Повноекранний режим',
    exitFullscreen: 'Вийти з повноекранного режиму',
    rangeSelectorZoom: 'Період',
    noData: 'Немає даних для відтворення'
  }
});

(function(H) {
  if (window.zipcelx && H.getOptions().exporting) {
    H.Chart.prototype.downloadXLSX = function() {
      var div = document.createElement('div'),
        name,
        xlsxRows = [],
        rows;
      div.style.display = 'none';
      document.body.appendChild(div);
      rows = this.getDataRows(true);
      xlsxRows = rows.slice(1).map(function(row) {
        return row.map(function(column) {
          return {
            type: typeof column === 'number' ? 'number' : 'string',
            value: column
          };
        });
      });

      // Get the filename, copied from the Chart.fileDownload function
      if (this.options.exporting.filename) {
        name = this.options.exporting.filename;
      } else if (this.title && this.title.textStr) {
        name = this.title.textStr.replace(/ /g, '-').toLowerCase();
      } else {
        name = 'chart';
      }

      window.zipcelx({
        filename: name,
        sheet: {
          data: xlsxRows
        }
      });
    };

    // Default lang string, overridable in i18n options
    H.getOptions().lang.downloadXLSX = 'Завантажити XLSX';

    // Add the menu item handler
    H.getOptions().exporting.menuItemDefinitions.downloadXLSX = {
      textKey: 'downloadXLSX',
      onclick: function() {
        this.downloadXLSX();
      }
    };

    // Replace the menu item
    var menuItems = H.getOptions().exporting.buttons.contextButton.menuItems;
    menuItems[menuItems.indexOf('downloadXLS')] = 'downloadXLSX';
  }

}(Highcharts));

function setChart(data) {

  chart = Highcharts.stockChart('container', {

    chart: {
      zoomType: 'x',
      displayErrors: true,
    },

    data: {
      csvURL: data,
      startRow: 0,
      endRow: undefined,
      startColumn: 0,
      endColumn: 6,
      itemDelimiter: ';',
      lineDelimiter: '\n',
      decimalPoint: ',',
      parseDate: function(time) {
//      return new Date(time.replace(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s(.*)$/g, '$3-$2-$1 $4')).getTime(); 
        
        let rtime = time.replace(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s(.*)$/g, '$3:$2:$1:$4');
        let time_array = rtime.split(':');
        let fullDate = new Date(Date.UTC(+time_array[0], +time_array[1] - 1, +time_array[2], +time_array[3], +time_array[4], +time_array[5]));
//        time_arr.push(time_array[2] + '.' + time_array[1] + '.' + time_array[0]);
      
//      let rtime = time.replaceAll(' ',':');
//      rtime = rtime.replaceAll('.',':');
//      let time_array = rtime.split(':');
//      let fullDate = new Date(Date.UTC(time_array[2],time_array[1]-1,time_array[0], time_array[3], time_array[4], time_array[5]));      
        return fullDate.getTime();
      },
      complete: function () {       
//        console.log ('OK');
      }   
    },

    tooltip: {
      split: false,
      shared: true,
      useHTML: true,
//      className: 'tooltip',
//      xDateFormat: '%d.%m.%Y %H:%M:%S',
//      hideDelay: 55000,
     formatter: function() {
///        console.log(this);   
       let mod;
       let nmode;
       let npreset; 
       this.points.forEach (function(point) {
          if (point.series.name == 'Режим') {
            nmode = point.y;
          }
          if (point.series.name == 'Уставка') {
            npreset = point.y;
          }
       });
       let y1 = 'Напруга   : ';
       let y2 = 'Струм     : ';
       let y3 = 'Потенціал : ';
       let y4 = 'Помилки   :  ';
       let y5 = 'Режим     :  ';
       if (nmode == 0) {
         mod = y5 + 'вихід відключений ';
       } else if (nmode == 1) {
         mod = y5 + 'ст. напруги ';
       } else if (nmode == 2) {
         mod = y5 + 'ст. струму ';
       } else if (nmode == 3) {
         mod = y5 + 'ст. потенціалу ';
       } else if (nmode == 4) {
         mod = y5 + 'вст. ст. напруги ';
       } else if (nmode == 5) {
         mod = y5 + 'вст. ст. струму ';
       } else if (nmode == 6) {
         mod = y5 + 'вст. ст. потенціалу ';
       } else {
         mod = y5 + 'невідомо  ';
       }
       
       let tt = this.points.reduce(function(s, point) {
         
         let val = 0, valu = '     ', valp = '';
         
         if (point.series.name == 'Напруга') {
           valp = convertToFive (point.y, 1);      
           val = valp + ' ' + valu;
           nname = '<br/>' + y1;            
         }
         
         if (point.series.name == 'Напруга' && nmode == 1) {
           valu = convertToFive (npreset, 1);   
           val = valp + ' ' + valu;  
         }
         
         if (point.series.name == 'Струм') {
           valp = convertToFive (point.y, 1);      
           val = valp + ' ' + valu;
           nname = '<br/>' + y2;             
         }
         
         if (point.series.name == 'Струм' && nmode == 2) {
           valu = convertToFive (npreset, 1);   
           val = valp + ' ' + valu;   
         }
         
         if (point.series.name == 'Потенціал') {
           valp = convertToFive (point.y, 2);      
           val = valp + ' ' + valu;
           nname = '<br/>' + y3;            
         }
         
         if (point.series.name == 'Потенціал' && nmode == 3) {
           valu = convertToFive (npreset, 2);   
           val = valp + ' ' + valu;  
         }          
  
         if (point.series.name == 'Помилки') {
           nname = '<br/>' + y4; 
         }            
         if (point.series.name == 'Помилки') {
           if (point.y == 0 || point.y == null) {
             val = 'немає';
           } else if (point.y == 1) {
             val = '1 - E01';
           } else if (point.y == 2) {
             val = '2 - E02';
           } else if (point.y == 3) {
             val = '3 - E03';
           } else if (point.y == 4) {
             val = '4 - E04';
           } else {
             val = 'невідомо';
           }
         }
         if (point.series.name == 'Режим') {
           val = '';
           nname = '';
         }
         if (point.series.name == 'Уставка') {
           val = '';
           nname = '';
         }
         
         return s + nname + val;
       }, '');
       //setTimeout(() => {debugger;}, 3000);
       let tm = '<b>' + Highcharts.dateFormat('%d.%m.%y %H:%M:%S', this.x) + '</b>' + '<br/>';
       tm = tm + mod + tt;
       // console.log (tm);
       return '<span class="tooltip">' + tm + '</span>';
     },

//      headerFormat:'<table><tr><th colspan="2">{point.key}</th></tr>',
//      pointFormat: '<tr><td>{series.name}</td>' + '<td style="text-align: right"><b>{point.y}</b></td></tr>',
//      footerFormat:'<tr><td>Режим</td>' + '<td style="text-align: right"><b>{point.mode}</b></td></tr></table>',    
    },

    plotOptions: {
      column: {
        dataGrouping: {
          approximation: 'high',
          enabled: true,
//          units: [
//            [
//              'minute',
//              [1, 2, 5, 10, 15, 30]
//            ],
//            [
//              'hour',
//              [1, 2, 3, 4, 6, 8, 12]
//            ],
//            [
//              'day',
//              [1]
//            ],
//            [
//              'week',
//              [1]
//            ]
//          ]
        },
      },
      series: {
        gapSize: 100,
      },
    },

    legend: {
      layout: 'horizontal',
      enabled: true
    },

    rangeSelector: {
      inputDateFormat: '%d.%m.%Y',
      selected: 7,
      buttons: [{
        type: 'hour',
        count: 1,
        text: '1г',
        title: '1 година'
      }, {
        type: 'hour',
        count: 12,
        text: '12г',
        title: '12 годин'
      }, {
        type: 'day',
        count: 1,
        text: '1д',
        title: '1 день'
      }, {
        type: 'week',
        count: 1,
        text: '1т',
        title: '1 тиждень'
      }, {
        type: 'month',
        count: 1,
        text: '1м',
        title: '1 місяць'
      }, {
        type: 'month',
        count: 3,
        text: '3м',
        title: '3 місяці'
      }, {
        type: 'all',
        text: 'Все',
        title: 'Все'
      }],
      dropdown: 'always',
    },

    accessibility: {
      enabled: false
    },

    xAxis: {
      type: 'datetime',
      ordinal: false
    },

    yAxis: [{
      labels: {
        format: '{value:.1f}В',
        align: 'right',
        x: -3
      },
      title: {
        text: 'Напруга'
      },
//      top: '0%',
      height: '30%',
      offset: 0,
      opposite: true,
      lineWidth: 1,
    }, {
      labels: {
        format: '{value:.1f}А',
        align: 'right',
        x: -3
      },
      title: {
        text: 'Струм'
      },
      top: '30%',
      height: '30%',
      offset: 0,
      opposite: true,
      lineWidth: 1
    }, {
      labels: {
        format: '{value:.2f}В',
        align: 'right',
        x: -3
      },
      title: {
        text: 'Потенціал'
      },
      top: '60%',
      height: '30%',
      offset: 0,
      opposite: true,
      lineWidth: 1,
    }, {
      allowDecimals: false,
      top: '90%',
      height: '10%',
      min: 0,
      max: 1,
      endOnTick: false,
      title: {},
      labels: {
        enabled: false
      },
    }, {
      allowDecimals: false,
//      top: '0%',
      height: '0%',
            min: 0,
            max: 1,
            endOnTick: false,
      title: {},
      labels: {
        enabled: false
      },
    }, {
      allowDecimals: false,      
//      top: '0%',
      height: '0%',
            min: 0,
            max: 1,
            endOnTick: false,
      title: {},
      labels: {
        enabled: false
      },
      
    }],


    credits: {
      enabled: false
    },

    series: [{
      name: 'Напруга',
      type: 'line',
      yAxis: 0,
      visible: true,
      marker: {
        enabled: true,
        radius: 2
      },
//      tooltip: {
//        valueDecimals: 1,
//        valueSuffix: '&thinsp;В',
//        pointFormat: 'Напруга&nbsp;&nbsp;:&nbsp;' + '<b>{point.y}</b></br>'
//      }
    }, {
      name: 'Струм',
      type: 'line',
      yAxis: 1,
      visible: true,
      marker: {
        enabled: true,
        radius: 2
      },
//      tooltip: {
//        valueDecimals: 1,
//        valueSuffix: '&thinsp;А',
//        pointFormat: 'Струм&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;' + '<b>{point.y}</b></br>'
//      }
    }, {
      name: 'Потенціал',
      type: 'line',
      yAxis: 2,
      visible: true,
      marker: {
        enabled: true,
        radius: 2
      },
//      tooltip: {
//        //        valueDecimals: 2,
//        //        valueSuffix: '',
//        //        pointFormat: 'Потенціал:' + '<b>{point.y}</b></br>',
//        pointFormatter: function() {
//          if (this.y >= 0) {
//            return 'Потенціал:' + '<b>' + '&nbsp;' + this.y.toFixed(2) + '&thinsp;В' + '</b>' + '</br>';
//          } else {
//            return 'Потенціал:' + '<b>' + this.y.toFixed(2) + '&thinsp;В' + '</b>' + '</br>';
//          }
//        }
//      }
    }, {
      name: 'Помилки',
      type: 'column',
      showInLegend: false,
      yAxis: 3,
      visible: true,
      opacity: 1,
      //    pointWidth: 1
      //    marker: {
      //      enabled: true,
      //      radius: 3
      //    },
//      tooltip: {
//        valueDecimals: 0,
//        valueSuffix: '',
//        pointFormatter: function() {
//          let e = 'немає'; // name
//          let n = 'Помилка&nbsp;&nbsp;:&nbsp;'; // error
//          let w = 'Подія&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;'; // warning 
//          if (this.y == 0 || this.y == null || this.y === undefined) {
//            n = 'Помилки&nbsp;&nbsp;:&nbsp;';
//          }
//          if (this.y == 1) {
//            e = 'немає мережі 220В';
//          }
//          if (this.y == 2) {
//            e = 'обрив ланцюга навантаження';
//          }
//          if (this.y == 99) {
//            e = 'двері відчинені';
//            n = w;
//          }
//          return n + '<b>' + e + '</b>' + '</br>';
//        }
//      },
      zones: [{
        value: 1,
        color: '#ff0000'
      }, {
        value: 2,
        color: '#00ff00'
      }, {
        value: 3,
        color: 'red'
      }, {
        value: 4,
        color: '#00ffff'
      }, {
        value: 5,
        color: '#ffff00'
      }, {
        value: 6,
        color: '#ff00ff'
      }, {
        color: '#145a32'
      }],
    }, {
      name: 'Режим',
      type: 'column',
      showInLegend: false,
      yAxis: 4,
      visible: true,
      opacity: 0,
    }, {
      name: 'Уставка',
      type: 'column',
      showInLegend: false,
      yAxis: 5,
      visible: true,
      opacity: 0,      
    }],

    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen', 'printChart', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV', 'downloadXLSX']
        },
      },
      csv: {
        dateFormat: '%d.%m.%Y %H:%M:%S',
        decimalPoint: ',',
        itemDelimiter: ';',
        lineDelimiter: '\n'
      }
    }

  });
}
