(function (wid, dcm) {
	var win = wid;
	var doc = dcm;
	
	function $id(id) {
		return doc.getElementById(id);
	}
	
	function $class(name) {
		return doc.getElementsByClassName(name);
	}
	
	function loop(begin, length, fuc) {
		for ( var i = begin; i < length; i++ ) {
			if (fuc(i)) break;
		}
	}
	
	function on(action, selector, callback) {
		doc.addEventListener(action, function (e) {
			if (selector == e.target.tagName.toLowerCase() || selector == e.target.className || selector == e.target.id) {
				callback(e);
			}
		})
	}
	
	var address;
	function MultiPicker(config) {
		var count = 0;
		var province = 0;
		var city = 0;
		var district = 0;
		var data1 = config.jsonData;
		if(config.address==''){
		}else{
			var p = config.address.split(" ")[0];
			var c = config.address.split(" ")[1];
			var d = config.address.split(" ")[2];
			for (var i in data1) {
				if(data1[i].value == p){
					count = i;
					province = i*40;
					var data2 = data1[i].child;
					for (var j in data2) {
						if(data2[j].value == c){
							city = j*40;
							var data3 = data2[j].child;
							for (var z in data3) {
								if(data3[z].value == d){
									district = z*40;
									break; 
								}
							}
						}
					}
				}
			}	
		}
		this.input     = config.input;
		this.container = config.container;
		this.jsonData  = config.jsonData;
		this.success   = config.success;
		
		address = [province,city,district];
		this.ulCount   = 0;
		this.ulIdx     = 0;
		this.ulDomArr  = [];
		this.idxArr    = [];
		this.jsonArr   = [];
		this.liHeight  = wid.lib ? parseInt(doc.getElementsByTagName('HTML')[0].style.fontSize) * 1 : 40;
		this.maxHeight = [];
		this.distance  = [];
		this.start     = {
			Y: 0,
			time: ''
		};
		this.move      = {
			Y: 0,
			speed: []
		};
		this.end       = {
			Y: 0,
			status: true,
		};
		this.resultArr = [];
		this.initDomFuc();
		this.initReady(0, this.jsonData[count]);
		this.initBinding();
	}
	
	MultiPicker.prototype = {
		constructor: MultiPicker,
		generateArrData: function (targetArr) {
			var tempArr = [];
			loop(0, targetArr.length, function (i) {
				tempArr.push({
					"id": targetArr[i].id,
					"value": targetArr[i].value
				})
			});
			return tempArr;
		},
		checkArrDeep: function (parent) {
			var _this = this;
			if ('child' in parent && parent.child.length > 0) {
				_this.jsonArr.push(_this.generateArrData(parent.child));
				_this.checkArrDeep(parent.child[0]);
			}
			_this.idxArr.push(this.ulIdx++);
		},
		insertLiArr: function (targetUl, arr) {
			var html    = '';
			var nullObj = {
				id: '-99',
				value: '',
			};
			arr.unshift(nullObj, nullObj);
			arr.push(nullObj, nullObj);
			loop(0, arr.length, function (i) {
				var img;
				var imgUrl;
				if(arr[i].value=='金牌合伙人'){
				  imgUrl = 'assets/images/vip/v3.png';
				  img= '<img style="height:15px;disply:flex;padding:0 5px" src="'+imgUrl+'">';
				}else if(arr[i].value=='经纪人'){
				  imgUrl = 'assets/images/vip/v2.png';
				  img= '<img style="height:15px;disply:flex;padding:0 5px" src="'+imgUrl+'">';
				}else if(arr[i].value=='服务站'){
				  imgUrl = 'assets/images/vip/v1.png';
				  img= '<img style="height:15px;disply:flex;padding:0 5px" src="'+imgUrl+'">';
				}else{
				  imgUrl = '';
				  img= '';
				}
				html += '<li>'+img+ arr[i].value + '</li>';
			});
			targetUl.innerHTML = html;
		},
		initDomFuc: function () {
			var _this                      = this;
			var html                       = '';
			html += '<div class="multi-picker-bg" id="multi-picker-bg-' + _this.container + '">'
				+ '<div  class="multi-picker-container" id="multi-picker-container-' + _this.container + '">'
				+ '<div class="multi-picker-btn-box">'
				+ '<div class="multi-picker-btn" id="multi-picker-btn-cancel">返回</div>'
				+ '<div class="multi-picker-btn" id="multi-picker-btn-save-' + _this.container + '">确定</div>'
				+ '</div>'
				+ '<div class="multi-picker-content">'
				+ '<div class="multi-picker-up-shadow"></div>'
				+ '<div class="multi-picker-down-shadow"></div>'
				+ '<div class="multi-picker-line"></div>'
				+ '</div></div></div>';
			$id(_this.container).innerHTML = html;
			_this.jsonArr.push(_this.generateArrData(_this.jsonData));
		},
		initReady: function (idx, target) {
			var _this            = this;
			this.ulIdx           = 0;
			this.idxArr.length   = idx;
			_this.jsonArr.length = idx + 1;
			_this.checkArrDeep(target);
			var parentNode = $id('multi-picker-container-' + _this.container).children[1];
			var tempMax    = _this.ulCount <= _this.idxArr.length ? _this.ulCount : _this.idxArr.length;
			loop(idx + 1, tempMax, function (i) {
				var $picker = $id('multi-picker-' + _this.container + '-' + i);
				_this.insertLiArr($picker, _this.jsonArr[i]);
				_this.distance[i]             = 0;
				$picker.style.transform       = 'translate3d(0, 0, 0)';
				$picker.style.webkitTransform = 'translate3d(0, 0, 0)';
			});
			if (_this.ulCount <= _this.idxArr.length) {
				loop(_this.ulCount, _this.idxArr.length, function (i) {
					var newPickerDiv = document.createElement('div');
					newPickerDiv.setAttribute('class', 'multi-picker');
					if(i==0){
						newPickerDiv.innerHTML = '<ul id="multi-picker-' + _this.container + '-' + i + '" style="transform: translate3d(0px, -'+address[i]+'px, 0px);"></ul>';
					}else if(i==1){
						newPickerDiv.innerHTML = '<ul id="multi-picker-' + _this.container + '-' + i + '" style="transform: translate3d(0px, -'+address[i]+'px, 0px);"></ul>';
					}else{
						newPickerDiv.innerHTML = '<ul id="multi-picker-' + _this.container + '-' + i + '" style="transform: translate3d(0px, -'+address[i]+'px, 0px);"></ul>';
					}
					
					parentNode.insertBefore(newPickerDiv, parentNode.children[parentNode.children.length - 3]);
					var tempDomUl = $id('multi-picker-' + _this.container + '-' + i);
					_this.ulDomArr.push(tempDomUl);
					_this.distance.push(address[i]);
					_this.insertLiArr(tempDomUl, _this.jsonArr[i]);
					
					var tempArray = _this.jsonArr[i];
					tempDomUl.addEventListener('touchstart', function () {
						_this.touch(event, _this, tempDomUl, tempArray, i);
					}, false);
					tempDomUl.addEventListener('touchmove', function () {
						_this.touch(event, _this, tempDomUl, tempArray, i);
					}, false);
					tempDomUl.addEventListener('touchend', function () {
						_this.touch(event, _this, tempDomUl, tempArray, i);
					}, true);
				});
			} else {
				for ( var j = _this.ulCount - 1; j > _this.idxArr.length - 1; j-- ) {
					var oldPicker = $id(_this.container).querySelectorAll('.multi-picker')[j];
					oldPicker.parentNode.removeChild(oldPicker);
					_this.ulDomArr.pop();
					_this.distance.pop();
				}
			}
			
			_this.maxHeight.length = 0;
			_this.resultArr.length = 0;
			loop(0, _this.idxArr.length, function (i) {
				$id(_this.container).querySelectorAll('.multi-picker')[i].style.width = 100 / _this.idxArr.length + '%';
				_this.maxHeight.push($id('multi-picker-' + _this.container + '-' + i).childNodes.length * _this.liHeight);
				_this.resultArr.push({
					"id": _this.jsonArr[i][_this.distance[i] / _this.liHeight + 2].id,
					"value": _this.jsonArr[i][_this.distance[i] / _this.liHeight + 2].value,
					"item": _this.jsonArr[i][_this.distance[i] / _this.liHeight + 2].item,
					"index": _this.distance[i] / _this.liHeight
				});
			});
			_this.ulCount = _this.idxArr.length;
		},
		initBinding: function () {
			var _this     = this;
			var bg        = $id('multi-picker-bg-' + _this.container);
			var container = $id('multi-picker-container-' + _this.container);
			var body      = doc.body;
			on('touchstart', _this.input, function () {
				bg.classList.add('multi-picker-bg-up', 'multi-picker-bg-delay');
				container.classList.add('multi-picker-container-up');
				body.classList.add('multi-picker-locked');
			}, false);
			
			on('touchstart', 'multi-picker-btn-save-' + _this.container, function () {
				_this.success(_this.resultArr);
				bg.classList.remove('multi-picker-bg-up');
				container.classList.remove('multi-picker-container-up');
				setTimeout(function () {
					bg.classList.remove('multi-picker-bg-delay');
				}, 350);
				body.classList.remove('multi-picker-locked');
			}, false);
			
			on('touchstart', 'multi-picker-bg-' + _this.container, function () {
				bg.classList.remove('multi-picker-bg-up');
				container.classList.remove('multi-picker-container-up');
				setTimeout(function () {
					bg.classList.remove('multi-picker-bg-delay');
				}, 350);
				body.classList.remove('multi-picker-locked');
			}, false);
			
			on('touchstart', 'multi-picker-btn-cancel', function () {
				bg.classList.remove('multi-picker-bg-up');
				container.classList.remove('multi-picker-container-up');
				setTimeout(function () {
					bg.classList.remove('multi-picker-bg-delay');
				}, 350);
				body.classList.remove('multi-picker-locked');
			}, false);
		},
		checkRange: function (idx) {
			var _this     = this;
			var tempObj   = _this.jsonData;
			var targetIdx = 0;
			loop(0, idx + 1, function (i) {
				targetIdx = _this.distance[i] / _this.liHeight;
				tempObj   = i == 0 ? tempObj[targetIdx] : tempObj.child[targetIdx];
			});
			_this.initReady(idx, tempObj);
		},
		initPosition: function (dis, max, idx) {
			dis     = dis < 0 ? 0 : dis;
			dis     = dis > max ? max : dis;
			var sub = dis % this.liHeight;
			if (sub < this.liHeight / 2) {
				this.distance[idx] = dis - sub;
			} else {
				this.distance[idx] = dis + (this.liHeight - sub);
			}
			return this;
		},
		initSpeed: function (arr, dir, max, idx) {
			var variance = 0;
			var sum      = 0;
			var rate     = 0;
			for ( var i in arr ) {
				sum += arr[i] - 0;
			}
			for ( var j in arr ) {
				variance += (arr[j] - (sum / arr.length)) * (arr[j] - (sum / arr.length));
			}
			if ((variance / arr.length).toFixed(2) > .1) {
				rate = max > this.liHeight * 15 ? dir * 2 : 0;
				this.initPosition(this.distance[idx] + rate, max - this.liHeight * 5, idx);
				this.move.speed[0] = .2;
			} else {
				this.initPosition(this.distance[idx], max, idx);
				this.move.speed[0] = this.move.speed[0] > 0.2 ? .2 : this.move.speed[0];
			}
		},
		touch: function (event, that, $picker, array, idx) {
			event = event || window.event;
			event.preventDefault();
			switch (event.type) {
				case "touchstart":
					if (that.end.status) {
						that.end.status = !that.end.status;
						event.preventDefault();
						that.move.speed = [];
						that.start.Y    = event.touches[0].clientY;
						that.start.time = Date.now();
					}
					
					break;
				case "touchend":
					that.end.Y         = Math.abs(event.changedTouches[0].clientY);
					var tempDis        = that.distance[idx] + (that.start.Y - that.end.Y);
					var temp           = that.distance[idx];
					that.distance[idx] = tempDis < 0 ? 0 : (tempDis < that.maxHeight[idx] - this.liHeight * 5 ? tempDis : that.maxHeight[idx] - this.liHeight * 5);
					that.initSpeed(that.move.speed, that.start.Y - that.end.Y, that.maxHeight[idx], idx);
					
					$picker.style.transform        = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
					$picker.style.webkitTransform  = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
					$picker.style.transition       = 'transform ' + that.move.speed[0] + 's ease-out';
					$picker.style.webkitTransition = '-webkit-transform ' + that.move.speed[0] + 's ease-out';
					if (temp != that.distance[idx]) that.checkRange(idx);
					setTimeout(function () {
						that.end.status = true;
					}, that.move.speed[0] * 1000);
					break;
				case "touchmove":
					event.preventDefault();
					that.move.Y = event.touches[0].clientY;
					var offset  = that.start.Y - that.move.Y;
					if (that.distance[idx] == 0 && offset < 0) {
						$picker.style.transform        = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
						$picker.style.webkitTransform  = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
						$picker.style.transition       = 'transform 0.2s ease-out';
						$picker.style.webkitTransition = '-webkit-transform 0.2s ease-out';
					} else {
						$picker.style.transform       = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
						$picker.style.webkitTransform = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
					}
					if (Math.abs(offset).toFixed(0) % 5 === 0) {
						var time = Date.now();
						that.move.speed.push((Math.abs(offset) / (time - that.start.time)).toFixed(2));
					}
					break;
			}
		}
	};
	if (typeof exports == "object") {
		module.exports = MultiPicker;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return MultiPicker;
		})
	} else {
		win.MultiPicker = MultiPicker;
	}
})(window, document);