# Logitech G25 Racing Wheel for Node

Bring your [Logitech G25 Racing Wheel](http://support.logitech.com/en_us/product/g25-racing-wheel) into the wonderful world of [Node](https://nodejs.org/en/). Note: this is a fork of ForestMists great [Logitech G27 library](https://github.com/ForestMist/logitech-g27)

* Subscribe to wheel, pedal, and shifter events.
* Activate simple force feedback effects.
* Set wheel auto-centering and range.
* Customize shift indicator LEDs.

## Requirements

[Node](https://nodejs.org/en/) version 4.0.0 or greater.

## Install

This library uses [node-hid](https://github.com/node-hid/node-hid) behind the scenes. Node 4 users should have an effortless install. Node 5 users may want to consult node-hid's [compiling from source](https://github.com/node-hid/node-hid#compiling-from-source) guide for anything more serious than a warning.

```
npm install fbuchinger/logitech-g25
```

[Ubuntu](http://www.ubuntu.com/desktop) users will most likely want to remove the `sudo` requirement of interfacing with the wheel. This can be easily accomplished by creating a file at `/etc/udev/rules.d/99-hidraw-permissions.rules` with the following code. After saving the file, reboot and then you can move on to more fun tasks.

```
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"
```

## Example

Let's have some fun and make our wheel LEDs light up when we press the gas pedal.

```js
var g = require('logitech-g25')

g.connect(function(err) {
    g.on('pedals-gas', function(val) {
        g.leds(val)
    })
})
```

Vroom vroom sounds optional but encouraged. ^\_^

## API

* [connect](docs/api.md#connect)
  * [options](docs/api.md#options)
* [events](docs/api.md#events)
  * [event map](docs/api.md#event-map)
  * [on](docs/api.md#on)
  * [once](docs/api.md#once)
* [force](docs/api.md#force)
  * [forceConstant](docs/api.md#forceconstant)
  * [forceFriction](docs/api.md#forcefriction)
  * [forceOff](docs/api.md#forceoff)
* [leds](docs/api.md#leds)
* [disconnect](docs/api.md#disconnect)
* [advanced](docs/api.md#advanced)
  * [emitter](docs/api.md#emitter)
  * [relay](docs/api.md#relay)
  * [relayOS](docs/api.md#relayos)

## Contribute

Looking to contribute? Here are some ideas to get you started.

* [Report any issues](https://github.com/fbuchinger/logitech-g25/issues) on GitHub.
* Contact [Daniel](https://forestmist.org/about/) with improvement ideas and/or send a [pull request](https://github.com/fbuchinger/logitech-g25/pulls).
* Hook up your G25 wheel to something on the internet and wow the IoT community.
* Share this library with other Logitech loving folks.

Not sure where you can help? Don't worry. Just by using this library, you are making the world a neater place. ^\_^

## License

MIT © [Daniel Gagan](https://forestmist.org), Franz Buchinger
