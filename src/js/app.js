/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Lindseys\'',
        icon: 'images/menu_icon.png',
        subtitle: 'Next Trains'
      }, {
        title: 'Harringay',
        subtitle: 'to Old Street'
      }, {
        title: 'Finsbury Park',
        subtitle: 'Harringay'
      }, {
        title: 'Highbury & Islington',
        subtitle: 'Harringay'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    switch (e.itemIndex) {
      case 1:
        showDepartures(1001138, 'Old Street');
        break;
      case 2:
        showDepartures(1000334, 1001138);
        break;
      case 3:
        showDepartures('Highbury & Islington', 1001138);
        break;
      default:
        var card = new UI.Card();
        card.body('Not Implemented');
        card.show();
        break;

    }
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    position: new Vector2(2, 14),
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 57),
    size: new Vector2(144, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
    textAlign: 'center'
  });
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

var ajax = require('ajax');

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  var appId = '03bf8009';
  var appKey = 'd9307fd91b0247c607e098d5effedc97';
  var now = new Date();
  var zeroPad = function(number) {
    var string = number + '';
    return string.length == 1 ? '0' + string : string;
  }
  var date = now.getFullYear() + '-' + zeroPad(now.getMonth() + 1) + '-' + zeroPad(now.getDay());
  var time = zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes());
  ajax(
    {
      url: 'http://transportapi.com/v3/uk/train/station/HGY/' + date + '/' + time + '/timetable.json?app_id=' + appId + '&app_key=' + appKey + '&train_status=passenger',
      type: 'json'
    },
    function(data) {
      card.body(
        data.departures.all
          .filter(function(item) { return item.platform === '1'; })
          .map(function(item) { return item.aimed_departure_time; })
          .join(', ')
      );
    }
  );
  card.body('loading');
  card.show();
});

function showDepartures(origin, destination) {
  var card = new UI.Card();
  var appId = '03bf8009';
  var appKey = 'd9307fd91b0247c607e098d5effedc97';
  var url = 'http://transportapi.com/v3/uk/public/journey/from/' + encodeURIComponent(origin) + '/to/' +
    encodeURIComponent(destination) + '.json?app_id=' + appId + '&app_key=' + appKey + '&modes=train&region=tfl';
  ajax(
    {
      url: url,
      type: 'json'
    },
    function(data) {
      card.body(
        data.routes
          .map(function(item) {
            return item.departure_time + ' -> ' + item.arrival_time;
          })
          .join("\n")
      );
    },
    function() {
      console.log(arguments);
      card.body('No results, or bad code ;-)');
    }
  );
  card.body('loading');
  card.show();
}
