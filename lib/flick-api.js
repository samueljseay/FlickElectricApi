// Generated by CoffeeScript 1.8.0
(function() {
  var EventEmitter, FlickAPI, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  request = require('superagent');

  EventEmitter = require('events').EventEmitter;

  FlickAPI = (function(_super) {
    __extends(FlickAPI, _super);

    function FlickAPI(username, password) {
      this.username = username;
      this.password = password;
      this.get_token();
    }

    FlickAPI.prototype.get_token = function() {
      return request.post('https://api.flick.energy/identity/oauth/token').type('form').send({
        grant_type: 'password',
        client_id: 'le37iwi3qctbduh39fvnpevt1m2uuvz',
        client_secret: 'ignwy9ztnst3azswww66y9vd9zt6qnt',
        username: this.username,
        password: this.password
      }).end((function(_this) {
        return function(err, resp) {
          var _ref;
          if (err) {
            return _this.emit('error', ((_ref = err.response) != null ? _ref.text : void 0) || "Error", err);
          } else if (resp.body.id_token) {
            _this.token = resp.body.id_token;
            return _this.emit('authenticated');
          } else {
            return _this.emit('error', "Invalid response", resp.text);
          }
        };
      })(this));
    };

    FlickAPI.prototype.get_price = function() {
      if (!this.token) {
        this.get_token();
        return this.once('authenticated', (function(_this) {
          return function() {
            return _this.get_price();
          };
        })(this));
      }
      return request.get('https://api.flick.energy/customer/mobile_provider/price').set('Authorization', "Bearer " + this.token).end((function(_this) {
        return function(err, resp) {
          if (err) {
            return _this.emit('error', "Error", err);
          } else if (resp.body.kind === 'mobile_provider_price') {
            _this.emit('price', resp.body.needle.price / 100);
            return _this.emit('commentary', resp.body.needle.commentary);
          } else {
            return _this.emit('error', "Invalid response", resp.text);
          }
        };
      })(this));
    };

    return FlickAPI;

  })(EventEmitter);

  module.exports = FlickAPI;

}).call(this);
