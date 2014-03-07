
# parallel-ware-pipe

  A plugin factory for [parallel-ware](https://github.com/segmentio/parallel-ware) that waits for data to become available, and then pipes that data to another function.

## Installation

    $ npm install parallel-ware-pipe

## Example

```js
var parallel = require('parallel-ware');
var pipe = require('parallel-ware-pipe');

parallel()
  .use(weather)
  .use(pipe('degrees', write))
  .run({ zip: '18708 ');

function weather (data, callback) {
  request
    .get('https://weather.com/api/' + data.zip)
    .end(function (err, res) {
      data.degrees = res.body.degrees;
      callback();
    });
}

function write (degrees, callback) {
  fs.writeFile('degrees.txt', degrees, callback);
}
```

## License

MIT