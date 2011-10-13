	(function() {
		var c = {};
		c.canvasFallbackContent = '<div class="fallback"><p>Your browser does not appear to support <a href="http://en.wikipedia.org/wiki/HTML5">HTML5</a>.</p><p>Please try one of the following, more standards compliant browsers: <a href="http://www.google.com/chrome">Chrome</a>, <a href="http://www.apple.com/safari/">Safari</a>, <a href="http://www.mozilla.com/firefox/">Firefox</a> or <a href="http://www.opera.com/">Opera</a>.</p></div>';
		c.setInterval = function(f, a, b) {
			return window.setInterval(function() {
				a.call(b)
			}, f)
		};
		c.setTimeout = function(f, a, b) {
			return window.setTimeout(function() {
				a.call(b)
			}, f)
		};
		c.on = function(f, a, b, d) {
			b.addEventListener(f, function(e) {
				a.call(d, e)
			}, false)
		};
		c.stopEvent = function(f) {
			f.cancelBubble = true;
			f.stopPropagation();
			f.preventDefault()
		};
		c.now = function() {
			return Date.now()
		};
		c.makeCanvas = function(f, a, b, d) {
			var e = document.createElement("canvas");
			e.id = f;
			e.width = Number(a) || 0;
			e.height = Number(b) || 0;
			if (d !== true) {
				e.innerHTML = c.canvasFallbackContent;
				document.getElementById("stage").appendChild(e)
			}
			return e
		};
		c.getOffset = function(f) {
			for ( var a = {
				x : f.offsetLeft,
				y : f.offsetTop
			};;) {
				f = f.parentNode;
				if (f === document.body)
					break;
				a.x += f.offsetLeft;
				a.y += f.offsetTop
			}
			return a
		};
		c.randomRange = function(f, a) {
			return Math.round(Math.random() * (a - f)) + f
		};
		c.clamp = function(f, a, b) {
			return Math.min(Math.max(f, a), b)
		};
		c.randomDirection = function() {
			var f = new c.Vector2(c.randomRange(-10, 10), c
					.randomRange(-10, 10));
			f.normalize();
			return f
		};
		c.makeObject = function(f, a) {
			var b = new c.Object;
			b.type = f;
			for ( var d in c.objectTypes[f])
				b[d] = c.objectTypes[f][d];
			a !== true && b.init();
			return b
		};
		c.directions = {
			UP : 0,
			UP_RIGHT : 1,
			RIGHT : 2,
			DOWN_RIGHT : 3,
			DOWN : 4,
			DOWN_LEFT : 5,
			LEFT : 6,
			UP_LEFT : 7,
			toVector : function(f) {
				if (f < 0)
					f += 8;
				if (f > 7)
					f -= 8;
				switch (f) {
				case c.directions.UP:
					return new c.Vector2(0, -1);
				case c.directions.UP_RIGHT:
					return new c.Vector2(1, -1);
				case c.directions.RIGHT:
					return new c.Vector2(1, 0);
				case c.directions.DOWN_RIGHT:
					return new c.Vector2(1, 1);
				case c.directions.DOWN:
					return new c.Vector2(0, 1);
				case c.directions.DOWN_LEFT:
					return new c.Vector2(-1, 1);
				case c.directions.LEFT:
					return new c.Vector2(-1, 0);
				case c.directions.UP_LEFT:
					return new c.Vector2(-1, -1)
				}
			},
			fromVector : function(f) {
				if (f.x > -0.25 && f.x < 0.25 && f.y < 0)
					return c.directions.UP;
				if (f.x > -0.25 && f.x < 0.25 && f.y > 0)
					return c.directions.DOWN;
				if (f.x > 0 && f.y > -0.25 && f.y < 0.25)
					return c.directions.RIGHT;
				if (f.x < 0 && f.y > -0.25 && f.y < 0.25)
					return c.directions.LEFT;
				if (f.x > 0 && f.y < 0)
					return c.directions.UP_RIGHT;
				if (f.x > 0 && f.y > 0)
					return c.directions.DOWN_RIGHT;
				if (f.x < 0 && f.y > 0)
					return c.directions.DOWN_LEFT;
				if (f.x < 0 && f.y < 0)
					return c.directions.UP_LEFT
			}
		};
		c.x = function(f, a) {
			for ( var b = 0, d = "", e = 0; e < a.length; ++e)
				b += a.charCodeAt(e);
			for (e = 0; e < f.length; ++e)
				d += String.fromCharCode(b ^ f.charCodeAt(e));
			return d
		};
		(function() {
			var f = [];
			c.log = function(a) {
				f.push(a);
				console.log(a)
			}
		})();
		(function() {
			c.Timer = function() {
				this.ttl = this.elapsed_ms = 0
			};
			var f = c.Timer, a = f.prototype;
			f.now = function() {
				return Date.now()
			};
			a.start = function(b) {
				if (b)
					this.ttl = Number(b);
				this.elapsed_ms = 0
			};
			a.update = function(b) {
				this.elapsed_ms += b
			};
			a.reset = function() {
				this.start()
			};
			a.elapsed = function() {
				return this.elapsed_ms
			};
			a.expired = function() {
				if (this.ttl > 0)
					return this.elapsed_ms > this.ttl;
				return false
			}
		})();
		(function() {
			c.sound = {};
			var f = "html5", a = false, b = {};
			c.sound.init = function(d) {
				switch (f) {
				case "ios":
					d();
					break;
				case "sm2":
					soundManager.useFastPolling = true;
					soundManager.useHighPerformance = true;
					soundManager.autoLoad = true;
					soundManager.multiShot = true;
					soundManager.volume = 100;
					soundManager.onload = d;
					soundManager.useHTML5Audio = false;
					soundManager.onerror = function(g) {
						return function() {
							f = "html5";
							g(d)
						}
					}(arguments.callee);
					break;
				case "html5":
					var e = document.createElement("audio");
					if (e.canPlayType)
						e.canPlayType("audio/mpeg;") || (f = null);
					d()
				}
			};
			c.sound.create = function(d, e, g, i) {
				g = Boolean(g);
				e += ".mp3";
				if (i === undefined)
					i = 100;
				switch (f) {
				case "sm2":
					d = {
						id : d,
						url : e,
						volume : i
					};
					if (g)
						d.onfinish = function() {
							this.play()
						};
					soundManager.createSound(d).load();
					break;
				case "html5":
					var h = new Audio;
					h.preload = "auto";
					h.src = e;
					g ? h.addEventListener("ended", function() {
						this.currentTime = 0;
						this.play()
					}, false) : h.addEventListener("ended", function() {
						this.pause();
						this.currentTime = 0
					}, false);
					h.load();
					h.volume = i / 100;
					b[d] = h
				}
			};
			c.sound.isPlaying = function(d) {
				switch (f) {
				case "sm2":
					if (d = soundManager.getSoundById(d))
						return d.playState === 1;
					return false;
				case "html5":
					return b[d].currentTime > 0
				}
			};
			c.sound.play = function(d) {
				if (a)
					return false;
				switch (f) {
				case "ios":
					location.href = "jsbridge://" + d;
					break;
				case "sm2":
					soundManager.play(d);
					break;
				case "html5":
					try {
						b[d].pause();
						b[d].currentTime = 0;
						b[d].play()
					} catch (e) {
					}
				}
			};
			c.sound.stop = function(d) {
				switch (f) {
				case "sm2":
					soundManager.stop(d);
					break;
				case "html5":
					b[d].pause();
					b[d].currentTime = 0
				}
			};
			c.sound.stopAll = function() {
				switch (f) {
				case "sm2":
					soundManager.stopAll();
					break;
				case "html5":
					try {
						for ( var d in b) {
							b[d].pause();
							b[d].currentTime = 0
						}
					} catch (e) {
						console.log("[ERROR horde.sound.stopAll]", e)
					}
				}
			};
			c.sound.pauseAll = function() {
				switch (f) {
				case "sm2":
					soundManager.pauseAll();
					break;
				case "html5":
					for ( var d in b)
						b[d].currentTime > 0 && b[d].pause()
				}
			};
			c.sound.resumeAll = function() {
				switch (f) {
				case "sm2":
					soundManager.resumeAll();
					break;
				case "html5":
					for ( var d in b)
						b[d].currentTime > 0 && b[d].play()
				}
			};
			c.sound.toggleMuted = function() {
				c.sound.setMuted(!c.sound.isMuted())
			};
			c.sound.isMuted = function() {
				return a
			};
			c.sound.setMuted = function(d) {
				if (a !== d)
					(a = d) ? c.sound.pauseAll() : c.sound.resumeAll()
			}
		})();
		(function() {
			c.Size = function(f, a) {
				this.width = Number(f) || 0;
				this.height = Number(a) || 0
			}
		})();
		(function() {
			c.Vector2 = function(b, d) {
				this.x = Number(b) || 0;
				this.y = Number(d) || 0
			};
			var f = c.Vector2, a = f.prototype;
			f.fromSize = function(b) {
				return new c.Vector2(b.width, b.height)
			};
			f.fromHeading = function(b, d) {
				d = Number(d) || 1;
				return new c.Vector2(Math.sin(b) * d, -Math.cos(b) * d)
			};
			a.clone = function() {
				return new c.Vector2(this.x, this.y)
			};
			a.scale = function(b) {
				this.x *= b;
				this.y *= b;
				return this
			};
			a.add = function(b) {
				this.x += b.x;
				this.y += b.y;
				return this
			};
			a.subtract = function(b) {
				this.x -= b.x;
				this.y -= b.y;
				return this
			};
			a.zero = function() {
				this.y = this.x = 0;
				return this
			};
			a.invert = function() {
				this.x *= -1;
				this.y *= -1;
				return this
			};
			a.magnitude = function() {
				return Math.sqrt(this.x * this.x + this.y * this.y)
			};
			a.normalize = function() {
				var b = this.magnitude();
				return b === 0 ? this : this.scale(1 / b)
			};
			a.toString = function() {
				return this.x + ", " + this.y
			};
			a.floor = function() {
				this.x = Math.floor(this.x);
				this.y = Math.floor(this.y);
				return this
			};
			a.abs = function() {
				this.x = Math.abs(this.x);
				this.y = Math.abs(this.y);
				return this
			};
			a.angle = function() {
				return this.heading() * (180 / Math.PI)
			};
			a.heading = function() {
				return Math.atan2(this.x, -this.y)
			}
		})();
		(function() {
			c.Rect = function(b, d, e, g) {
				this.left = Number(b) || 0;
				this.top = Number(d) || 0;
				this.width = Number(e) || 0;
				this.height = Number(g) || 0
			};
			var f = c.Rect, a = f.prototype;
			f.intersects = function(b, d) {
				return b.left <= d.left + d.width && d.left <= b.left + b.width
						&& b.top <= d.top + d.height
						&& d.top <= b.top + b.height
			};
			a.center = function() {
				var b = new c.Vector2(this.width, this.height);
				return (new c.Vector2(this.left, this.top)).add(b.scale(0.5))
			};
			a.intersects = function(b) {
				return f.intersects(this, b)
			};
			a.reduce = function(b) {
				this.left += b;
				this.top += b;
				this.width -= b * 2;
				this.height -= b * 2;
				return this
			}
		})();
		(function() {
			c.Keyboard = function() {
				this.history = [];
				this.keyStates = {};
				this.lastKeyStates = {};
				c.on("keydown", this.handleKeyDown, window, this);
				c.on("keyup", this.handleKeyUp, window, this)
			};
			var f = c.Keyboard, a = f.prototype, b = {
				ESCAPE : 27,
				ENTER : 13,
				SPACE : 32,
				LEFT : 37,
				UP : 38,
				RIGHT : 39,
				DOWN : 40,
				A : 65,
				B : 66,
				D : 68,
				E : 69,
				F : 70,
				G : 71,
				K : 75,
				L : 76,
				M : 77,
				O : 79,
				P : 80,
				Q : 81,
				R : 82,
				S : 83,
				T : 84,
				U : 85,
				W : 87,
				X : 88,
				Z : 90
			};
			f.Keys = b;
			f.konamiCode = [ b.UP, b.UP, b.DOWN, b.DOWN, b.LEFT, b.RIGHT,
					b.LEFT, b.RIGHT, b.B, b.A ];
			f.debugCode = [ b.L, b.D, b.D, b.E, b.B, b.U, b.G ];
			f.resetCode = [ b.L, b.D, b.R, b.E, b.S, b.E, b.T ];
			f.godModeCode = [ b.L, b.D, b.D, b.Q, b.D ];
			f.allWeaponsCode = [ b.L, b.D, b.K, b.F, b.A ];
			f.awesmCode = [ b.A, b.W, b.E, b.S, b.M ];
			f.bombCode = [ b.L, b.D, b.B, b.O, b.M, b.B ];
			f.cyclopsCode = [ 67, 89, 67, b.L, b.O, b.P, b.S ];
			f.html5Code = [ 72, 84, 77, 76, 53 ];
			f.meatboyCode = [ b.M, b.E, b.A, b.T ];
			a.supressKeys = function(d) {
				switch (d.keyCode) {
				case b.ENTER:
				case b.LEFT:
				case b.UP:
				case b.RIGHT:
				case b.DOWN:
				case b.B:
				case b.A:
				case b.M:
				case b.Z:
				case b.X:
				case b.P:
				case b.SPACE:
				case b.W:
				case b.S:
				case b.D:
				case 191:
					c.stopEvent(d)
				}
			};
			a.handleKeyDown = function(d) {
				this.history.push(d.keyCode);
				this.keyStates[d.keyCode] = true;
				this.supressKeys(d)
			};
			a.handleKeyUp = function(d) {
				this.keyStates[d.keyCode] = false;
				this.supressKeys(d)
			};
			a.isKeyDown = function(d) {
				return this.keyStates[d] === true
			};
			a.isKeyPressed = function(d) {
				return this.isKeyDown(d) && this.lastKeyStates[d] !== true
			};
			a.isAnyKeyPressed = function(d) {
				for (d in this.keyStates)
					if (this.isKeyDown(d) && this.lastKeyStates[d] !== true)
						return true;
				return false
			};
			a.clearKey = function(d) {
				this.keyStates[d] = false
			};
			a.clearKeys = function() {
				this.keyStates = {}
			};
			a.clearHistory = function() {
				this.history = []
			};
			a.historyMatch = function(d) {
				var e = d.length, g = this.history.slice(-e);
				if (g.length !== e)
					return false;
				for ( var i = 0; i < e; i++)
					if (d[i] !== g[i])
						return false;
				return true
			};
			a.storeKeyStates = function() {
				for ( var d in this.keyStates)
					this.lastKeyStates[d] = this.keyStates[d]
			}
		})();
		(function() {
			c.Mouse = function(b) {
				this.buttonStates = {};
				this.mouseY = this.mouseX = 0;
				this.canvas = b;
				this.lastButtonStates = {};
				c.on("mousemove", this.handleMouseMove, window, this);
				c.on("mousedown", this.handleMouseDown, window, this);
				c.on("mouseup", this.handleMouseUp, window, this)
			};
			var f = c.Mouse, a = f.prototype;
			f.Buttons = {
				LEFT : 0,
				RIGHT : 2
			};
			a.handleMouseMove = function(b) {
				var d = c.getOffset(this.canvas);
				this.mouseX = (b.clientX - d.x) * 640 / this.canvas.offsetWidth;
				this.mouseY = (b.clientY - d.y) * 480
						/ this.canvas.offsetHeight;
				this.hasMoved = true
			};
			a.handleMouseDown = function(b) {
				this.buttonStates[b.button] = true;
				c.stopEvent(b);
				window.focus && window.focus()
			};
			a.handleMouseUp = function(b) {
				this.buttonStates[b.button] = false
			};
			a.isButtonDown = function(b) {
				return this.buttonStates[b]
			};
			a.isAnyButtonDown = function() {
				for ( var b in this.buttonStates)
					if (this.buttonStates[b])
						return true;
				return false
			};
			a.clearButtons = function() {
				this.buttonStates = {}
			};
			a.wasButtonClicked = function(b) {
				return this.buttonStates[b] && !this.lastButtonStates[b]
			};
			a.storeButtonStates = function() {
				for ( var b in this.buttonStates)
					this.lastButtonStates[b] = this.buttonStates[b]
			}
		})();
		c.isDemo = function() {
			return true
		};
		c.populateWaves = function(f) {
			var a = new c.SpawnWave;
			a.addSpawnPoint(0, 5E3);
			a.addSpawnPoint(1, 5E3);
			a.addSpawnPoint(2, 5E3);
			a.addObjects(0, "bat", 1);
			a.addObjects(1, "bat", 1);
			a.addObjects(2, "bat", 1);
			f.waves.push(a);
			a = new c.SpawnWave;
			a.addSpawnPoint(0, 3E3);
			a.addSpawnPoint(1, 3E3);
			a.addSpawnPoint(2, 3E3);
			a.addObjects(0, "goblin", 5);
			a.addObjects(1, "goblin", 5);
			a.addObjects(2, "goblin", 5);
			f.waves.push(a);
			a = new c.SpawnWave;
			a.addSpawnPoint(0, 750);
			a.addSpawnPoint(1, 750);
			a.addSpawnPoint(2, 750);
			a.addObjects(1, "cyclops", 1);
			a.addObjects(0, "bat", 10);
			a.addObjects(1, "bat", 10);
			a.addObjects(2, "bat", 10);
			f.waves.push(a);
			a = new c.SpawnWave;
			a.addSpawnPoint(0, 1E3);
			a.addSpawnPoint(1, 1E3);
			a.addSpawnPoint(2, 1E3);
			a.addObjects(0, "demoblin", 1);
			a.addObjects(1, "wizard", 3);
			a.addObjects(2, "demoblin", 1);
			f.waves.push(a);
			a = new c.SpawnWave;
			a.addSpawnPoint(1, 1E3);
			a.addObjects(1, "cube", 1);
			a.bossWave = true;
			a.bossName = "Gelatinous Cube";
			f.waves.push(a)
		};
		(function() {
			c.Engine = function() {
				this.lastUpdate = 0;
				this.canvases = {};
				this.map = null;
				this.spawnPoints = [];
				this.objects = {};
				this.objectIdSeed = 0;
				this.playerObjectId = null;
				this.keyboard = new c.Keyboard;
				this.view = new c.Size(640, 480);
				this.images = null;
				this.running = this.konamiEntered = this.debug = false;
				this.gateDirection = "";
				this.gateState = "down";
				this.pointerOptionsStart = this.maxPointerY = this.pointerYStart = this.pointerY = this.gatesY = this.gatesX = 0;
				this.targetReticle = {
					position : new c.Vector2,
					angle : 0,
					moving : false
				};
				this.enableClouds = this.enableFullscreen = false;
				this.cloudTimer = null;
				this.woundsToSpeed = 10;
				this.introTimer = new c.Timer;
				this.introPhase = 0;
				this.wonGame = this.introPhaseInit = false;
				this.wonGamePhase = 0;
				this.weaponPickup = {
					type : null,
					state : "off",
					alpha : 1,
					scale : 1,
					position : new c.Vector2
				};
				this.touchMove = false;
				this.canMute = true;
				this.canFullscreen = false;
				this.wasdMovesArrowsAttack = true
			};
			var f = c.Engine.prototype;
			f.cacheBust = function() {
				return "?cachebust=1.2.26"
			};
			f.resize = function() {
				var a = window.innerWidth, b = window.innerHeight, d = document
						.getElementById("stage");
				b -= d.offsetTop;
				d.style.height = b + "px";
				if (this.enableFullscreen) {
					height = b - 50;
					if (height < 480)
						height = 480;
					if (height > 768)
						height = 768;
					d = Math.round(height * 1.333)
				} else {
					d = 640;
					height = 480
				}
				var e = this.canvases.display;
				e.style.width = d + "px";
				e.style.height = height + "px";
				a = Math.max(a / 2 - d / 2, 0);
				b = Math.max(b / 2 - height / 2, 30);
				e.style.left = a + "px";
				e.style.top = b + "px";
				if (e = document.getElementById("tip")) {
					e.style.top = b - 30 + "px";
					e.style.left = a + "px";
					e.style.width = d + "px"
				}
			};
			f.run = function() {
				this.init();
				this.lastUpdate = c.now();
				this.start()
			};
			f.start = function() {
				if (!this.running) {
					this.interval = c.setInterval(0, this.update, this);
					this.running = true
				}
			};
			f.stop = function() {
				if (this.running) {
					clearInterval(this.interval);
					this.running = false
				}
			};
			f.togglePause = function() {
				var a = false;
				return function() {
					if (!this.getPlayerObject().hasState(c.Object.states.DYING))
						if (this.paused) {
							this.paused = false;
							c.sound.setMuted(a);
							c.sound.play("unpause");
							c.sound.play(this.currentMusic)
						} else {
							this.paused = true;
							this.initOptions();
							a = c.sound.isMuted();
							c.sound.play("pause");
							c.sound.stop(this.currentMusic)
						}
				}
			}();
			f.addObject = function(a) {
				this.objectIdSeed++;
				var b = "o" + this.objectIdSeed;
				a.id = b;
				this.objects[b] = a;
				return b
			};
			f.getBarColor = function(a, b) {
				var d = b / a * 100;
				return d > 50 ? "rgb(98, 187, 70)"
						: d > 25 ? "rgb(246, 139, 31)" : "rgb(238, 28, 36)"
			};
			f.spawnObject = function(a, b, d, e) {
				d = d || a.facing;
				b = c.makeObject(b, true);
				for ( var g = a; g.ownerId !== null;)
					if (this.objects[g.ownerId])
						g = this.objects[g.ownerId];
					else
						break;
				if (e !== false) {
					b.ownerId = g.id;
					b.team = a.team
				}
				b.centerOn(a.boundingBox().center());
				b.setDirection(d);
				b.init();
				return this.addObject(b)
			};
			f.objectExists = function(a) {
				return this.objects[a]
			};
			f.getPlayerObject = function() {
				return this.objects[this.playerObjectId]
			};
			f.getObjectCountByType = function(a) {
				var b = 0, d;
				for (d in this.objects)
					this.objects[d].type === a && b++;
				return b
			};
			f.isAlive = function(a) {
				if (this.objects[a]) {
					a = this.objects[a];
					return a.alive && a.wounds < a.hitPoints
				}
				return false
			};
			f.preloadComplete = function() {
				this.state = "intro";
				this.logoAlpha = 0;
				this.logoFade = "in";
				this.logoFadeSpeed = 0.5
			};
			f.init = function() {
				this.state = "intro";
				this.canvases.display = c.makeCanvas("display",
						this.view.width, this.view.height);
				this.canvases.buffer = c.makeCanvas("buffer", this.view.width,
						this.view.height, true);
				this.resize();
				c.on("resize", this.resize, window, this);
				this.mouse = new c.Mouse(this.canvases.display);
				c.on("contextmenu", function(a) {
					c.stopEvent(a)
				}, document.body, this);
				c.on("blur", function() {
					this.stop();
					if (!(this.state != "running" || this.wonGame)) {
						this.keyboard.keyStates = {};
						this.paused || this.togglePause()
					}
				}, window, this);
				c.on("focus", function() {
					this.start()
				}, window, this);
				this.preloader = new c.ImageLoader;
				this.preloader.load({
					ui : "img/sheet_ui.png" + this.cacheBust()
				}, this.preloadComplete, this);
				this.images = new c.ImageLoader;
				this.images.load({
					arena : "img/sheet_arena.png" + this.cacheBust(),
					characters : "img/sheet_characters.png" + this.cacheBust(),
					objects : "img/sheet_objects.png" + this.cacheBust(),
					beholder : "img/sheet_beholder.png" + this.cacheBust()
				}, this.handleImagesLoaded, this);
				this.getData("high_score") === null
						&& this.putData("high_score", 1E3);
				this.initSound()
			};
			f.initSound = function() {
				c.sound.init(function() {
					var a = c.sound;
					a.create("normal_battle_music",
							"sound/music/normal_battle", true, 20);
					a.create("final_battle_music", "sound/music/final_battle",
							true, 20);
					a.create("victory", "sound/music/victory", true, 20);
					a.create("move_pointer", "sound/effects/move_pointer",
							false, 50);
					a.create("select_pointer", "sound/effects/select_pointer",
							false, 50);
					a.create("pause", "sound/effects/pause");
					a.create("unpause", "sound/effects/unpause");
					a.create("code_entered", "sound/effects/code_entered");
					a.create("gate_opens", "sound/effects/gate_opens");
					a.create("gate_closes", "sound/effects/gate_closes");
					a.create("spike_attack", "sound/effects/spike_attacks");
					a.create("immunity", "sound/effects/immunity", false, 25);
					a.create("coins", "sound/effects/coins", false, 10);
					a.create("eat_food", "sound/effects/eat_food", false, 30);
					a.create("pickup_weapon", "sound/effects/pickup_weapon");
					a.create("weapon_wall", "sound/effects/weapon_wall", false,
							25);
					a.create("fire_attack", "sound/effects/char_attacks_fire");
					a.create("hero_attacks", "sound/effects/char_attacks");
					a.create("hero_damage", "sound/effects/char_damage_3");
					a.create("hero_dies", "sound/effects/char_dies");
					a.create("bat_damage", "sound/effects/bat_damage");
					a.create("bat_dies", "sound/effects/bat_dies");
					a.create("goblin_attacks", "sound/effects/goblin_attacks");
					a.create("goblin_damage", "sound/effects/goblin_damage");
					a.create("goblin_dies", "sound/effects/goblin_dies");
					a.create("demoblin_attacks",
							"sound/effects/demoblin_attacks", false, 80);
					a.create("imp_damage", "sound/effects/imp_damage", false,
							30);
					a.create("imp_dies", "sound/effects/imp_dies", false, 30);
					a.create("gel_damage", "sound/effects/gel_damage", false,
							20);
					a.create("gel_dies", "sound/effects/gel_dies", false, 20);
					a.create("skull_damage", "sound/effects/skull_damage",
							false, 25);
					a
							.create("skull_dies", "sound/effects/skull_dies",
									false, 5);
					a.create("wizard_attacks", "sound/effects/wizard_attacks",
							false, 25);
					a.create("wizard_disappear",
							"sound/effects/wizard_disappear", false, 50);
					a.create("wizard_reappear",
							"sound/effects/wizard_reappear", false, 50);
					a.create("sandworm_attacks",
							"sound/effects/sandworm_attacks", false, 75);
					a.create("sandworm_dies", "sound/effects/sandworm_dies",
							false, 40);
					a
							.create("cyclops_attacks",
									"sound/effects/cyclops_attacks");
					a.create("cyclops_damage", "sound/effects/cyclops_damage");
					a.create("cyclops_dies", "sound/effects/cyclops_dies");
					a.create("owlbear_alarm", "sound/effects/owlbear_alarm",
							false, 20);
					a.create("owlbear_attacks",
							"sound/effects/owlbear_attacks", false, 15);
					a.create("owlbear_damage", "sound/effects/owlbear_damage",
							false, 40);
					a.create("owlbear_dies", "sound/effects/owlbear_dies",
							false, 50);
					a.create("cube_attacks", "sound/effects/cube_attacks");
					a.create("cube_damage", "sound/effects/cube_damage");
					a.create("cube_dies", "sound/effects/cube_dies");
					a.create("minotaur_attacks",
							"sound/effects/minotaur_attacks");
					a
							.create("minotaur_damage",
									"sound/effects/minotaur_damage");
					a.create("minotaur_dies", "sound/effects/minotaur_dies");
					a.create("dragon_attacks", "sound/effects/dragon_attacks");
					a.create("dragon_damage", "sound/effects/dragon_damage");
					a.create("dragon_dies", "sound/effects/dragon_dies");
					a.create("beholder_damage",
							"sound/effects/beholder_damage", false, 50);
					a.create("beholder_dies", "sound/effects/beholder_dies",
							false, 25);
					a.create("eyelet_damage", "sound/effects/eyelet_damage",
							false, 25);
					a.create("eyelet_dies", "sound/effects/eyelet_dies", false,
							25);
					a.create("dopp_attacks", "sound/effects/dopp_attacks",
							false, 50);
					a.create("dopp_damage", "sound/effects/dopp_damage", false,
							50);
					a.create("dopp_dies", "sound/effects/dopp_dies")
				})
			};
			f.initGame = function() {
				this.enableClouds = this.konamiEntered = false;
				this.closeGates();
				this.objects = {};
				this.state = "title";
				this.initOptions();
				this.initMap();
				this.initSpawnPoints();
				this.initWaves();
				this.initPlayer();
				this.gameOverBg = null;
				this.statsIndex = this.statsIncrement = this.statsCount = this.scoreCount = this.gotNewHighScore = this.monstersAlive = 0;
				this.statsTimer = null;
				this.wonGame = this.highScoreSaved = false;
				this.wonGamePhase = 0;
				this.showReticle = false;
				this.hideReticleTimer = null;
				this.showTutorial = false;
				this.tutorialIndex = 0;
				this.tutorialY = -70;
				this.tutorialDirection = "down";
				this.nextTutorialTimer = this.hideTutorialTimer = null;
				this.heroFiring = false;
				this.heroFiringDirection = null;
				this.woundsTo = 0;
				this.gameStartTime = c.now()
			};
			f.initMap = function() {
				this.tileSize = new c.Size(32, 32);
				this.map = [
						[ 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
								0, 0 ],
						[ 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
								0, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
								1, 0 ],
						[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0 ],
						[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0 ],
						[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0 ] ]
			};
			f.initSpawnPoints = function() {
				this.spawnPoints = [];
				this.spawnPoints.push(new c.SpawnPoint(3 * this.tileSize.width,
						-2 * this.tileSize.height, this.tileSize.width * 2,
						this.tileSize.height * 2));
				this.spawnPoints.push(new c.SpawnPoint(9 * this.tileSize.width,
						-2 * this.tileSize.height, this.tileSize.width * 2,
						this.tileSize.height * 2));
				this.spawnPoints.push(new c.SpawnPoint(
						15 * this.tileSize.width, -2 * this.tileSize.height,
						this.tileSize.width * 2, this.tileSize.height * 2))
			};
			f.initSpawnWave = function(a) {
				var b = 0, d;
				for (d in a.points) {
					var e = a.points[d], g = this.spawnPoints[e.spawnPointId];
					g.delay = e.delay;
					g.lastSpawnElapsed = g.delay;
					for ( var i in e.objects) {
						var h = e.objects[i];
						g.queueSpawn(h.type, h.count)
					}
					e = (g.queue.length - 1) * g.delay;
					if (e > b)
						b = e
				}
				this.waveTimer.start(b + a.nextWaveTime);
				this.openGates()
			};
			f.initWaves = function() {
				this.waves = [];
				this.waveTimer = new c.Timer;
				this.waveTimer.start(1);
				this.currentWaveId = -1;
				this.waveText = {
					string : "",
					size : 20,
					state : "off",
					alpha : 0
				};
				c.populateWaves(this)
			};
			f.initPlayer = function() {
				var a = c.makeObject("hero");
				a.weapons = [ {
					type : "h_sword",
					count : null
				} ];
				a.centerOn(c.Vector2.fromSize(this.view).scale(0.5));
				this.playerObjectId = this.addObject(a);
				if (this.touchMove)
					this.targetReticle.position = a.boundingBox().center()
			};
			c.Engine.prototype.handleImagesLoaded = function() {
				this.imagesLoaded = true
			};
			f.logoFadeOut = function() {
				this.logoFade = "out"
			};
			f.updateLogo = function(a) {
				var b = this.keyboard;
				if (this.keyboard.isAnyKeyPressed()
						|| this.mouse.isAnyButtonDown()) {
					b.clearKeys();
					this.mouse.clearButtons();
					this.initGame()
				}
				if (this.logoFade === "in") {
					this.logoAlpha += this.logoFadeSpeed / 1E3 * a;
					if (this.logoAlpha >= 1) {
						this.logoAlpha = 1;
						this.logoFade = "none";
						c.setTimeout(1E3, this.logoFadeOut, this)
					}
				} else if (this.logoFade === "out") {
					this.logoAlpha -= this.logoFadeSpeed / 1E3 * a;
					if (this.logoAlpha <= 0) {
						this.logoAlpha = 0;
						this.logoFade = "none";
						this.initGame()
					}
				}
			};
			f.updateIntroCinematic = function(a) {
				this.introTimer.update(a);
				switch (this.introPhase) {
				case 0:
					if (!this.introPhaseInit) {
						this.introFadeAlpha = 0;
						this.introPhaseInit = true
					}
					this.introFadeAlpha += 0.0010 * a;
					if (this.introFadeAlpha >= 1) {
						this.introFadeAlpha = 1;
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 1:
					if (!this.introPhaseInit) {
						this.introFadeAlpha = 1;
						this.introPhaseInit = true
					}
					this.introFadeAlpha -= 5.0E-4 * a;
					if (this.introFadeAlpha <= 0) {
						this.introFadeAlpha = 0;
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 2:
					if (!this.introPhaseInit) {
						this.introTimer.start(1E3);
						this.introPhaseInit = true
					}
					if (this.introTimer.expired()) {
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 3:
					if (!this.introPhaseInit) {
						this.openGates();
						this.introPhaseInit = true
					}
					if (this.gateState === "up") {
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 4:
					if (!this.introPhaseInit) {
						var b = c.makeObject("hero");
						b.position.x = 304;
						b.position.y = -64;
						b.collidable = false;
						b.setDirection(new c.Vector2(0, 1));
						this.introHero = b;
						this.introPhaseInit = true
					}
					this.introHero.update(a);
					this.moveObject(this.introHero, a);
					if (this.introHero.position.y >= 222) {
						this.introHero.centerOn(c.Vector2.fromSize(this.view)
								.scale(0.5));
						this.introHero.stopMoving();
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 5:
				case 6:
				case 8:
					if (!this.introPhaseInit) {
						this.introTimer.start(500);
						this.introPhaseInit = true
					}
					if (this.introTimer.expired()) {
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 7:
					if (!this.introPhaseInit) {
						this.closeGates();
						this.introPhaseInit = true
					}
					if (this.gateState === "down") {
						this.introPhase++;
						this.introPhaseInit = false
					}
					break;
				case 9:
					if (!this.introPhaseInit) {
						this.introTimer.start(1E3);
						this.introPhaseInit = true
					}
					this.introHero.update(a);
					if (this.introTimer.expired()) {
						this.currentMusic = "normal_battle_music";
						c.sound.play(this.currentMusic);
						this.state = "running"
					}
				}
			};
			f.update = function() {
				var a = c.now(), b = a - this.lastUpdate;
				this.lastUpdate = a;
				this.lastElapsed = b;
				if (this.imagesLoaded === true) {
					switch (this.state) {
					case "intro":
						this.updateLogo(b);
						this.render();
						break;
					case "title":
						this.handleInput();
						this.updateFauxGates(b);
						this.render();
						break;
					case "credits":
						this.handleInput();
						this.render();
						break;
					case "intro_cinematic":
						this.handleInput();
						this.updateIntroCinematic(b);
						this.updateFauxGates(b);
						this.render();
						break;
					case "running":
						this.wonGame ? this.updateWonGame(b) : this
								.handleInput();
						if (!this.paused) {
							this.updateWaves(b);
							this.updateSpawnPoints(b);
							this.updateClouds(b);
							this.updateObjects(b);
							this.updateFauxGates(b);
							this.updateWeaponPickup(b)
						}
						this.showTutorial && this.updateTutorial(b);
						this.render();
						break;
					case "game_over":
						this.updateGameOver(b);
						this.render();
						break;
					case "buy_now":
						this.handleInput();
						this.render()
					}
					if (!this.hideReticleTimer)
						this.hideReticleTimer = new c.Timer;
					if (this.mouse.hasMoved) {
						this.showReticle = true;
						this.hideReticleTimer.start(5E3);
						this.nextTutorial(3)
					}
					this.hideReticleTimer.update(b);
					if (this.hideReticleTimer.expired())
						this.showReticle = false;
					this.mouse.hasMoved = false
				}
			};
			f.updateWeaponPickup = function(a) {
				var b = this.weaponPickup;
				if (b.state === "on") {
					b.scale += 0.0045 * a;
					b.alpha -= 0.0025 * a;
					if (b.alpha <= 0)
						b.state = "off"
				}
			};
			f.updateWonGame = function(a) {
				var b = this.getPlayerObject();
				this.roseTimer && this.roseTimer.update(a);
				switch (this.wonGamePhase) {
				case 0:
					a = new c.Vector2(304, 192);
					b.moveToward(a);
					b = b.position.clone().subtract(a).abs();
					b.x <= 5 && b.y <= 5 && this.wonGamePhase++;
					break;
				case 1:
					b.setDirection(new c.Vector2(0, 1));
					b.stopMoving();
					b.addState(c.Object.states.VICTORIOUS);
					this.roseTimer = new c.Timer;
					this.roseTimer.start(100);
					this.rosesThrown = 0;
					this.wonGamePhase++;
					break;
				case 2:
					if (this.roseTimer.expired()) {
						++this.rosesThrown;
						b = c.makeObject("rose");
						if (c.randomRange(1, 2) === 2) {
							b.position.x = -32;
							b.position.y = c.randomRange(100, 300);
							b.setDirection(new c.Vector2(1, 0))
						} else {
							b.position.x = 682;
							b.position.y = c.randomRange(100, 300);
							b.setDirection(new c.Vector2(-1, 0))
						}
						this.addObject(b);
						this.roseTimer.reset()
					}
					this.rosesThrown > 100 && this.endGame()
				}
			};
			f.updateClouds = function(a) {
				if (this.enableClouds === true) {
					if (this.cloudTimer === null) {
						this.cloudTimer = new c.Timer;
						this.cloudTimer.start(2E3)
					}
					this.cloudTimer.update(a);
					a = 0;
					for ( var b in this.objects) {
						var d = this.objects[b];
						if (d.type === "cloud") {
							a++;
							d.position.x < -d.size.width && d.die()
						}
					}
					if (a < 10 && this.cloudTimer.expired()) {
						if (c.randomRange(1, 10) >= 1) {
							b = c.randomRange(1, 3);
							for (a = 0; a < b; a++) {
								d = c.makeObject("cloud");
								d.position.x = 640 + c.randomRange(1, 32);
								d.position.y = c.randomRange(
										-(d.size.height / 2),
										480 + d.size.height / 2);
								d.setDirection(new c.Vector2(-1, 0));
								this.addObject(d)
							}
						}
						this.cloudTimer.reset()
					}
				}
			};
			f.updateSpawnPoints = function(a) {
				if (this.gateState === "up") {
					var b = true, d;
					for (d in this.spawnPoints) {
						if (this.spawnPoints[d].queue.length >= 1)
							b = false;
						var e = this.spawnPoints[d].update(a,
								this.monstersAlive === 0);
						e !== false && this.addObject(e)
					}
					b && !this.monstersAboveGates && this.closeGates()
				}
			};
			f.spawnWaveExtras = function(a) {
				switch (a) {
				case 1:
					var b = this.getPlayerObject();
					a = c.makeObject("item_weapon_knife");
					a.position = b.position.clone();
					a.position.x -= 96;
					a.position.y += 64;
					this.addObject(a);
					a = c.makeObject("item_weapon_spear");
					a.position = b.position.clone();
					a.position.x -= 32;
					a.position.y += 64;
					this.addObject(a);
					a = c.makeObject("item_weapon_axe");
					a.position = b.position.clone();
					a.position.x += 32;
					a.position.y += 64;
					this.addObject(a);
					a = c.makeObject("item_weapon_fireball");
					a.position = b.position.clone();
					a.position.x += 96;
					a.position.y += 64;
					this.addObject(a);
					break;
				case 11:
					var d = [ {
						x : 192,
						y : 224
					}, {
						x : 416,
						y : 224
					} ];
					b = d.length;
					for (a = 0; a < b; ++a) {
						var e = d[a], g = c.makeObject("spikes");
						g.position = new c.Vector2(e.x, e.y);
						this.addObject(g)
					}
					break;
				case 21:
					d = [ {
						x : 32,
						y : 64
					}, {
						x : 32,
						y : 352
					}, {
						x : 576,
						y : 64
					}, {
						x : 576,
						y : 352
					} ];
					b = d.length;
					for (a = 0; a < b; a++) {
						e = d[a];
						g = c.makeObject("spike_sentry");
						g.position = new c.Vector2(e.x, e.y);
						this.addObject(g)
					}
					break;
				case 31:
					d = [ {
						x : 304,
						y : 114
					}, {
						x : 304,
						y : 304
					} ];
					b = d.length;
					for (a = 0; a < b; ++a) {
						e = d[a];
						g = c.makeObject("spikes");
						g.position = new c.Vector2(e.x, e.y);
						this.addObject(g)
					}
					break;
				case 41:
					this.enableClouds = true;
					break;
				case 50:
					for (b in this.objects) {
						a = this.objects[b];
						a.role === "trap" && a.die()
					}
				}
			};
			f.updateWaves = function(a) {
				if (!this.wonGame) {
					this.waveTimer.update(a);
					var b = true, d;
					for (d in this.spawnPoints)
						if (this.spawnPoints[d].queue.length > 0)
							b = false;
					if (b === true && this.monstersAlive === 0) {
						if (this.currentWaveId === this.waves.length - 1) {
							this.wonGame = true;
							c.sound.stop("normal_battle_music");
							c.sound.stop("final_battle_music");
							c.sound.play("victory");
							return
						}
						this.currentWaveId++;
						b = this.currentWaveId + 1;
						if (this.continuing || this.waveHack) {
							for (d = this.waveHack ? 1 : 2; d <= b; ++d)
								this.spawnWaveExtras(d);
							this.waveHack = false
						} else
							this.spawnWaveExtras(b);
						d = "Wave " + b;
						if (b > 1) {
							this.putData("checkpoint_wave", this.currentWaveId);
							this.putData("checkpoint_hero", JSON.stringify(this
									.getPlayerObject()));
							this.continuing || (d += " & Game Saved!")
						}
						if (this.waves[this.currentWaveId].bossWave) {
							d = "Boss: "
									+ this.waves[this.currentWaveId].bossName
									+ "!";
							c.sound.isPlaying("normal_battle_music")
									&& c.sound.stop("normal_battle_music");
							this.currentMusic = "final_battle_music";
							c.sound.play(this.currentMusic)
						} else {
							c.sound.isPlaying("final_battle_music")
									&& c.sound.stop("final_battle_music");
							if (!c.sound.isPlaying("normal_battle_music")) {
								this.currentMusic = "normal_battle_music";
								c.sound.play(this.currentMusic)
							}
						}
						this.initSpawnWave(this.waves[this.currentWaveId]);
						this.waveText.string = d;
						this.waveText.alpha = 0;
						this.waveText.size = 30;
						this.waveText.state = "show";
						this.continuing = false
					}
					switch (this.waveText.state) {
					case "show":
						this.waveText.alpha += 0.0020 * a;
						if (this.waveText.alpha >= 1) {
							this.waveText.alpha = 1;
							this.waveText.timer = new c.Timer;
							this.waveText.timer.start(250);
							this.waveText.state = "display"
						}
						break;
					case "display":
						this.waveText.timer.update(a);
						if (this.waveText.timer.expired())
							this.waveText.state = "hide";
						break;
					case "hide":
						this.waveText.alpha -= 0.0015 * a;
						this.waveText.size += 0.2 * a;
						if (this.waveText.alpha <= 0) {
							this.waveText.alpha = 0;
							this.waveText.state = "off"
						}
					}
				}
			};
			f.updateGameOver = function(a) {
				if (!this.gameOverAlpha) {
					this.gameOverReady = false;
					this.gameOverAlpha = 0
				}
				this.gameOverAlpha += Number(2.0E-4 * a) || 0;
				if (this.gameOverAlpha >= 0.75) {
					this.gameOverReady = true;
					this.gameOverAlpha = 0.75
				}
				if (this.gameOverReady) {
					if (!this.statsTimer) {
						this.statsTimer = new c.Timer;
						this.statsIndex = this.statsCount = 0;
						this.statsTimer.start(50);
						this.statsIncrement = 1
					}
					this.statsTimer.update(a);
					if (this.statsTimer.expired()) {
						this.statsTimer.reset();
						this.statsCount += this.statsIncrement
					}
				}
				if (this.statsIndex >= 4 && !this.highScoreSaved) {
					this.highScoreSaved = true;
					a = Number(this.getData("high_score"));
					var b = this.getTotalScore();
					if (b > a) {
						this.putData("high_score", b);
						c.sound.play("victory");
						this.gotNewHighScore = true
					}
				}
			};
			f.openGates = function() {
				if (this.gateState !== "up") {
					this.gateDirection = "up";
					c.sound.play("gate_opens")
				}
			};
			f.closeGates = function() {
				if (this.gateState !== "down") {
					this.gateDirection = "down";
					c.sound.play("gate_closes")
				}
			};
			f.updateFauxGates = function(a) {
				if (this.gateDirection === "down") {
					this.gatesX = 0;
					this.gatesY += 0.2 * a;
					if (this.gatesY >= 0) {
						this.gatesY = this.gatesX = 0;
						this.gateDirection = "";
						this.gateState = "down"
					}
				}
				if (this.gateDirection === "up") {
					this.gatesX = c.randomRange(-1, 1);
					this.gatesY -= 0.05 * a;
					if (this.gatesY <= -54) {
						this.gatesX = 0;
						this.gatesY = -54;
						this.gateDirection = "";
						this.gateState = "up"
					}
				}
			};
			f.updateTutorial = function(a) {
				if (this.tutorialDirection === "down") {
					this.tutorialY += 0.1 * a;
					if (this.tutorialY >= 0) {
						this.tutorialY = 0;
						this.tutorialDirection = null;
						this.tutorialIndex >= 4
								&& this.hideTutorialTimer.start(5E3)
					}
				}
				if (this.tutorialDirection === "up") {
					this.tutorialY -= 0.1 * a;
					if (this.tutorialY < -70) {
						this.tutorialY = -70;
						this.tutorialDirection = "down";
						this.tutorialIndex += 1;
						if (this.tutorialIndex > 4)
							this.showTutorial = false
					}
				}
				if (!this.hideTutorialTimer)
					this.hideTutorialTimer = new c.Timer;
				if (!this.nextTutorialTimer) {
					this.nextTutorialTimer = new c.Timer;
					this.nextTutorialTimer.start(1E4)
				}
				this.hideTutorialTimer.update(a);
				this.nextTutorialTimer.update(a);
				if (this.hideTutorialTimer.expired())
					this.tutorialDirection = "up";
				if (this.nextTutorialTimer.expired()) {
					this.nextTutorial(this.tutorialIndex + 1);
					this.nextTutorialTimer.reset()
				}
			};
			f.nextTutorial = function(a) {
				if (!(!this.showTutorial || this.tutorialDirection !== null))
					if (this.tutorialIndex === a - 1)
						this.tutorialDirection = "up"
			};
			f.getTilesByRect = function(a) {
				var b = [], d = new c.Vector2(a.left, a.top), e = new c.Vector2(
						a.width, a.height);
				a = d.clone().scale(1 / this.tileSize.width).floor();
				d = d.clone().add(e).scale(1 / this.tileSize.width).floor();
				for (e = a.x; e <= d.x; e++)
					for ( var g = a.y; g <= d.y; g++)
						b.push({
							x : e,
							y : g
						});
				return b
			};
			f.checkTileCollision = function(a) {
				a = this.getTilesByRect(a.boundingBox());
				for ( var b = 0, d = a.length; b < d; b++) {
					var e = a[b];
					if (this.map[e.y] && this.map[e.y][e.x] === 0)
						return e
				}
				return false
			};
			f.moveObject = function(a, b) {
				if (!a.badass && a.hasState(c.Object.states.HURTING))
					return false;
				var d = a.speed;
				if (a.hasState(c.Object.states.SLOWED))
					d *= 0.2;
				var e = d / 1E3 * b;
				d = [];
				if (a.direction.x !== 0) {
					a.position.x += a.direction.x * e;
					if (a.collidable) {
						if (a.position.x < 16)
							a.position.x = 16;
						if (a.position.x + a.size.width > 624)
							a.position.x = 624 - a.size.width;
						var g = this.checkTileCollision(a);
						if (g !== false) {
							d.push("x");
							a.position.x = a.position.x + a.size.width / 2 < g.x
									* this.tileSize.width
									+ this.tileSize.width
									/ 2 ? g.x * this.tileSize.width
									- a.size.width : g.x * this.tileSize.width
									+ this.tileSize.width
						}
					}
				}
				if (a.direction.y !== 0) {
					a.position.y += a.direction.y * e;
					if (a.collidable) {
						if (a.position.y + a.size.height > 400)
							a.position.y = 400 - a.size.height;
						g = this.checkTileCollision(a);
						if (g !== false) {
							d.push("y");
							a.position.y = a.position.y + a.size.height / 2 < g.y
									* this.tileSize.height
									+ this.tileSize.height / 2 ? g.y
									* this.tileSize.height - a.size.height
									: g.y * this.tileSize.height
											+ this.tileSize.height
						}
					}
				}
				if (a.collidable) {
					e = 0;
					if (this.gateState === "down" || a.role === "monster"
							|| a.role === "hero")
						e = 64;
					if (a.direction.y < 0 && a.position.y < e) {
						a.position.y = e;
						d.push("y")
					}
					d.length > 0 && a.wallCollide(d)
				}
			};
			f.dropObject = function(a, b) {
				var d = c.makeObject(b);
				d.position = a.position.clone();
				d.position.y -= 1;
				if (this.isSpecialLoot(b))
					d.position = new c.Vector2(304, 226);
				this.addObject(d);
				if (this.isSpecialLoot(b)) {
					var e = c.makeObject("pickup_arrow");
					e.position = d.position.clone();
					e.position.x = 320 - e.size.width / 2;
					e.position.y -= e.size.height + 10;
					this.addObject(e)
				}
			};
			f.isSpecialLoot = function(a) {
				return a === "item_weapon_fire_sword"
						|| a === "item_gold_chest"
			};
			f.spawnLoot = function(a) {
				if (!(a.position.y < 44)) {
					for ( var b = a.lootTable, d = b.length, e = [], g = 0; g < d; g++)
						for ( var i = b[g], h = 0; h < i.weight; h++)
							e.push(i.type);
					b = c.randomRange(0, e.length - 1);
					e = e[b];
					if (e !== null) {
						b = this.getPlayerObject();
						if (e === "item_food" && b.wounds === 0)
							e = "item_chest";
						if (e === "WEAPON_DROP")
							switch (c.randomRange(1, 4)) {
							case 1:
								e = "item_weapon_knife";
								break;
							case 2:
								e = "item_weapon_spear";
								break;
							case 3:
								e = "item_weapon_fireball";
								break;
							case 4:
								e = "item_weapon_axe"
							}
						if (e.indexOf("item_weapon") >= 0
								&& b.hasWeapon("h_fire_sword"))
							e = "item_chest";
						this.dropObject(a, e)
					}
				}
			};
			c.Engine.prototype.updateObjects = function(a) {
				var b = 0, d = 0, e;
				for (e in this.objects) {
					var g = this.objects[e];
					if (g.isDead()) {
						if (g.role === "hero") {
							this.endGame();
							return
						}
						g.execute("onDelete", [ this ]);
						delete this.objects[g.id]
					} else {
						if (g.role === "monster" || g.type === "pickup_arrow") {
							b++;
							g.position.y <= 64 && d++
						}
						switch (g.update(a, this)) {
						case "shoot":
							this.objectAttack(g)
						}
						g.isMoving() && !g.hasState(c.Object.states.STUNNED)
								&& this.moveObject(g, a);
						if (!(g.role === "fluff" || g.role === "powerup_food"
								|| g.hasState(c.Object.states.DYING) || g
								.hasState(c.Object.states.INVISIBLE))) {
							for ( var i in this.objects) {
								var h = this.objects[i];
								if (!(h.isDead() || h.team === g.team
										|| h.role === "fluff"
										|| h.hasState(c.Object.states.DYING) || h
										.hasState(c.Object.states.INVISIBLE)))
									if (g.boundingBox().reduce(5).intersects(
											h.boundingBox().reduce(5))) {
										if (g.role == "hero")
											if (h.role == "powerup_food") {
												h.die();
												g.wounds -= h.healAmount;
												if (g.wounds < 0)
													g.wounds = 0;
												g.meatEaten++;
												c.sound.play("eat_food");
												for ( var j = 0; j < 5; ++j) {
													var k = c
															.makeObject("mini_heart");
													k.position.x = g.position.x
															+ j
															* (g.size.width / 5);
													k.position.y = g.position.y
															+ g.size.height
															- c
																	.randomRange(
																			0,
																			g.size.height);
													this.addObject(k)
												}
											} else if (h.role == "powerup_coin") {
												h.die();
												g.gold += h.coinAmount;
												c.sound.play("coins");
												if (this.isSpecialLoot(h.type))
													for (j in this.objects)
														this.objects[j].type === "pickup_arrow"
																&& this.objects[j]
																		.die()
											} else if (h.role == "powerup_weapon") {
												h.die();
												g.addWeapon(h.wepType,
														h.wepCount);
												c.sound.play("pickup_weapon");
												k = this.weaponPickup;
												k.type = h.type;
												k.scale = 1;
												k.alpha = 0.9;
												k.position = h.position.clone();
												k.state = "on";
												if (this.isSpecialLoot(h.type))
													for (j in this.objects)
														this.objects[j].type === "pickup_arrow"
																&& this.objects[j]
																		.die()
											}
										if (g.team !== null && h.team !== null
												&& g.team !== h.team) {
											this.dealDamage(h, g);
											this.dealDamage(g, h)
										}
									}
							}
							if (this.isBadassWeapon(g)) {
								if (g.glow === undefined) {
									g.glow = {
										alpha : 0,
										increment : 0.2,
										timer : new c.Timer
									};
									g.glow.timer.start(50)
								}
								g.glow.timer.update(a);
								if (g.glow.timer.expired()) {
									g.glow.timer.reset();
									g.glow.alpha += g.glow.increment;
									if (g.glow.alpha >= 0.8) {
										g.glow.alpha = 0.8;
										g.glow.increment = -0.2
									}
									if (g.glow.alpha <= 0.2) {
										g.glow.alpha = 0.2;
										g.glow.increment = 0.2
									}
								}
							}
						}
					}
				}
				this.monstersAlive = b;
				this.monstersAboveGates = d > 0;
				b = this.getPlayerObject();
				if (this.woundsTo < b.wounds)
					this.woundsTo += this.woundsToSpeed / 1E3 * a;
				else if (this.woundsTo > b.wounds)
					this.woundsTo -= this.woundsToSpeed / 1E3 * a;
				else
					this.woundsTo = b.wounds;
				d = this.getTotalScore();
				e = c.clamp(Math.abs(this.scoreCount - d), 1E3, 1E4);
				a = Math.floor(e / 1E3 * a);
				if (this.scoreCount < d) {
					this.scoreCount += a;
					if (this.scoreCount > d)
						this.scoreCount = d
				} else if (this.scoreCount > d) {
					this.scoreCount -= a;
					if (this.scoreCount < d)
						this.scoreCount = d
				}
				if (Math.abs(b.wounds - this.woundsTo) <= 1)
					this.woundsTo = b.wounds
			};
			c.Engine.prototype.dealDamage = function(a, b) {
				if (a.role === "monster" && b.role === "projectile")
					return false;
				a.execute("onObjectCollide", [ b, this ]);
				if (a.role == "projectile" && b.role == "trap"
						|| a.role == "trap" && b.role == "projectile")
					return false;
				var d = b.execute("onThreat", [ a, this ]);
				if (b.hasState(c.Object.states.INVINCIBLE)
						|| b.hitPoints === Infinity || d === true) {
					if (a.role === "projectile" && a.hitPoints !== Infinity)
						if ((b.damageType === "magic" || b.damageType === "physical")
								&& a.damageType === "physical") {
							a.reverseDirection();
							a.deflect();
							c.sound.play("immunity")
						} else
							a.die();
					return false
				}
				if (a.hitPoints !== Infinity && a.role === "projectile"
						&& b.role === "projectile"
						&& a.damageType === "physical"
						&& b.damageType === "physical") {
					if (a.piercing === false) {
						a.reverseDirection();
						a.deflect()
					}
					if (b.piercing === false) {
						b.reverseDirection();
						b.deflect()
					}
					return false
				}
				a.execute("onDamage", [ b, this ]);
				d = a;
				if (d.ownerId !== null) {
					var e = this.objects[d.ownerId];
					if (e)
						d = e
				}
				a.role === "projectile" && d.shotsLanded++;
				if (b.wound(a.damage)) {
					d.gold += b.worth;
					d.kills++;
					b.execute("onKilled", [ a, this ]);
					b.lootTable.length > 0 && this.spawnLoot(b);
					a.role === "projectile" && a.piercing === false
							&& a.hitPoints !== Infinity && a.die()
				} else {
					a.damage > 0 && b.role === "hero"
							&& b.addState(c.Object.states.INVINCIBLE, 2500);
					a.role === "projectile" && a.hitPoints !== Infinity
							&& a.die()
				}
			};
			f.updateTargetReticle = function() {
				this.targetReticle.moving = false;
				var a = new c.Vector2(this.mouse.mouseX, this.mouse.mouseY), b = new c.Rect(
						32, 64, 576, 320), d = this.targetReticle.position;
				if (d.x !== a.x && d.y !== a.y) {
					this.targetReticle.moving = true;
					var e = d.clone().subtract(a.clone()).abs();
					this.targetReticle.angle += c
							.clamp((e.x + e.y) * 2, 1, 100)
							/ 1E3 * this.lastElapsed;
					if (this.targetReticle.angle > Math.PI * 2)
						this.targetReticle.angle = 0
				}
				d.x = a.x < b.left ? b.left : a.x > b.left + b.width ? b.left
						+ b.width : a.x;
				d.y = a.y < b.top ? b.top : a.y > b.top + b.height ? b.top
						+ b.height : a.y
			};
			f.handleInput = function() {
				var a = this.keyboard, b = c.Keyboard.Keys, d = c.Mouse.Buttons, e = new c.Vector2(
						this.mouse.mouseX, this.mouse.mouseY), g, i = false;
				if (this.state == "running") {
					if (this.keyboard.isKeyPressed(b.ESCAPE))
						if (this.showTutorial) {
							this.tutorialIndex = 4;
							this.nextTutorial(5);
							return
						}
					if (this.keyboard.isKeyPressed(b.P)
							|| this.keyboard.isKeyPressed(b.ESCAPE)) {
						this.togglePause();
						this.keyboard.clearKeys();
						return
					}
					if (this.paused)
						i = true;
					this.canMute && this.keyboard.isKeyPressed(77)
							&& c.sound.toggleMuted();
					this.canFullscreen && this.keyboard.isKeyPressed(70)
							&& this.toggleFullscreen();
					if (this.keyboard.isKeyPressed(75))
						this.wasdMovesArrowsAttack = !this.wasdMovesArrowsAttack;
					if (!c.isDemo()) {
						if (this.keyboard.historyMatch(c.Keyboard.meatboyCode)) {
							var h = this.getPlayerObject();
							h.isMeatboy = true;
							h.initMeatBoy()
						}
						if (this.keyboard.historyMatch(c.Keyboard.godModeCode)) {
							this.keyboard.clearHistory();
							h = this.getPlayerObject();
							h.cheater = true;
							h.hasState(c.Object.states.INVINCIBLE) ? h
									.removeState(c.Object.states.INVINCIBLE)
									: h.addState(c.Object.states.INVINCIBLE);
							c.sound.play("code_entered")
						}
						if (this.keyboard
								.historyMatch(c.Keyboard.allWeaponsCode)) {
							this.keyboard.clearHistory();
							h = this.getPlayerObject();
							h.cheater = true;
							h.weapons = [ {
								type : "h_fire_sword",
								count : null
							} ];
							c.sound.play("code_entered")
						}
						if (this.keyboard.historyMatch(c.Keyboard.awesmCode)) {
							this.keyboard.clearHistory();
							h = this.getPlayerObject();
							h.cheater = true;
							h.weapons = [ {
								type : "h_fire_knife",
								count : null
							} ];
							c.sound.play("code_entered")
						}
						if (this.keyboard.historyMatch(c.Keyboard.bombCode)) {
							this.keyboard.clearHistory();
							h = this.getPlayerObject();
							h.cheater = true;
							h.weapons = [ {
								type : "h_firebomb",
								count : null
							} ];
							c.sound.play("code_entered")
						}
						if (this.keyboard.historyMatch(c.Keyboard.debugCode)) {
							this.keyboard.clearHistory();
							this.debug = !this.debug;
							c.sound.play("code_entered")
						}
						if (this.keyboard.historyMatch(c.Keyboard.resetCode)) {
							this.keyboard.clearHistory();
							this.clearData("checkpoint_wave");
							this.clearData("checkpoint_hero");
							this.putData("high_score", 1E3);
							c.sound.play("code_entered")
						}
						if (this.keyboard.historyMatch(c.Keyboard.cyclopsCode)) {
							h = this.getPlayerObject();
							if (!h.cheater) {
								c.sound.play("code_entered");
								this.keyboard.clearHistory();
								h.cheater = true;
								h.hitPoints *= 2;
								h.size = new c.Size(64, 64);
								h.spriteY = 224;
								h.weapons = [ {
									type : "e_boulder",
									count : null
								} ];
								h.wounds *= 2
							}
						}
					}
					if (this.paused) {
						h = this.pointerYStart - 22;
						if (this.verifyQuit) {
							if (e.x >= 270 && e.x <= 462 && e.y > h
									&& e.y < h + 23) {
								if (this.mouse.hasMoved && this.pointerY !== 0)
									g = 0;
								if (this.mouse.isButtonDown(d.LEFT))
									this.keyboard.keyStates[b.SPACE] = true
							}
							if (e.x >= 270 && e.x <= 462 && e.y > h + 24
									&& e.y < h + 24 + 36) {
								if (this.mouse.hasMoved && this.pointerY !== 1)
									g = 1;
								if (this.mouse.isButtonDown(d.LEFT))
									this.keyboard.keyStates[b.SPACE] = true
							}
						} else {
							if (e.x >= 270 && e.x <= 376 && e.y > h
									&& e.y < h + 23) {
								if (this.mouse.hasMoved && this.pointerY !== 0)
									g = 0;
								if (this.mouse.isButtonDown(d.LEFT))
									this.keyboard.keyStates[b.SPACE] = true
							}
							if (e.x >= 270 && e.x <= 376 && e.y > h + 24
									&& e.y < h + 24 + 36) {
								if (this.mouse.hasMoved && this.pointerY !== 1)
									g = 1;
								if (this.mouse.isButtonDown(d.LEFT))
									this.keyboard.keyStates[b.SPACE] = true
							}
						}
						if (a.isKeyPressed(b.ENTER) || a.isKeyPressed(b.SPACE)) {
							a.clearKey(b.ENTER);
							a.clearKey(b.SPACE);
							this.mouse.clearButtons();
							switch (this.pointerY) {
							case 0:
								this.togglePause();
								break;
							case 1:
								c.sound.play("select_pointer");
								if (this.verifyQuit) {
									this.verifyQuit = false;
									this.togglePause();
									h = this.getPlayerObject();
									h.wound(100)
								} else {
									this.pointerY = 0;
									this.verifyQuit = true
								}
							}
						}
					}
				}
				if (this.state === "title") {
					i = true;
					if (!this.konamiEntered
							&& this.keyboard
									.historyMatch(c.Keyboard.konamiCode)) {
						c.sound.play("code_entered");
						this.konamiEntered = true;
						h = this.getPlayerObject();
						h.cheater = true;
						h.hitPoints *= 3
					}
					h = this.pointerYStart - 22;
					if (c.isDemo() || this.canContinue())
						if (e.x >= 230 && e.x <= 400 && e.y >= h
								&& e.y < h + 20) {
							if (this.mouse.hasMoved && this.pointerY !== 0)
								g = 0;
							if (this.mouse.isButtonDown(d.LEFT))
								this.keyboard.keyStates[b.SPACE] = true
						}
					h += 24;
					if (e.x >= 230 && e.x <= 400 && e.y >= h && e.y < h + 20) {
						if (this.mouse.hasMoved && this.pointerY !== 1)
							g = 1;
						if (this.mouse.isButtonDown(d.LEFT))
							this.keyboard.keyStates[b.SPACE] = true
					}
					h += 24;
					if (e.x >= 230 && e.x <= 400 && e.y >= h && e.y < h + 20) {
						if (this.mouse.hasMoved && this.pointerY !== 2)
							g = 2;
						if (this.mouse.isButtonDown(d.LEFT))
							this.keyboard.keyStates[b.SPACE] = true
					}
					if (a.isKeyPressed(b.ENTER) || a.isKeyPressed(b.SPACE)) {
						c.sound.play("select_pointer");
						a.clearKey(b.ENTER);
						a.clearKey(b.SPACE);
						this.mouse.clearButtons();
						switch (this.pointerY) {
						case 0:
							if (c.isDemo())
								location.href = "https://chrome.google.com/extensions/detail/khodnfbkbanejphecblcofbghjdgfaih";
							else {
								h = this.getData("checkpoint_wave");
								if (h !== null) {
									this.currentWaveId = h - 1;
									var j = this.getData("checkpoint_hero");
									if (j !== null) {
										h = this.getPlayerObject();
										h.load(j);
										h.totalDamageTaken += h.wounds;
										h.wounds = 0
									}
									this.continuing = true;
									this.showTutorial = false;
									this.state = "intro_cinematic"
								}
							}
							break;
						case 1:
							this.continuing = false;
							this.showTutorial = !this.touchMove;
							this.state = "intro_cinematic";
							break;
						case 2:
							this.state = "credits"
						}
					}
				}
				if (this.state == "buy_now") {
					i = true;
					h = this.pointerYStart - 22;
					if (e.x >= 270 && e.x <= 376 && e.y > h && e.y < h + 23) {
						if (this.mouse.hasMoved && this.pointerY !== 0)
							g = 0;
						if (this.mouse.isButtonDown(d.LEFT))
							this.keyboard.keyStates[b.SPACE] = true
					}
					if (e.x >= 270 && e.x <= 376 && e.y > h + 24
							&& e.y < h + 24 + 36) {
						if (this.mouse.hasMoved && this.pointerY !== 1)
							g = 1;
						if (this.mouse.isButtonDown(d.LEFT))
							this.keyboard.keyStates[b.SPACE] = true
					}
					if (a.isKeyPressed(b.ENTER) || a.isKeyPressed(b.SPACE)) {
						a.clearKey(b.ENTER);
						a.clearKey(b.SPACE);
						this.mouse.clearButtons();
						c.sound.play("select_pointer");
						switch (this.pointerY) {
						case 0:
							location.href = "https://chrome.google.com/extensions/detail/khodnfbkbanejphecblcofbghjdgfaih";
							break;
						case 1:
							c.sound.stop("victory");
							this.initGame()
						}
					}
				}
				if (this.state === "credits")
					if (this.keyboard.isAnyKeyPressed()
							|| this.mouse.isAnyButtonDown()) {
						a.clearKeys();
						this.mouse.clearButtons();
						this.state = "title"
					}
				if (this.state === "intro_cinematic")
					if (this.keyboard.isAnyKeyPressed()
							|| this.mouse.isAnyButtonDown()) {
						a.clearKeys();
						this.mouse.clearButtons();
						this.state = "running";
						h = this.getPlayerObject();
						this.woundsTo = h.wounds;
						this.currentMusic = "normal_battle_music";
						c.sound.play(this.currentMusic)
					}
				if (i) {
					if (this.keyboard.isKeyPressed(b.W)
							|| this.keyboard.isKeyPressed(b.UP)) {
						this.keyboard.keyStates[b.W] = false;
						this.keyboard.keyStates[b.UP] = false;
						this.pointerY--;
						if (this.pointerY < this.pointerOptionsStart)
							this.pointerY = this.maxPointerY;
						c.sound.play("move_pointer")
					}
					if (this.keyboard.isKeyPressed(b.S)
							|| this.keyboard.isKeyPressed(b.DOWN)) {
						this.keyboard.keyStates[b.S] = false;
						this.keyboard.keyStates[b.DOWN] = false;
						this.pointerY++;
						if (this.pointerY > this.maxPointerY)
							this.pointerY = this.pointerOptionsStart;
						c.sound.play("move_pointer")
					}
					this.keyboard.storeKeyStates();
					if (g !== undefined) {
						c.sound.play("move_pointer");
						this.pointerY = g
					}
				}
				if (this.state === "running") {
					h = this.getPlayerObject();
					if (this.paused || h.hasState(c.Object.states.DYING))
						this.keyboard.storeKeyStates();
					else {
						if (this.touchMove) {
							this.targetReticle.angle += Math.PI * 2 / 5E3
									* this.lastElapsed;
							if (this.targetReticle.angle > Math.PI * 2)
								this.targetReticle.angle = 0;
							if (this.mouse.wasButtonClicked(d.LEFT)
									|| this.mouse.isButtonDown(d.LEFT)) {
								g = new c.Rect(48, 80, 544, 288);
								i = this.targetReticle.position;
								i.x = e.x < g.left ? g.left : e.x > g.left
										+ g.width ? g.left + g.width : e.x;
								i.y = e.y < g.top ? g.top : e.y > g.top
										+ g.height ? g.top + g.height : e.y
							}
						} else
							this.updateTargetReticle();
						i = new c.Vector2;
						g = new c.Vector2;
						if (this.touchMove) {
							a = this.getNearestHostile(h);
							if (a !== null)
								g = a.boundingBox().center().subtract(
										h.boundingBox().center()).normalize();
							i = this.targetReticle.position.clone().subtract(
									h.boundingBox().center()).normalize();
							this.targetReticle.position.clone().subtract(
									h.boundingBox().center()).magnitude() < 3
									&& i.zero()
						} else {
							b = this.wasdMovesArrowsAttack ? {
								moveUp : b.W,
								moveLeft : b.A,
								moveDown : b.S,
								moveRight : b.D,
								attackUp : b.UP,
								attackDown : b.DOWN,
								attackLeft : b.LEFT,
								attackRight : b.RIGHT
							} : {
								moveUp : b.UP,
								moveDown : b.DOWN,
								moveLeft : b.LEFT,
								moveRight : b.RIGHT,
								attackUp : b.W,
								attackLeft : b.A,
								attackDown : b.S,
								attackRight : b.D
							};
							if (a.isKeyDown(b.moveUp)) {
								i.y = -1;
								this.nextTutorial(1)
							}
							if (a.isKeyDown(b.moveLeft)) {
								i.x = -1;
								this.nextTutorial(1)
							}
							if (a.isKeyDown(b.moveDown)) {
								i.y = 1;
								this.nextTutorial(1)
							}
							if (a.isKeyDown(b.moveRight)) {
								i.x = 1;
								this.nextTutorial(1)
							}
							if (a.isKeyDown(b.attackUp)) {
								g.y = -1;
								this.nextTutorial(2)
							}
							if (a.isKeyDown(b.attackDown)) {
								g.y = 1;
								this.nextTutorial(2)
							}
							if (a.isKeyDown(b.attackLeft)) {
								g.x = -1;
								this.nextTutorial(2)
							}
							if (a.isKeyDown(b.attackRight)) {
								g.x = 1;
								this.nextTutorial(2)
							}
						}
						h.stopMoving();
						if (i.x !== 0 || i.y !== 0)
							h.setDirection(i);
						if (this.mouse.wasButtonClicked(d.LEFT))
							if (this.showTutorial && e.y <= 70 + this.tutorialY) {
								this.tutorialIndex = 4;
								this.nextTutorial(5);
								this.mouse.clearButtons()
							} else if (e.x >= 604 && e.x <= 636 && e.y >= 443
									&& e.y <= 475)
								if (this.canFullscreen) {
									this.toggleFullscreen();
									this.mouse.clearButtons()
								} else
									this.togglePause();
							else if (this.canMute && e.x >= 506 && e.x <= 602
									&& e.y >= 416 && e.y <= 474) {
								c.sound.toggleMuted();
								this.mouse.clearButtons()
							}
						if (this.mouse.isButtonDown(d.LEFT) && !this.touchMove) {
							d = this.targetReticle.position.clone().subtract(
									h.boundingBox().center()).normalize();
							this.objectAttack(h, d);
							this.heroFiring = true;
							this.heroFiringDirection = d;
							this.nextTutorial(4);
							this.showReticle = true
						} else if (g.x !== 0 || g.y !== 0) {
							this.objectAttack(h, g);
							this.heroFiring = true;
							this.heroFiringDirection = g
						} else {
							this.heroFiring = false;
							this.heroFiringDirection = null
						}
						this.keyboard.storeKeyStates();
						this.mouse.storeButtonStates()
					}
				}
			};
			f.getNearestHostile = function(a) {
				var b = {
					obj : null,
					distance : Infinity
				}, d;
				for (d in this.objects) {
					var e = this.objects[d];
					if (e.team != a.team
							&& (e.role == "monster" || e.role == "projectile")
							&& e.hitPoints !== Infinity
							&& this.isAlive(e.id)
							&& !(e.hasState(c.Object.states.INVINCIBLE) || e
									.hasState(c.Object.states.INVISIBLE))) {
						var g = a.boundingBox().center().subtract(
								e.boundingBox().center()).magnitude();
						if (g < b.distance) {
							b.obj = e;
							b.distance = g
						}
					}
				}
				return b.obj === null ? null : b.obj
			};
			f.objectAttack = function(a, b) {
				if (!b)
					b = a.facing;
				var d = a.fireWeapon();
				if (d !== false) {
					var e = c.objectTypes[d];
					switch (d) {
					case "e_minotaur_trident":
						for ( var g = b.heading(), i = -0.5; i <= 0.5; i += 0.5)
							this
									.spawnObject(a, d, c.Vector2.fromHeading(g
											+ i));
						a.shotsFired += 3;
						break;
					case "h_knife":
					case "h_fire_knife":
						g = b.heading();
						this.spawnObject(a, d, c.Vector2.fromHeading(g - 0.1));
						this.spawnObject(a, d, c.Vector2.fromHeading(g + 0.1));
						a.shotsFired += 2;
						break;
					case "e_fireball_green":
						for (i = -0.25; i <= 0.25; i += 0.25) {
							g = b.heading();
							g += i + c.randomRange(-1, 1) / 10;
							this.spawnObject(a, d, c.Vector2.fromHeading(g))
						}
						a.shotsFired += 3;
						break;
					case "h_fireball":
						g = b.heading();
						var h = c.Vector2.fromHeading(g);
						i = this.spawnObject(a, d, h.clone());
						i = this.objects[i];
						i.position.add(c.Vector2.fromHeading(g - Math.PI / 2)
								.scale(16));
						i.position.add(h.clone().scale(16));
						i = this.spawnObject(a, d, h.clone());
						i = this.objects[i];
						i.position.add(h.clone().scale(32));
						i = this.spawnObject(a, d, h.clone());
						i = this.objects[i];
						i.position.add(c.Vector2.fromHeading(g + Math.PI / 2)
								.scale(16));
						i.position.add(h.clone().scale(16));
						a.shotsFired += 3;
						break;
					case "h_firebomb":
						var j = this.targetReticle.position.clone();
						h = Math.PI * 2;
						var k = h / 20;
						for (g = 0; g < h; g += k) {
							i = c.makeObject("h_fireball");
							i.position.x = j.x - 16;
							i.position.y = j.y - 16;
							i.setDirection(c.Vector2.fromHeading(g));
							i.ownerId = a.id;
							i.team = a.team;
							this.addObject(i);
							a.shotsFired += 1
						}
						break;
					case "e_ring_fire":
						h = Math.PI * 2;
						k = h / 10;
						for (g = i = k / 2; g < h + i; g += k)
							this.spawnObject(a, d, c.Vector2.fromHeading(g));
						break;
					case "e_ring_fire_dopp":
						h = Math.PI * 2;
						k = h / 10;
						for (g = 0; g < h; g += k)
							this.spawnObject(a, d, c.Vector2.fromHeading(g));
						break;
					case "e_bouncing_boulder":
						h = Math.PI * 2;
						k = h / 8;
						for (g = 0; g < h; g += k)
							this.spawnObject(a, d, c.Vector2.fromHeading(g));
						break;
					default:
						this.spawnObject(a, d, b);
						a.shotsFired++
					}
					a.shotsPerWeapon[d] || (a.shotsPerWeapon[d] = 0);
					a.shotsPerWeapon[d]++;
					d = null;
					if (e.soundAttacks)
						d = e.soundAttacks;
					else if (a.soundAttacks)
						d = a.soundAttacks;
					d !== null && c.sound.play(d)
				}
			};
			f.render = function() {
				var a = this.canvases.display.getContext("2d");
				switch (this.state) {
				case "intro":
					this.drawLogo(a);
					break;
				case "title":
					this.drawTitle(a);
					this.drawPointer(a);
					this.drawTitlePointerOptions(a);
					break;
				case "credits":
					this.drawTitle(a);
					this.drawCredits(a);
					break;
				case "intro_cinematic":
					this.drawIntroCinematic(a);
					break;
				case "running":
					this.drawFloor(a);
					this.wonGame || this.drawTargetReticle(a);
					this.drawObjects(a);
					this.drawFauxGates(a);
					this.drawWalls(a);
					this.drawWeaponPickup(a);
					this.drawWaveText(a);
					this.drawUI(a);
					if (this.paused) {
						this.drawPaused(a);
						this.drawPointer(a);
						this.drawPausedPointerOptions(a)
					}
					this.showTutorial && this.drawTutorial(a);
					break;
				case "game_over":
					this.drawGameOver(a);
					break;
				case "buy_now":
					this.drawBuyNow(a);
					this.drawPointer(a)
				}
				this.debug === true && this.drawDebugInfo(a)
			};
			f.drawWeaponPickup = function(a) {
				var b = this.weaponPickup;
				if (b.state === "on") {
					var d = c.makeObject(b.type);
					a.save();
					a.translate(b.position.x + d.size.width / 2, b.position.y
							+ d.size.height / 2);
					a.globalAlpha = b.alpha;
					a.drawImage(this.images.getImage("objects"), 128, 192, 48,
							48, -22 * b.scale, -20 * b.scale, 48 * b.scale,
							48 * b.scale);
					a.drawImage(this.images.getImage(d.spriteSheet), d.spriteX,
							d.spriteY + 1, d.size.width - 1, d.size.height - 1,
							-(d.size.width / 2 * b.scale),
							-(d.size.height / 2 * b.scale), d.size.width
									* b.scale, d.size.height * b.scale);
					a.restore()
				}
			};
			f.drawWaveText = function(a) {
				if (this.waveText.state == "show"
						|| this.waveText.state == "hide"
						|| this.waveText.state == "display") {
					var b = this.waveText.string, d = parseInt(this.waveText.size), e = this.canvases.buffer
							.getContext("2d");
					e.save();
					e.clearRect(0, 0, 320, 240);
					e.font = "Bold " + d + "px Cracked";
					e.textBaseline = "top";
					e.lineWidth = 3;
					e.strokeStyle = "rgb(0, 0, 0)";
					e.fillStyle = "rgb(230, 103, 8)";
					var g = 160 - e.measureText(b).width / 2;
					d = 120 - d / 2 - 20;
					e.strokeText(b, g, d);
					e.fillText(b, g, d);
					e.restore();
					a.save();
					a.globalAlpha = this.waveText.alpha;
					a.drawImage(this.canvases.buffer, 0, 0, 320, 240, 0, 0,
							640, 480);
					a.restore()
				}
			};
			f.drawGameOver = function(a) {
				if (this.goAlphaStep) {
					this.goAlpha += this.goAlphaStep;
					if (this.goAlpha <= 0) {
						this.goAlpha = 0;
						this.goAlphaStep = 0.025
					}
					if (this.goAlpha >= 1) {
						this.goAlpha = 1;
						this.goAlphaStep = -0.025
					}
				} else {
					this.goAlphaStep = -0.025;
					this.goAlpha = 1
				}
				if (!this.gameOverBg) {
					this.drawUI(a);
					this.gameOverBg = a.getImageData(0, 0, this.view.width,
							this.view.height)
				}
				a.putImageData(this.gameOverBg, 0, 0);
				a.save();
				a.globalAlpha = this.gameOverAlpha;
				a.fillStyle = this.wonGame ? "rgb(0, 0, 0)"
						: "rgb(215, 25, 32)";
				a.fillRect(0, 0, this.view.width, this.view.height);
				a.restore();
				if (this.gameOverReady === true) {
					if (this.keyboard.isAnyKeyPressed()
							|| this.mouse.isAnyButtonDown()) {
						this.keyboard.clearKeys();
						this.mouse.clearButtons();
						this.statsIndex += 1;
						if (this.statsIndex >= 5) {
							if (c.isDemo()) {
								this.state = "buy_now";
								this.initOptions()
							} else {
								c.sound.stop("victory");
								this.initGame()
							}
							return
						}
					}
					a.drawImage(this.preloader.getImage("ui"), 0, 2322, 564,
							404, 38, 38, 564, 404);
					if (this.wonGame)
						a.drawImage(this.preloader.getImage("ui"), 564, 2444,
								256, 50, 192, 70, 256, 50);
					else
						this.gotNewHighScore ? a.drawImage(this.preloader
								.getImage("ui"), 564, 2374, 404, 50, 119, 70,
								404, 50) : a.drawImage(this.preloader
								.getImage("ui"), 564, 2324, 218, 50, 211, 70,
								218, 50);
					this.drawObjectStats(this.getPlayerObject(), a);
					this.statsIndex >= 4
							&& a.drawImage(this.preloader.getImage("ui"), 564,
									2424, 334, 20, 153, 404, 334, 20)
				}
			};
			f.drawBuyNow = function(a) {
				a.save();
				a.globalAlpha = 0.7;
				a.fillRect(0, 0, this.view.width, this.view.height);
				a.globalAlpha = 1;
				a.drawImage(this.preloader.getImage("ui"), 370, 0, 564, 404,
						38, 38, 564, 404);
				a.restore();
				var b = this.pointerYStart - 22, d;
				d = this.pointerY == 0 ? 260 : 0;
				a.drawImage(this.preloader.getImage("ui"), d, 2122, 200, 40,
						270, b, 200, 40);
				d = this.pointerY == 1 ? 260 : 0;
				b += 24;
				a.drawImage(this.preloader.getImage("ui"), d, 2182, 200, 40,
						270, b, 200, 40)
			};
			f.drawObjectStats = function(a, b) {
				b.save();
				b.font = "Bold 40px Cracked";
				var d, e = 0, g = 0, i = this.currentWaveId;
				if (this.wonGame)
					i += 1;
				var h = 0;
				if (this.statsIndex === 0) {
					h = this.statsCount;
					e = i;
					d = 199;
					g = 10
				} else
					h = i;
				b.fillStyle = "rgb(199, 234, 251)";
				b.fillText(h + " x 1000", 350, 182);
				i = 0;
				if (this.statsIndex === 1) {
					i = this.statsCount;
					e = a.gold;
					g = d = 10
				} else if (this.statsIndex > 1)
					i = a.gold;
				b.fillStyle = "rgb(255, 245, 121)";
				b.fillText(i, 350, 235);
				i = 0;
				if (this.statsIndex === 2) {
					i = this.statsCount;
					e = a.totalDamageTaken;
					d = 299;
					g = 5
				} else if (this.statsIndex > 2)
					i = a.totalDamageTaken;
				b.fillStyle = "rgb(237, 28, 36)";
				b.fillText("-" + i + " x 10", 350, 290);
				i = "";
				h = this.getTotalScore();
				if (this.statsIndex === 3) {
					i = this.statsCount;
					e = h
				} else if (this.statsIndex > 3)
					i = h;
				b.fillStyle = "rgb(250, 166, 26)";
				b.fillText(i, 350, 349);
				if (this.statsCount >= e) {
					this.statsCount = 0;
					this.statsIncrement = d;
					this.statsIndex += 1;
					this.statsTimer.start(g)
				}
				b.restore()
			};
			f.getTotalScore = function() {
				var a = this.getPlayerObject(), b = this.currentWaveId;
				if (this.wonGame)
					b += 1;
				b *= 1E3;
				b += a.gold;
				b -= a.totalDamageTaken * 10;
				if (a.cheater === true)
					b /= 2;
				if (b < 0)
					b = 0;
				return b
			};
			f.drawLogo = function(a) {
				a.save();
				a.fillStyle = "rgb(0, 0, 0)";
				a.fillRect(0, 0, this.view.width, this.view.height);
				a.restore();
				if (this.logoAlpha > 0) {
					a.save();
					a.globalAlpha = this.logoAlpha;
					a.drawImage(this.preloader.getImage("ui"), 0, 0, 370, 430,
							160, 0, 370, 430);
					a.restore()
				}
			};
			f.drawFloor = function(a) {
				var b = this.getArenaOffset();
				a.drawImage(this.images.getImage("arena"), b + 32, 480, 576,
						386, 32, 0, 576, 386)
			};
			f.drawWalls = function(a) {
				var b = this.getArenaOffset();
				a.drawImage(this.images.getImage("arena"), b, 0, 640, 480, 0,
						0, this.view.width, this.view.height)
			};
			f.getArenaOffset = function() {
				return 640 * Math
						.floor((this.currentWaveId >= 0 ? this.currentWaveId
								: 0) / 10)
			};
			f.drawPaused = function(a) {
				a.save();
				a.globalAlpha = 0.7;
				a.fillRect(0, 0, this.view.width, this.view.height);
				a.globalAlpha = 1;
				a.drawImage(this.preloader.getImage("ui"), 0, 1718, 564, 404,
						38, 38, 564, 404);
				var b = this.getPlayerObject();
				a.font = "Bold 36px Cracked";
				a.textAlign = "left";
				a.fillStyle = "rgb(237, 28, 36)";
				a.fillText(b.kills, 390, 164);
				a.fillStyle = "rgb(145, 102, 0)";
				a.fillText(b.meatEaten, 390, 216);
				a.fillStyle = "rgb(199, 234, 251)";
				a.fillText(b.shotsFired, 390, 270);
				a.fillStyle = "rgb(250, 166, 26)";
				a.fillText(this.getAccuracy(b) + "%", 390, 324);
				a.restore()
			};
			f.getAccuracy = function(a) {
				if (a.shotsFired === 0)
					return 0;
				return Math.round(a.shotsLanded / a.shotsFired * 100)
			};
			f.drawTutorial = function(a) {
				if (!this.paused) {
					a.save();
					a.globalAlpha = 0.7;
					a.fillRect(0, this.tutorialY, this.view.width, 70);
					a.globalAlpha = 1;
					a.font = "Bold 30px Cracked";
					a.textAlign = "center";
					var b = [ "MOVE with the WASD keys.",
							"ATTACK with the ARROW keys.",
							"Or use the MOUSE to AIM with the target reticle.",
							"ATTACK by HOLDING DOWN the LEFT MOUSE BUTTON.",
							"KILL MONSTERS and COLLECT GOLD to raise your score!" ];
					a.fillStyle = "rgb(0, 0, 0)";
					a.fillText(b[this.tutorialIndex], 322, this.tutorialY + 36);
					a.fillStyle = "rgb(230, 230, 230)";
					a.fillText(b[this.tutorialIndex], 320, this.tutorialY + 34);
					a.font = "20px Cracked";
					a.fillStyle = "rgb(0, 0, 0)";
					a.fillText("Press here or ESC to skip", 322,
							this.tutorialY + 62);
					a.fillStyle = "rgb(118, 151, 183)";
					a.fillText("Press here or ESC to skip", 320,
							this.tutorialY + 60);
					a.restore()
				}
			};
			f.getObjectDrawOrder = function() {
				var a = [], b;
				for (b in this.objects) {
					var d = this.objects[b];
					a.push({
						id : d.id,
						drawIndex : d.drawIndex,
						y : d.position.y + d.size.height
					})
				}
				a.sort(function(e, g) {
					return e.drawIndex === g.drawIndex ? e.y - g.y
							: e.drawIndex - g.drawIndex
				});
				return a
			};
			f.drawObject = function(a, b) {
				var d = b.role === "hero" && this.heroFiring ? b
						.getSpriteXY(this.heroFiringDirection) : b
						.getSpriteXY();
				if (!(b.alpha <= 0 || b.hasState(c.Object.states.INVISIBLE))) {
					a.save();
					a.translate(b.position.x + b.size.width / 2, b.position.y
							+ b.size.height / 2);
					b.angle !== 0 && a.rotate(b.angle * Math.PI / 180);
					if (b.alpha !== 1)
						a.globalAlpha = b.alpha;
					b.role === "powerup_weapon"
							&& a.drawImage(this.images.getImage("objects"),
									128, 192, 48, 48, -22, -20, 48, 48);
					a.drawImage(this.images.getImage(b.spriteSheet), d.x,
							d.y + 1, b.size.width - 1, b.size.height - 1,
							-(b.size.width / 2), -(b.size.height / 2),
							b.size.width, b.size.height);
					if (b.spriteYOverlay) {
						a.save();
						a.globalAlpha = 1 - b.wounds / b.hitPoints + 0.3;
						a.drawImage(this.images.getImage(b.spriteSheet), d.x,
								b.spriteYOverlay + 1, b.size.width - 1,
								b.size.height - 1, -(b.size.width / 2),
								-(b.size.height / 2), b.size.width,
								b.size.height);
						a.restore()
					}
					b.role === "monster"
							&& b.badass
							&& b.hasState(c.Object.states.HURTING)
							&& this.drawImageOverlay(a, this.images
									.getImage(b.spriteSheet), d.x, d.y + 1,
									b.size.width - 1, b.size.height - 1,
									-(b.size.width / 2), -(b.size.height / 2),
									b.size.width, b.size.height,
									"rgba(186, 51, 35, 0.6)");
					this.isBadassWeapon(b)
							&& b.glow
							&& this
									.drawImageOverlay(a, this.images
											.getImage(b.spriteSheet), d.x,
											d.y + 1, b.size.width - 1,
											b.size.height - 1,
											-(b.size.width / 2),
											-(b.size.height / 2), b.size.width,
											b.size.height,
											"rgba(255, 247, 143, "
													+ b.glow.alpha + ")");
					if (this.debug && b.role === "monster" || b.badass
							&& !b.hasState(c.Object.states.DYING)) {
						d = b.size.width - 2;
						d -= Math.round(d * b.wounds / b.hitPoints);
						a.fillStyle = "rgb(241, 241, 242)";
						a.fillRect(-(b.size.width / 2), b.size.height / 2,
								b.size.width, 8);
						a.fillStyle = "rgb(0, 0, 0)";
						a.fillRect(-(b.size.width / 2) + 1,
								b.size.height / 2 + 1, b.size.width - 2, 6);
						a.fillStyle = this.getBarColor(b.hitPoints, b.hitPoints
								- b.wounds);
						a.fillRect(-(b.size.width / 2) + 1,
								b.size.height / 2 + 1, d, 6)
					}
					a.restore()
				}
			};
			f.isBadassWeapon = function(a) {
				return a.role === "projectile" && a.hitPoints === Infinity
						&& a.team === 1 && a.type != "e_fireball"
						&& a.type != "e_static_blue_fire"
						&& a.type != "e_static_green_fire"
			};
			c.Engine.prototype.drawObjects = function(a) {
				var b = this.getObjectDrawOrder(), d;
				for (d in b)
					this.drawObject(a, this.objects[b[d].id])
			};
			f.drawTargetReticle = function(a) {
				if (this.showReticle) {
					a.save();
					a.globalAlpha = 0.75;
					a.translate(this.targetReticle.position.x,
							this.targetReticle.position.y);
					a.rotate(this.targetReticle.angle);
					a.drawImage(this.images.getImage("objects"), 256, 192, 64,
							64, -32, -32, 64, 64);
					a.restore()
				}
			};
			f.drawImageOverlay = function(a, b, d, e, g, i, h, j, k, m, n) {
				var l = this.canvases.buffer.getContext("2d");
				l.save();
				l.clearRect(0, 0, 640, 480);
				l.drawImage(b, d, e, g, i, 0, 0, k, m);
				l.globalCompositeOperation = "source-in";
				l.fillStyle = n;
				l.fillRect(0, 0, k, m);
				l.restore();
				a.drawImage(this.canvases.buffer, 0, 0, k, m, h, j, k, m)
			};
			f.drawUI = function(a) {
				var b = this.getPlayerObject(), d = b.getWeaponInfo(), e = c.objectTypes[d.type];
				d = d.count ? d.count : "";
				a.drawImage(this.images.getImage("objects"), e.spriteX,
						e.spriteY, 32, 32, 4, 412, 32, 32);
				a.drawImage(this.images.getImage("objects"), 32, 32, 32, 32, 4,
						443, 32, 32);
				a.save();
				a.textAlign = "left";
				a.font = "Bold 38px Cracked";
				a.globalAlpha = 0.75;
				a.fillStyle = "rgb(0, 0, 0)";
				a.fillText(d, 48, 444);
				a.fillText(this.scoreCount, 48, 474);
				a.globalAlpha = 1;
				a.fillStyle = "rgb(241, 241, 242)";
				a.fillText(d, 46, 440);
				a.fillText(this.scoreCount, 46, 472);
				a.restore();
				if (b.hitPoints > 1) {
					e = {
						width : 280,
						height : 24,
						x : 180,
						y : 432
					};
					var g = e.width
							- Math.round(e.width * b.wounds / b.hitPoints), i = e.width
							- Math.round(e.width * this.woundsTo / b.hitPoints);
					if (this.woundsTo < b.wounds) {
						d = g;
						g = i
					} else
						d = i;
					a.save();
					a.fillStyle = "rgb(241, 241, 242)";
					a.fillRect(e.x - 2, e.y - 2, e.width + 2, e.height + 4);
					a.fillRect(e.x + e.width, e.y, 2, e.height);
					a.fillStyle = "rgb(0, 0, 0)";
					a.fillRect(e.x, e.y, e.width, e.height);
					a.fillStyle = this.getBarColor(b.hitPoints, b.hitPoints
							- b.wounds);
					a.globalAlpha = 0.4;
					a.fillRect(e.x, e.y, g, e.height);
					a.fillRect(e.x, e.y, d, e.height);
					a.fillRect(e.x, e.y + 5, d, e.height - 10);
					a.fillRect(e.x, e.y + 10, d, e.height - 20);
					a.restore();
					b = (b.hitPoints - b.wounds) / b.hitPoints * 100;
					d = 352;
					if (b > 50)
						d = 224;
					else if (b > 25)
						d = 288;
					a.drawImage(this.images.getImage("objects"), d, 64, 42, 42,
							e.x - 32, 424, 42, 42)
				}
				if (this.canMute)
					a.drawImage(this.images.getImage("objects"), c.sound
							.isMuted() ? 96 : 0, 96, 96, 58, 506, 416, 96, 58);
				if (this.canFullscreen) {
					d = this.enableFullscreen ? 596 : 564;
					a.drawImage(this.preloader.getImage("ui"), d, 910, 32, 32,
							604, 443, 32, 32)
				} else
					a.drawImage(this.preloader.getImage("ui"), 628, 910, 32,
							32, 604, 443, 32, 32)
			};
			f.drawTitle = function(a) {
				a.drawImage(this.preloader.getImage("ui"), 0, 430, 640, 480, 0,
						0, 640, 480);
				var b = "High Score: " + this.getData("high_score");
				a.save();
				a.font = "Bold 36px Cracked";
				a.textAlign = "center";
				a.fillStyle = "rgb(0, 0, 0)";
				a.fillText(b, 322, 456);
				a.fillStyle = "rgb(230, 230, 230)";
				a.fillText(b, 320, 454);
				a.restore();
				b = "v1.2.26";
				if (c.isDemo())
					b += " demo";
				a.save();
				a.font = "Bold 14px Monospace";
				a.textAlign = "right";
				a.fillStyle = "rgb(0, 0, 0)";
				a.fillText(b, 638, 478);
				a.fillStyle = "rgb(230, 230, 230)";
				a.fillText(b, 636, 476);
				a.restore();
				a.save();
				a.font = "Bold 14px Monospace";
				a.fillStyle = "rgb(0, 0, 0)";
				a.fillText("Lost Decade Games \u00a9 2010", 6, 478);
				a.fillStyle = "rgb(230, 230, 230)";
				a.fillText("Lost Decade Games \u00a9 2010", 4, 476);
				a.restore()
			};
			f.drawPointer = function(a) {
				var b = this.pointerYStart + this.pointerY * 24 - 24;
				a.save();
				a.drawImage(this.images.getImage("objects"), 320, 192, 36, 26,
						228, b, 36, 26);
				a.restore()
			};
			f.canContinue = function() {
				var a = this.getData("checkpoint_wave");
				return Boolean(a)
			};
			f.drawTitlePointerOptions = function(a) {
				var b = this.pointerYStart - 22, d;
				if (c.isDemo()) {
					d = this.pointerY == 0 ? 638 : 430;
					a.drawImage(this.preloader.getImage("ui"), 800, d, 128, 26,
							270, b, 128, 26)
				} else {
					d = this.canContinue() ? this.pointerY == 0 ? 638 : 430
							: 534;
					a.drawImage(this.preloader.getImage("ui"), 640, d, 116, 20,
							270, b, 116, 20)
				}
				d = this.pointerY == 1 ? 664 : 456;
				a.drawImage(this.preloader.getImage("ui"), 640, d, 132, 26,
						270, b + 24, 132, 26);
				d = this.pointerY == 2 ? 690 : 482;
				a.drawImage(this.preloader.getImage("ui"), 640, d, 90, 22, 270,
						b + 48, 90, 22)
			};
			f.drawPausedPointerOptions = function(a) {
				var b = this.pointerYStart - 22, d;
				if (this.verifyQuit) {
					d = this.pointerY == 0 ? 1932 : 1860;
					a.drawImage(this.preloader.getImage("ui"), 564, d, 158, 26,
							270, b, 158, 26)
				} else {
					d = this.pointerY == 0 ? 1788 : 1718;
					a.drawImage(this.preloader.getImage("ui"), 564, d, 106, 26,
							270, b, 106, 26)
				}
				if (this.verifyQuit) {
					d = this.pointerY == 1 ? 1966 : 1894;
					a.drawImage(this.preloader.getImage("ui"), 564, d, 192, 32,
							270, b + 24, 196, 32)
				} else {
					d = this.pointerY == 1 ? 1822 : 1752;
					a.drawImage(this.preloader.getImage("ui"), 564, d, 70, 36,
							270, b + 24, 70, 36)
				}
			};
			f.initOptions = function() {
				switch (this.state) {
				case "title":
					this.pointerYStart = 314;
					if (c.isDemo() || this.canContinue())
						this.pointerOptionsStart = this.pointerY = 0;
					else
						this.pointerOptionsStart = this.pointerY = 1;
					this.maxPointerY = 2;
					break;
				case "running":
					this.pointerYStart = 378;
					this.pointerY = 0;
					this.maxPointerY = 1;
					this.pointerOptionsStart = 0;
					this.verifyQuit = false;
					break;
				case "buy_now":
					this.pointerYStart = 378;
					this.pointerY = 0;
					this.maxPointerY = 1;
					this.pointerOptionsStart = 0
				}
			};
			f.drawCredits = function(a) {
				a.save();
				a.globalAlpha = 0.7;
				a.fillRect(0, 0, this.view.width, this.view.height);
				a.globalAlpha = 1;
				a.drawImage(this.preloader.getImage("ui"), 0, 1314, 564, 404,
						38, 38, 564, 404);
				a.restore()
			};
			f.drawIntroCinematic = function(a) {
				switch (this.introPhase) {
				case 0:
					if (!this.introFadeOutBg) {
						this.introFadeOutBg = a.getImageData(0, 0,
								this.view.width, this.view.height);
						this.introFadeAlpha = 0
					}
					a.fillStyle = "rgb(0, 0, 0)";
					a.fillRect(0, 0, 640, 480);
					a.save();
					a.putImageData(this.introFadeOutBg, 0, 0);
					a.restore();
					if (this.introFadeAlpha > 0) {
						a.save();
						a.globalAlpha = this.introFadeAlpha;
						a.fillStyle = "rgb(0, 0, 0)";
						a.fillRect(0, 0, 640, 480);
						a.restore()
					}
					break;
				case 1:
					this.drawFloor(a);
					this.drawFauxGates(a);
					this.drawWalls(a);
					if (this.introFadeAlpha > 0) {
						a.save();
						a.globalAlpha = this.introFadeAlpha;
						a.fillStyle = "rgb(0, 0, 0)";
						a.fillRect(0, 0, 640, 480);
						a.restore()
					}
					break;
				case 2:
				case 3:
					this.drawFloor(a);
					this.drawFauxGates(a);
					this.drawWalls(a);
					break;
				case 4:
				case 5:
				case 9:
					this.drawFloor(a);
					this.introHero && this.drawObject(a, this.introHero);
					this.drawFauxGates(a);
					this.drawWalls(a);
					break;
				case 6:
				case 7:
				case 8:
					this.drawFloor(a);
					a.drawImage(this.images.getImage("characters"), 640, 0, 32,
							32, 304, 224, 32, 32);
					this.drawFauxGates(a);
					this.drawWalls(a)
				}
			};
			f.drawFauxGates = function(a) {
				for ( var b = 0; b < 3; b++) {
					var d = 0, e = 192;
					if (b > 0) {
						d = 320;
						e = b == 1 ? 288 : 352
					}
					a.drawImage(this.images.getImage("objects"), d, e, 64, 64,
							this.gatesX + 96 + b * 192, this.gatesY, 64, 64)
				}
			};
			f.drawDebugInfo = function(a) {
				a.save();
				a.fillStyle = "rgba(0, 0, 0, 0.3)";
				a.fillRect(0, 0, this.view.width, 30);
				a.restore();
				a.save();
				a.fillStyle = "rgb(241, 241, 242)";
				a.font = "Bold 20px Monospace";
				a.fillText("Elapsed: " + this.lastElapsed, 10, 20);
				a.textAlign = "right";
				a
						.fillText(Math.round(1E3 / this.lastElapsed) + " FPS",
								630, 20);
				a.restore()
			};
			f.getData = function(a) {
				if (window.localStorage && window.localStorage.getItem)
					return window.localStorage.getItem(a)
			};
			f.putData = function(a, b) {
				window.localStorage && window.localStorage.setItem
						&& window.localStorage.setItem(a, b)
			};
			f.clearData = function(a) {
				window.localStorage && window.localStorage.removeItem
						&& window.localStorage.removeItem(a)
			};
			f.endGame = function() {
				this.gameOverReady = false;
				this.gameOverAlpha = 0;
				this.updateGameOver();
				this.state = "game_over";
				this.timePlayed = c.now() - this.gameStartTime
			};
			f.toggleFullscreen = function() {
				c.sound.play("select_pointer");
				this.enableFullscreen = !this.enableFullscreen;
				this.putData("fullscreen", this.enableFullscreen ? 1 : 0);
				this.resize()
			}
		})();
		(function() {
			c.Object = function() {
				this.id = "";
				this.ownerId = null;
				this.position = new c.Vector2;
				this.size = new c.Size(32, 32);
				this.direction = new c.Vector2;
				this.facing = new c.Vector2(0, 1);
				this.speed = 100;
				this.team = null;
				this.damage = this.hitPoints = 1;
				this.spriteSheet = "";
				this.spriteY = this.spriteX = 0;
				this.animated = this.spriteAlign = false;
				this.animFrameIndex = 0;
				this.animNumFrames = 2;
				this.animDelay = 200;
				this.spawnFrameIndex = this.animElapsed = 0;
				this.spawnFrameCount = 2;
				this.angle = this.spawnFramesY = this.spawnFramesX = 0;
				this.rotateSpeed = 400;
				this.rotate = false;
				this.ttlElapsed = this.ttl = this.worth = 0;
				this.alphaMod = this.alpha = 1;
				this.gibletSize = "small";
				this.cooldown = false;
				this.cooldownElapsed = 0;
				this.autoFire = false;
				this.soundDies = this.soundDamage = this.soundAttacks = null;
				this.alive = true;
				this.states = [];
				this.addState(c.Object.states.IDLE);
				this.currentWeaponIndex = 0;
				this.bounce = this.collidable = true;
				this.piercing = false;
				this.soundDies = this.soundDamage = null;
				this.damageType = "physical";
				this.drawIndex = 1;
				this.moveChangeElapsed = 0;
				this.moveChangeDelay = 500;
				this.wounds = 0;
				this.weapons = [];
				this.shotsLanded = this.shotsFired = this.totalDamageTaken = this.timesWounded = this.kills = this.gold = 0;
				this.shotsPerWeapon = {};
				this.meatEaten = 0;
				this.cheater = false;
				this.phase = 0;
				this.phaseInit = false;
				this.lootTable = [];
				this.killSwitch = false
			};
			c.Object.states = {
				IDLE : 0,
				MOVING : 1,
				ATTACKING : 2,
				HURTING : 3,
				DYING : 4,
				INVINCIBLE : 5,
				INVISIBLE : 6,
				SPAWNING : 7,
				DESPAWNING : 8,
				STUNNED : 9,
				VICTORIOUS : 10
			};
			var f = c.Object.prototype;
			f.load = function(a) {
				a = JSON.parse(a);
				this.wounds = a.wounds;
				this.weapons = a.weapons;
				this.currentWeaponIndex = a.currentWeaponIndex;
				this.gold = a.gold;
				this.kills = a.kills;
				this.timesWounded = a.timesWounded;
				this.totalDamageTaken = a.totalDamageTaken;
				this.shotsFired = a.shotsFired;
				this.shotsLanded = a.shotsLanded;
				this.shotsPerWeapon = a.shotsPerWeapon;
				this.meatEaten = a.meatEaten;
				this.cheater = a.cheater
			};
			f.setPhase = function(a) {
				this.phase = a;
				this.phaseInit = false
			};
			f.nextPhase = function() {
				this.setPhase(this.phase + 1)
			};
			f.updateStates = function(a) {
				for ( var b in this.states) {
					var d = this.states[b];
					d.timer.update(a);
					d.timer.expired() && this.removeStateById(b)
				}
			};
			f.hasState = function(a) {
				for ( var b in this.states)
					if (this.states[b].type === a)
						return true;
				return false
			};
			f.addState = function(a, b) {
				if (this.hasState(a))
					return false;
				var d = new c.Timer;
				d.start(b);
				this.states.push({
					type : a,
					timer : d
				});
				switch (a) {
				case c.Object.states.SLOWED:
					this.oldAnimDelay = this.animDelay;
					this.animDelay *= 2
				}
			};
			f.removeStateById = function(a) {
				switch (this.states[a].type) {
				case c.Object.states.INVINCIBLE:
					this.alpha = 1;
					this.alphaMod = -1;
					break;
				case c.Object.states.SLOWED:
					this.animDelay = this.oldAnimDelay
				}
				delete this.states[a]
			};
			f.removeState = function(a) {
				for ( var b in this.states)
					this.states[b].type === a && this.removeStateById(b)
			};
			f.init = function() {
				this.execute("onInit");
				if (this.rotate)
					this.angle = c.randomRange(0, 359);
				if (this.animated)
					this.animElapsed = c.randomRange(0, this.animDelay)
			};
			f.die = function() {
				this.alive = false
			};
			f.isDead = function() {
				return !this.alive
			};
			f.update = function(a, b) {
				if (this.killSwitch === false && this.ownerId !== null
						&& !b.isAlive(this.ownerId)) {
					switch (this.role) {
					case "projectile":
					case "trap":
						this.ttl = 1E3;
						this.ttlElapsed = 0;
						break;
					case "monster":
						this.wound(this.hitPoints)
					}
					this.killSwitch = true
				}
				this.updateStates(a);
				this.deathTimer && this.deathTimer.update(a);
				if (this.hasState(c.Object.states.DYING))
					if (this.deathTimer.expired()) {
						this.deathFrameIndex++;
						this.deathTimer.reset();
						if (this.deathFrameIndex > 2) {
							this.deathFrameIndex = 2;
							this.ttl = 750
						}
					}
				if (this.hasState(c.Object.states.INVINCIBLE)) {
					this.alpha += 0.01 * a * this.alphaMod;
					if (this.alpha >= 1) {
						this.alpha = 1;
						this.alphaMod = -1
					}
					if (this.alpha <= 0) {
						this.alpha = 0;
						this.alphaMod = 1
					}
				}
				if (!this.hasState(c.Object.states.STUNNED)) {
					if (this.animated) {
						this.animElapsed += a;
						if (this.animElapsed >= this.animDelay) {
							this.animElapsed = 0;
							this.animFrameIndex++;
							if (this.animFrameIndex > this.animNumFrames - 1)
								this.animFrameIndex = 0;
							if (this.hasState(c.Object.states.SPAWNING)) {
								this.spawnFrameIndex++;
								this.spawnFrameIndex > this.spawnFrameCount
										&& this
												.removeState(c.Object.states.SPAWNING)
							}
							if (this.hasState(c.Object.states.DESPAWNING)) {
								this.spawnFrameIndex--;
								this.spawnFrameIndex < 0
										&& this
												.removeState(c.Object.states.DESPAWNING)
							}
						}
					}
					if (this.spriteAlign)
						this.angle = this.facing.angle();
					if (this.rotate)
						this.angle += this.rotateSpeed / 1E3 * a;
					if (this.ttl > 0) {
						this.ttlElapsed += a;
						if (this.ttl - this.ttlElapsed <= 1E3)
							this.alpha -= 0.0010 * a;
						this.ttlElapsed >= this.ttl && this.die()
					}
					if (this.cooldown === true) {
						this.cooldownElapsed += a;
						var d = this.getWeaponInfo();
						if (this.cooldownElapsed >= c.objectTypes[d.type].cooldown) {
							this.cooldown = false;
							this.cooldownElapsed = 0
						}
					}
					this.phaseTimer && this.phaseTimer.update(a);
					if (!this.hasState(c.Object.states.DYING))
						return this.execute("onUpdate", arguments)
				}
			};
			f.getSpriteXY = function(a) {
				if (this.animated)
					switch (this.role) {
					case "hero":
					case "monster":
						if (this.hasState(c.Object.states.DYING))
							return new c.Vector2((17 + this.deathFrameIndex)
									* this.size.width, this.spriteY);
						if (this.hasState(c.Object.states.SPAWNING)
								|| this.hasState(c.Object.states.DESPAWNING))
							return new c.Vector2(this.spawnFramesX
									+ this.spawnFrameIndex * this.size.width,
									this.spawnFramesY);
						if (this.hasState(c.Object.states.HURTING)
								&& this.size.width <= 32)
							return new c.Vector2(16 * this.size.width,
									this.spriteY);
						if (this.hasState(c.Object.states.VICTORIOUS))
							return new c.Vector2(20 * this.size.width,
									this.spriteY);
						a = a ? a : this.facing.clone();
						a = c.directions.fromVector(a);
						return new c.Vector2((a * 2 + this.animFrameIndex)
								* this.size.width, this.spriteY);
					default:
						if (this.hasState(c.Object.states.SPAWNING)
								|| this.hasState(c.Object.states.DESPAWNING))
							return new c.Vector2(this.spawnFramesX
									+ this.spawnFrameIndex * this.size.width,
									this.spawnFramesY);
						return new c.Vector2(this.spriteX + this.animFrameIndex
								* this.size.width, this.spriteY)
					}
				else
					return new c.Vector2(this.spriteX, this.spriteY)
			};
			f.boundingBox = function() {
				var a = new c.Rect(this.position.x, this.position.y,
						this.size.width - 1, this.size.height - 1);
				this.role === "projectile" && a.reduce(1);
				if (this.type === "e_spit_pool") {
					a.y += this.size.height / 4;
					a.x += 5;
					a.height -= this.size.height / 2;
					a.width -= 10
				}
				if (this.type === "gas_cloud") {
					a.y += 32;
					a.x += 32;
					a.height -= 32;
					a.width -= 32
				}
				return a
			};
			f.centerOn = function(a) {
				this.position = a.subtract(c.Vector2.fromSize(this.size).scale(
						0.5))
			};
			f.wound = function(a) {
				if (a < 1 || this.hasState(c.Object.states.DYING)
						|| this.isDead())
					return false;
				this.removeState(c.Object.states.STUNNED);
				this.wounds += a;
				this.totalDamageTaken += a;
				this.timesWounded++;
				if (this.role === "monster" || this.role === "hero")
					this.addState(c.Object.states.HURTING, 300);
				if (this.wounds >= this.hitPoints) {
					this.wounds = this.hitPoints;
					if (this.role === "monster" || this.role === "hero") {
						this.addState(c.Object.states.DYING);
						this.deathFrameIndex = 0;
						this.deathTimer = new c.Timer;
						this.deathTimer.start(200)
					} else
						this.die();
					this.role === "hero" && c.sound.stopAll();
					this.soundDies && c.sound.play(this.soundDies);
					return true
				}
				this.soundDamage && c.sound.play(this.soundDamage);
				return false
			};
			f.wallCollide = function(a) {
				if (this.role !== "hero") {
					if (this.bounce) {
						var b = this.direction.clone(), d;
						for (d in a)
							b[a[d]] *= -1;
						this.setDirection(b);
						this.role === "projectile"
								&& c.sound.play("weapon_wall")
					} else
						this.damageType === "physical" ? this.deflect() : this
								.die();
					this.execute("onWallCollide", [ a ])
				}
			};
			f.deflect = function() {
				this.role = "fluff";
				this.rotateSpeed = this.speed * 5;
				this.speed *= 0.5;
				this.spriteAlign = false;
				this.rotate = true;
				this.ttl = 100;
				this.alpha = 0.5;
				this.bounce = true
			};
			f.setDirection = function(a) {
				if (a.x === 0 && a.y === 0)
					this.stopMoving();
				else {
					this.direction = a;
					this.facing = this.direction.clone()
				}
			};
			f.reverseDirection = function() {
				var a = this.direction.clone();
				a.scale(-1);
				this.setDirection(a)
			};
			f.chase = function(a) {
				this.moveToward(a.position.clone())
			};
			f.moveToward = function(a) {
				this
						.setDirection(a.clone().subtract(this.position)
								.normalize())
			};
			f.isMoving = function() {
				if (this.hasState(c.Object.states.DYING))
					return false;
				return this.direction.x !== 0 || this.direction.y !== 0
			};
			f.stopMoving = function() {
				this.direction.zero()
			};
			f.execute = function(a, b) {
				if (this[a])
					return this[a].apply(this, b)
			};
			f.getWeaponInfo = function() {
				var a = this.weapons.length;
				if (a >= 1) {
					if (this.currentWeaponIndex < 0)
						this.currentWeaponIndex = 0;
					if (this.currentWeaponIndex > a - 1)
						this.currentWeaponIndex = a - 1;
					return this.weapons[this.currentWeaponIndex]
				}
				return false
			};
			f.addWeapon = function(a, b) {
				var d = [], e;
				for (e in this.weapons) {
					var g = this.weapons[e];
					if (typeof g !== "undefined" && g.type === a)
						if (g.count !== null)
							b += g.count;
						else
							b = null;
					g.count !== null && d.push(e)
				}
				for ( var i in d)
					this.weapons = this.weapons.splice(i, 1);
				this.currentWeaponIndex = this.weapons.push({
					type : a,
					count : b
				}) - 1
			};
			f.cycleWeapon = function(a) {
				var b = this.weapons.length;
				if (a === true) {
					this.currentWeaponIndex--;
					if (this.currentWeaponIndex < 0)
						this.currentWeaponIndex = b - 1
				} else {
					this.currentWeaponIndex++;
					if (this.currentWeaponIndex > b - 1)
						this.currentWeaponIndex = 0
				}
			};
			f.fireWeapon = function() {
				var a = this.weapons.length;
				if (this.cooldown === true || a < 1)
					return false;
				a = this.getWeaponInfo();
				if (a.count !== null) {
					a.count -= 1;
					a.count < 1
							&& this.weapons.splice(this.currentWeaponIndex, 1)
				}
				this.cooldown = true;
				return a.type
			};
			f.hasWeapon = function(a) {
				for ( var b = this.weapons.length, d = 0; d < b; ++d)
					if (this.weapons[d].type === a)
						return true;
				return false
			}
		})();
		(function() {
			c.objectTypes = {};
			var f = c.objectTypes;
			f.hero = {
				role : "hero",
				team : 0,
				speed : 150,
				hitPoints : 100,
				damage : 0,
				damageType : null,
				spriteSheet : "characters",
				spriteY : 992,
				animated : true,
				soundAttacks : "hero_attacks",
				soundDamage : "hero_damage",
				soundDies : "hero_dies",
				weapons : [ {
					type : "h_sword",
					count : null
				} ],
				isMeatboy : false,
				bloodTimer : null,
				onInit : function() {
					this.isMeatboy && this.initMeatBoy()
				},
				initMeatBoy : function() {
					this.hitPoints = 1;
					this.spriteY = 1024;
					this.bloodTimer = new c.Timer;
					this.bloodTimer.start(100)
				},
				onUpdate : function(b, d) {
					if (this.isMeatboy) {
						this.bloodTimer.update(b);
						if (this.bloodTimer.expired() && this.isMoving()) {
							var e = d.spawnObject(this, "blood_pool");
							e = d.objects[e];
							e.position.x += c.randomRange(-8, 8);
							e.position.y += c.randomRange(-8, 8);
							e.angle = c.randomRange(0, Math.PI * 1.5);
							this.bloodTimer.start(c.randomRange(75, 150))
						}
					}
				},
				onKilled : function(b, d) {
					for ( var e = 0; e < 10; ++e) {
						var g = c.makeObject("mini_skull");
						g.position.x = this.position.x + e
								* (this.size.width / 10);
						g.position.y = this.position.y + this.size.height
								- c.randomRange(0, this.size.height);
						d.addObject(g)
					}
				}
			};
			f.blood_pool = {
				role : "fluff",
				size : new c.Size(32, 32),
				speed : 0,
				ttl : 1250,
				collidable : false,
				spriteSheet : "objects",
				spriteX : 128,
				spriteY : 32,
				drawIndex : 0
			};
			f.h_sword = {
				role : "projectile",
				cooldown : 300,
				speed : 250,
				hitPoints : 1,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 64,
				spriteY : 0,
				spriteAlign : true,
				priority : 0,
				bounce : false
			};
			f.h_knife = {
				role : "projectile",
				size : new c.Size(32, 30),
				cooldown : 200,
				speed : 350,
				hitPoints : 1,
				damage : 5,
				spriteSheet : "objects",
				spriteX : 32,
				spriteY : 0,
				spriteAlign : true,
				priority : 1,
				bounce : false
			};
			f.h_spear = {
				role : "projectile",
				cooldown : 350,
				speed : 500,
				hitPoints : 1,
				damage : 15,
				spriteSheet : "objects",
				spriteX : 96,
				spriteY : 0,
				spriteAlign : true,
				priority : 2,
				bounce : false,
				piercing : true
			};
			f.h_fireball = {
				role : "projectile",
				cooldown : 300,
				speed : 400,
				rotateSpeed : 500,
				hitPoints : 1,
				damage : 3,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 0,
				rotate : true,
				ttl : 450,
				soundAttacks : "fire_attack",
				priority : 3,
				bounce : false,
				damageType : "magic",
				onInit : function() {
					this.trailTimer = new c.Timer;
					this.trailTimer.start(75)
				},
				onUpdate : function(b, d) {
					this.trailTimer.update(b);
					if (this.trailTimer.expired()) {
						d.spawnObject(this, "h_fireball_trail");
						this.trailTimer.reset()
					}
				}
			};
			f.h_fireball_trail = {
				role : "projectile",
				speed : 0,
				rotateSpeed : 150,
				hitPoints : 1,
				damage : 5,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 0,
				rotate : true,
				ttl : 500,
				alpha : 0.5,
				priority : 3,
				bounce : false,
				damageType : "magic",
				drawIndex : 0
			};
			f.h_axe = {
				role : "projectile",
				cooldown : 500,
				speed : 225,
				hitPoints : 1,
				damage : 20,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 32,
				rotate : true,
				rotateSpeed : 700,
				priority : 5,
				ttl : 4E3,
				piercing : true
			};
			f.h_fire_sword = {
				role : "projectile",
				cooldown : 450,
				speed : 350,
				hitPoints : 1,
				damage : 25,
				spriteSheet : "objects",
				spriteX : 384,
				spriteY : 0,
				priority : 6,
				bounce : false,
				spriteAlign : true,
				piercing : true,
				soundAttacks : "fire_attack",
				damageType : "magic",
				onInit : function() {
					this.spawnTimer = new c.Timer;
					this.spawnTimer.start(50)
				},
				onUpdate : function(b, d) {
					this.spawnTimer.update(b);
					if (this.spawnTimer.expired()) {
						d.spawnObject(this, "fire_sword_trail");
						this.spawnTimer.reset()
					}
				}
			};
			f.fire_sword_trail = {
				role : "projectile",
				speed : 0,
				hitPoints : 1,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 0,
				rotate : true,
				soundAttacks : "fire_attack",
				ttl : 500,
				bounce : false,
				drawIndex : 0,
				damageType : "magic"
			};
			f.h_fire_knife = {
				role : "projectile",
				size : new c.Size(32, 30),
				cooldown : 200,
				speed : 350,
				hitPoints : 1,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 128,
				spriteY : 0,
				priority : 6,
				bounce : false,
				spriteAlign : true,
				piercing : true,
				soundAttacks : "fire_attack",
				damageType : "magic",
				onInit : function() {
					this.spawnTimer = new c.Timer;
					this.spawnTimer.start(50)
				},
				onUpdate : function(b, d) {
					this.spawnTimer.update(b);
					if (this.spawnTimer.expired()) {
						d.spawnObject(this, "fire_sword_trail");
						this.spawnTimer.reset()
					}
				}
			};
			f.h_firebomb = {
				role : "projectile",
				cooldown : 500,
				speed : 150,
				rotateSpeed : 300,
				hitPoints : 1,
				damage : 2,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 0,
				rotate : true,
				ttl : 550,
				soundAttacks : "fire_attack",
				priority : 3,
				bounce : false,
				damageType : "magic"
			};
			var a = {
				chase : function(b, d) {
					if (this.moveChangeDelay > 0) {
						this.moveChangeElapsed += b;
						if (this.moveChangeElapsed < this.moveChangeDelay)
							return;
						this.moveChangeElapsed = 0
					}
					this.chase(d.getPlayerObject());
					return "shoot"
				},
				getNear : function(b, d) {
					this.speed = this.defaultSpeed;
					var e = d.getPlayerObject(), g = e.position.clone()
							.subtract(this.position).magnitude();
					if (g < 100) {
						this.chase(e);
						this.setDirection(this.direction.invert())
					} else if (g > 150)
						this.chase(e);
					else if (this.cooldown)
						a.wander.apply(this, arguments);
					else {
						this.chase(e);
						this.speed = 0;
						return "shoot"
					}
				},
				wander : function(b) {
					this.moveChangeElapsed += b;
					if (this.moveChangeElapsed >= this.moveChangeDelay) {
						this.moveChangeElapsed = 0;
						b = c.randomDirection();
						b.x === 0 && b.y === 0 || this.setDirection(b)
					}
				},
				wanderShoot : function(b, d) {
					var e = d.getPlayerObject(), g = e.position.clone()
							.subtract(this.position).abs();
					if (!this.cooldown
							&& (g.x < e.size.width / 2 || g.y < e.size.height / 2)) {
						this.chase(e);
						return "shoot"
					} else
						a.wander.apply(this, arguments)
				},
				wanderThenChase : function(b, d) {
					var e = d.getPlayerObject();
					e = {
						x : e.position.x,
						y : e.position.y
					};
					var g = this.position.x, i = this.position.y;
					if (this.seenHero)
						a.chase.apply(this, arguments);
					else {
						a.wander.apply(this, arguments);
						i = Math.abs(i - e.y);
						if (Math.abs(g - e.x) < 64 && i < 64) {
							c.sound.play(this.soundAttacks);
							this.seenHero = true;
							return "shoot"
						}
					}
				}
			};
			f.bat = {
				role : "monster",
				team : 1,
				speed : 100,
				hitPoints : 5,
				damage : 2,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 96,
				animated : true,
				animDelay : 150,
				moveChangeElapsed : 0,
				moveChangeDelay : 500,
				soundDamage : "bat_damage",
				soundDies : "bat_dies",
				lootTable : [ {
					type : null,
					weight : 9
				}, {
					type : "item_coin",
					weight : 1
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3)
				},
				onUpdate : function() {
					if (this.position.y >= 50)
						this.onUpdate = a.wander
				}
			};
			f.dire_bat = {
				role : "monster",
				team : 1,
				speed : 150,
				hitPoints : 10,
				damage : 5,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 128,
				animated : true,
				animDelay : 150,
				moveChangeElapsed : 0,
				moveChangeDelay : 500,
				soundDamage : "bat_damage",
				soundDies : "bat_dies",
				lootTable : [ {
					type : null,
					weight : 7
				}, {
					type : "item_coin",
					weight : 3
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3)
				},
				onUpdate : function() {
					if (this.position.y >= 50)
						this.onUpdate = a.wander
				}
			};
			f.goblin = {
				role : "monster",
				team : 1,
				speed : 75,
				hitPoints : 10,
				damage : 10,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 160,
				animated : true,
				gibletSize : "medium",
				moveChangeElapsed : 0,
				moveChangeDelay : 3E3,
				weapons : [ {
					type : "e_arrow",
					count : null
				} ],
				soundAttacks : "goblin_attacks",
				soundDamage : "goblin_damage",
				soundDies : "goblin_dies",
				lootTable : [ {
					type : null,
					weight : 6
				}, {
					type : "item_coin",
					weight : 1
				}, {
					type : "WEAPON_DROP",
					weight : 2
				}, {
					type : "item_food",
					weight : 1
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3)
				},
				onUpdate : function() {
					if (this.position.y >= 50)
						this.onUpdate = a.wanderShoot
				}
			};
			f.hunter_goblin = {
				role : "monster",
				team : 1,
				speed : 75,
				hitPoints : 10,
				damage : 10,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 160,
				animated : true,
				gibletSize : "medium",
				moveChangeElapsed : 0,
				moveChangeDelay : 3E3,
				weapons : [ {
					type : "e_arrow",
					count : null
				} ],
				soundAttacks : "goblin_attacks",
				soundDamage : "goblin_damage",
				soundDies : "goblin_dies",
				lootTable : [ {
					type : null,
					weight : 2
				}, {
					type : "item_coin",
					weight : 4
				}, {
					type : "WEAPON_DROP",
					weight : 2
				}, {
					type : "item_food",
					weight : 2
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3)
				},
				onUpdate : function(b, d) {
					if (this.position.y >= 50) {
						if (!this.cooldown) {
							this.chase(d.getPlayerObject());
							return "shoot"
						}
						a.wander.apply(this, arguments)
					}
				}
			};
			f.demoblin = {
				role : "monster",
				team : 1,
				speed : 75,
				defaultSpeed : 75,
				hitPoints : 30,
				damage : 15,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 192,
				animated : true,
				gibletSize : "medium",
				moveChangeElapsed : 0,
				moveChangeDelay : 3E3,
				weapons : [ {
					type : "e_trident",
					count : null
				} ],
				lootTable : [ {
					type : null,
					weight : 6
				}, {
					type : "WEAPON_DROP",
					weight : 2
				}, {
					type : "item_chest",
					weight : 1
				}, {
					type : "item_food",
					weight : 1
				} ],
				soundAttacks : "demoblin_attacks",
				soundDamage : "goblin_damage",
				soundDies : "goblin_dies",
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.cooldown = true;
					this.cooldownElapsed = c.randomRange(0, 5E3)
				},
				onUpdate : function() {
					if (this.position.y >= 50)
						this.onUpdate = a.getNear
				}
			};
			f.flaming_skull = {
				role : "monster",
				team : 1,
				speed : 200,
				hitPoints : 50,
				damage : 10,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 32,
				animated : true,
				setDir : false,
				soundDamage : "skull_damage",
				soundDies : "skull_dies",
				weapons : [ {
					type : "e_static_blue_fire",
					count : null
				} ],
				lootTable : [ {
					type : null,
					weight : 6
				}, {
					type : "WEAPON_DROP",
					weight : 2
				}, {
					type : "item_chest",
					weight : 2
				} ],
				onInit : function() {
					switch (c.randomRange(1, 2)) {
					case 1:
						this.speed *= 0.5;
						this.animDelay *= 0.5;
						break;
					case 2:
						this.speed *= 0.75;
						this.animDelay *= 0.75
					}
				},
				onUpdate : function() {
					if (!this.setDir && this.position.y >= 50) {
						var b = this.direction.clone();
						b.x = Math.random();
						if (Math.random() >= 0.5)
							b.x *= -1;
						this.setDirection(b);
						this.setDir = true
					}
					return "shoot"
				}
			};
			f.huge_skull = {
				role : "monster",
				team : 1,
				badass : true,
				speed : 150,
				hitPoints : 200,
				damage : 20,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 864,
				animated : true,
				size : new c.Size(64, 64),
				setDir : false,
				soundDamage : "skull_damage",
				soundDies : "skull_dies",
				weapons : [ {
					type : "e_static_green_fire",
					count : null
				} ],
				lootTable : [ {
					type : null,
					weight : 4
				}, {
					type : "WEAPON_DROP",
					weight : 3
				}, {
					type : "item_chest",
					weight : 3
				} ],
				onInit : function() {
					this.phaseTimer = new c.Timer;
					switch (c.randomRange(1, 2)) {
					case 1:
						this.speed *= 0.5;
						this.animDelay *= 0.5;
						break;
					case 2:
						this.speed *= 0.75;
						this.animDelay *= 0.75
					}
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit)
							this.phaseInit = true;
						this.position.y >= 50 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							var e = this.direction.clone();
							e.x = Math.random();
							if (Math.random() >= 0.5)
								e.x *= -1;
							this.setDirection(e);
							this.phaseTimer.start(c.randomRange(2E3, 4E3));
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 2:
						if (!this.phaseInit) {
							this.speed *= 2;
							this.animDelay *= 2;
							this.phaseTimer.start(c.randomRange(250, 500));
							this.phaseInit = true
						}
						if (this.phaseTimer.expired()) {
							this.speed /= 2;
							this.animDelay /= 2;
							this.setPhase(1)
						}
						this.chase(d.getPlayerObject())
					}
					return "shoot"
				}
			};
			f.spike_wall = {
				role : "trap",
				team : 1,
				speed : 150,
				hitPoints : Infinity,
				damage : 20,
				spriteSheet : "objects",
				spriteX : 32,
				spriteY : 256,
				drawIndex : 0,
				animated : true,
				animNumFrames : 1,
				spawnFramesX : 96,
				spawnFramesY : 576,
				spawnFrameCount : 2,
				rotate : true,
				rotateSpeed : 0,
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.spinUpTime = 7500;
					this.wallDirection = new c.Vector2(0, 1);
					this.addState(c.Object.states.SPAWNING)
				},
				onDamage : function() {
					this.spriteX = 128
				},
				onUpdate : function(b) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.phaseTimer.start(this.spinUpTime);
							this.phaseInit = true
						}
						this.rotateSpeed += this.spinUpTime / 200 / 1E3 * b;
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							c.sound.play("spike_attack");
							this.setDirection(this.wallDirection);
							this.phaseInit = true
						}
					}
				},
				onWallCollide : function() {
					this.stopMoving();
					this.ttl = 1500
				}
			};
			f.spike_sentry = {
				role : "trap",
				team : 1,
				speed : 100,
				hitPoints : Infinity,
				damage : 10,
				worth : 0,
				spriteSheet : "objects",
				spriteX : 64,
				spriteY : 256,
				animated : true,
				animNumFrames : 1,
				spawnFramesX : 0,
				spawnFramesY : 576,
				spawnFrameCount : 2,
				rotate : true,
				rotateSpeed : 100,
				phase : 0,
				phaseInit : false,
				onInit : function() {
					this.addState(c.Object.states.SPAWNING)
				},
				onDamage : function(b) {
					if (b.role === "hero")
						this.spriteX = 160
				},
				onUpdate : function(b, d) {
					if (!this.hasState(c.Object.states.SPAWNING))
						switch (this.phase) {
						case 0:
							if (!this.phaseInit) {
								this.stopMoving();
								this.phaseInit = true
							}
							var e = d.getPlayerObject().position.clone()
									.subtract(this.position);
							if (Math.abs(e.y) < 32) {
								this.originalPos = this.position.clone();
								var g = new c.Vector2;
								g.x = e.x < 0 ? -1 : 1;
								this.setDirection(g);
								this.phase++;
								this.phaseInit = false;
								c.sound.play("spike_attack")
							} else if (Math.abs(e.x) < 32) {
								this.originalPos = this.position.clone();
								g = new c.Vector2;
								g.y = e.y < 0 ? -1 : 1;
								this.setDirection(g);
								this.phase++;
								this.phaseInit = false;
								c.sound.play("spike_attack")
							}
							break;
						case 1:
							if (!this.phaseInit) {
								this.rotateSpeed = this.speed = 300;
								this.phaseInit = true
							}
							e = this.position.clone()
									.subtract(this.originalPos).abs();
							if (e.x > 256) {
								g = this.direction.clone();
								g.x *= -1;
								this.setDirection(g);
								this.phase++;
								this.phaseInit = false
							} else if (e.y > 128) {
								g = this.direction.clone();
								g.y *= -1;
								this.setDirection(g);
								this.phase++;
								this.phaseInit = false
							}
							break;
						case 2:
							if (!this.phaseInit) {
								this.speed = 50;
								this.rotateSpeed = 100;
								this.phaseInit = true
							}
							e = this.position.clone()
									.subtract(this.originalPos).abs();
							if (e.x < 5 && e.y < 5) {
								this.stopMoving();
								this.position = this.originalPos.clone();
								this.phase = 0;
								this.phaseInit = false
							}
						}
				}
			};
			f.spikes = {
				role : "trap",
				team : 1,
				speed : 0,
				hitPoints : Infinity,
				damage : 10,
				worth : 0,
				spriteSheet : "objects",
				spriteX : 0,
				spriteY : 256,
				animated : true,
				animNumFrames : 1,
				spawnFramesX : 224,
				spawnFramesY : 256,
				spawnFrameCount : 3,
				collidable : false,
				onInit : function() {
					this.addState(c.Object.states.SPAWNING)
				},
				onDamage : function(b) {
					if (b.role === "hero")
						this.spriteX = 96
				}
			};
			f.owlbear = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteY : 800,
				damage : 15,
				hitPoints : 250,
				speed : 75,
				soundAlarm : "owlbear_alarm",
				soundAttacks : "owlbear_attacks",
				soundDamage : "owlbear_damage",
				soundDies : "owlbear_dies",
				lootTable : [ {
					type : "item_food",
					weight : 1
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.phaseTimer = new c.Timer
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 150;
							this.phaseInit = true
						}
						this.position.y >= 60 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							this.speed = 75;
							this.animDelay = 300;
							this.phaseInit = true
						}
						a.wander.apply(this, arguments);
						var e = d.getPlayerObject(), g = e.position.clone()
								.subtract(this.position).abs();
						if (g.x < this.size.width / 2
								|| g.y < this.size.height / 2) {
							this.chase(e);
							this.nextPhase()
						}
						break;
					case 2:
						if (!this.phaseInit) {
							c.sound.play(this.soundAlarm);
							this.speed = 0;
							this.animDelay = 150;
							this.phaseTimer.start(500);
							this.phaseInit = true
						}
						this.position.x += c.randomRange(-1, 1);
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 3:
						if (!this.phaseInit) {
							c.sound.play(this.soundAttacks);
							this.speed = 350;
							this.animDelay = 75;
							this.phaseTimer.start(2E3);
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 4:
						if (!this.phaseInit) {
							this.stopMoving();
							this.animDelay = 400;
							this.phaseTimer.start(1250);
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.setPhase(1)
					}
				}
			};
			f.cyclops = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				gibletSize : "large",
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteY : 224,
				moveChangeElapsed : 0,
				moveChangeDelay : 1E3,
				damage : 20,
				hitPoints : 200,
				speed : 100,
				animDelay : 100,
				worth : 0,
				soundAttacks : "cyclops_attacks",
				soundDamage : "cyclops_damage",
				soundDies : "cyclops_dies",
				weapons : [ {
					type : "e_boulder",
					count : null
				} ],
				lootTable : [ {
					type : "item_food",
					weight : 7
				}, {
					type : "WEAPON_DROP",
					weight : 3
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.setDirection(c.directions.toVector(c.directions.DOWN))
				},
				onUpdate : function() {
					if (this.position.y >= 50) {
						this.speed = 25;
						this.animDelay = 200;
						this.onUpdate = a.chase
					}
				}
			};
			f.eyelet = {
				role : "monster",
				team : 1,
				animated : true,
				spriteSheet : "characters",
				spriteY : 512,
				damage : 10,
				hitPoints : 40,
				speed : 100,
				soundDamage : "eyelet_damage",
				soundDies : "eyelet_dies",
				collidable : false,
				lootTable : [ {
					type : null,
					weight : 9
				}, {
					type : "item_food",
					weight : 1
				}, {
					type : "WEAPON_DROP",
					weight : 8
				}, {
					type : "item_weapon_fireball",
					weight : 2
				} ],
				makeBadass : function() {
					this.spriteY = 960;
					this.hitPoints = 50;
					this.speed = 150;
					this.damage = 20
				},
				onInit : function() {
					if (c.randomRange(1, 10) > 5)
						this.spriteY += 32;
					this.ownerAngle = 0;
					this.phaseTimer = new c.Timer;
					this.addState(c.Object.states.INVINCIBLE, 1E3)
				},
				onUpdate : function(b, d) {
					if (d.objects[this.ownerId])
						switch (this.phase) {
						case 0:
							if (!this.phaseInit) {
								this.phaseTimer.start(1E4);
								this.phaseInit = true
							}
							var e = d.objects[this.ownerId], g = e.position
									.clone().add(
											c.Vector2.fromSize(e.size).scale(
													0.5)).subtract(
											new c.Vector2(10, 10)), i = c.Vector2
									.fromHeading(this.ownerAngle);
							this.position = g.add(i.scale(e.eyeletOffset));
							this.ownerAngle += 1.05 / 1E3 * b;
							if (this.ownerAngle > Math.PI * 2)
								this.ownerAngle = 0;
							this.phaseTimer.expired()
									&& d.checkTileCollision(this) === false
									&& this.nextPhase();
							break;
						case 1:
							if (!this.phaseInit) {
								this.collidable = true;
								this.speed = 175;
								this.phaseInit = true
							}
							a.wander.apply(this, arguments)
						}
					else
						this.wound(this.hitPoints)
				}
			};
			f.cube = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				animDelay : 400,
				gibletSize : "large",
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteY : 576,
				moveChangeElapsed : 0,
				moveChangeDelay : 1E3,
				damage : 35,
				hitPoints : 750,
				speed : 15,
				worth : 0,
				soundAttacks : "cube_attacks",
				soundDamage : "cube_damage",
				soundDies : "cube_dies",
				lootTable : [ {
					type : "item_gold_chest",
					weight : 1
				} ],
				onInit : function() {
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.setDirection(c.directions.toVector(c.directions.DOWN));
					this.phaseTimer = new c.Timer;
					this.gelTimer = new c.Timer
				},
				onThreat : function(b) {
					if (b.damageType !== "magic")
						return true
				},
				onUpdate : function(b, d) {
					this.gelTimer.update(b);
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 100;
							this.animDelay = 200;
							this.phaseInit = true
						}
						this.position.y >= 150 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							this.stopMoving();
							this.speed = 15;
							this.animDelay = 400;
							this.phaseTimer.start(6E3);
							this.gelTimer.start(300);
							this.phaseInit = true
						}
						if (this.phaseTimer.expired()) {
							this.nextPhase();
							break
						}
						a.wander.apply(this, arguments);
						this.position.x += c.randomRange(-1, 1);
						if (this.gelTimer.expired()) {
							d.spawnObject(this, "gel");
							c.sound.play(this.soundAttacks);
							this.gelTimer.reset()
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.speed = 30;
							this.animDelay = 150;
							this.phaseTimer.start(7500);
							this.phaseInit = true
						}
						if (this.phaseTimer.expired()) {
							this.setPhase(1);
							break
						}
						a.chase.apply(this, arguments)
					}
				}
			};
			f.gel = {
				role : "monster",
				team : 1,
				animated : true,
				animDelay : 400,
				spriteSheet : "characters",
				spriteY : 640,
				moveChangeElapsed : 0,
				moveChangeDelay : 1E3,
				damage : 5,
				hitPoints : 10,
				speed : 150,
				worth : 0,
				soundDamage : "gel_damage",
				soundDies : "gel_dies",
				onInit : function() {
					this.setDirection(c.randomDirection());
					this.moveChangeDelay = c.randomRange(500, 1E3);
					switch (c.randomRange(1, 4)) {
					case 1:
						this.spriteY = 640;
						break;
					case 2:
						this.spriteY = 672;
						break;
					case 3:
						this.spriteY = 704;
						break;
					case 4:
						this.spriteY = 736
					}
				},
				onUpdate : function() {
					a.wander.apply(this, arguments)
				},
				onKilled : function(b, d) {
					var e = d.getPlayerObject();
					!e.hasWeapon("h_fireball")
							&& !e.hasWeapon("h_fire_sword")
							&& d.getObjectCountByType("item_weapon_fireball") === 0
							&& d.dropObject(this, "item_weapon_fireball")
				}
			};
			f.superclops = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				gibletSize : "large",
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteY : 288,
				moveChangeElapsed : 0,
				moveChangeDelay : 1E3,
				damage : 20,
				hitPoints : 750,
				speed : 25,
				worth : 0,
				soundAttacks : "minotaur_attacks",
				soundDamage : "minotaur_damage",
				soundDies : "minotaur_dies",
				weapons : [ {
					type : "e_minotaur_trident",
					count : null
				} ],
				lootTable : [ {
					type : "item_gold_chest",
					weight : 1
				} ],
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.setDirection(c.directions.toVector(c.directions.DOWN))
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 200;
							this.animDelay = 100;
							this.phaseInit = true
						}
						this.position.y >= 80 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							this.animDelay = 250;
							this.chase(d.getPlayerObject());
							this.stopMoving();
							var e = this.facing.heading();
							d.spawnObject(this, "e_bouncing_boulder", c.Vector2
									.fromHeading(e - 0.3));
							d.spawnObject(this, "e_bouncing_boulder", c.Vector2
									.fromHeading(e + 0.3));
							this.phaseTimer.start(1500);
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 2:
						if (!this.phaseInit) {
							this.speed = 300;
							this.animDelay = 100;
							this.setDirection(this.facing);
							this.phaseTimer.start(2E3);
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 3:
						if (!this.phaseInit) {
							this.speed = 15;
							this.animDelay = 400;
							this.phaseTimer.start(2E3);
							this.phaseInit = true
						}
						a.wander.apply(this, arguments);
						if (this.phaseTimer.expired())
							this.wounds > this.hitPoints / 2 ? this.nextPhase()
									: this.setPhase(1);
						break;
					case 4:
						if (!this.phaseInit) {
							this.stopMoving();
							this.animDelay = 300;
							this.phaseTimer.start(1500);
							this.phaseInit = true
						}
						if (this.phaseTimer.expired()) {
							this.nextPhase();
							break
						}
						this.position.x += c.randomRange(-1, 1);
						break;
					case 5:
						if (!this.phaseInit) {
							this.cooldown = false;
							this.weapons = [ {
								type : "e_bouncing_boulder",
								count : null
							} ];
							this.phaseInit = true
						}
						d.objectAttack(this);
						this.position.x += c.randomRange(-1, 1);
						this.nextPhase();
						break;
					case 6:
						if (!this.phaseInit) {
							this.speed = 50;
							this.weapons = [ {
								type : "e_minotaur_trident",
								count : null
							} ];
							this.cooldown = true;
							this.phaseTimer.start(6E3);
							this.phaseInit = true
						}
						this.phaseTimer.expired() && this.setPhase(4);
						d.objectAttack(this);
						a.chase.apply(this, arguments)
					}
				},
				onWallCollide : function() {
					this.phase === 2 && this.nextPhase()
				}
			};
			f.imp = {
				role : "monster",
				team : 1,
				speed : 100,
				hitPoints : 20,
				damage : 15,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 64,
				animated : true,
				gibletSize : "medium",
				moveChangeElapsed : 0,
				moveChangeDelay : 3E3,
				soundDamage : "imp_damage",
				soundDies : "imp_dies",
				phase : 0,
				phaseInit : false,
				lootTable : [ {
					type : null,
					weight : 7
				}, {
					type : "item_food",
					weight : 1
				}, {
					type : "WEAPON_DROP",
					weight : 2
				} ],
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.moveChangeDelay = c.randomRange(500, 1E3)
				},
				onKilled : function(b, d) {
					b.role === "projectile" && b.die();
					for ( var e = 0; e < 2; ++e)
						d.spawnObject(this, "dire_bat", c.randomDirection(),
								false)
				},
				onUpdate : function() {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit)
							this.phaseInit = true;
						if (this.position.y >= 50) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 1:
						if (!this.phaseInit) {
							this.speed = 50;
							this.animDelay = 400;
							this.phaseTimer.start(2500, 7500);
							this.phaseInit = true
						}
						a.wander.apply(this, arguments);
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 150;
							this.phaseTimer.start(2500, 7500);
							this.phaseInit = true
						}
						a.wander.apply(this.arguments);
						if (this.phaseTimer.expired()) {
							this.phase = 1;
							this.phaseInit = false
						}
					}
				}
			};
			f.wizard = {
				role : "monster",
				team : 1,
				speed : 100,
				hitPoints : 20,
				damage : 10,
				worth : 0,
				spriteSheet : "characters",
				spriteY : 416,
				animated : true,
				gibletSize : "medium",
				moveChangeElapsed : 0,
				moveChangeDelay : 3E3,
				weapons : [ {
					type : "e_shock_wave",
					count : null
				} ],
				soundAttacks : "wizard_attacks",
				soundDisappear : "wizard_disappear",
				soundReappear : "wizard_reappear",
				soundDamage : "goblin_damage",
				soundDies : "goblin_dies",
				lootTable : [ {
					type : null,
					weight : 6
				}, {
					type : "item_chest",
					weight : 2
				}, {
					type : "WEAPON_DROP",
					weight : 2
				} ],
				phase : 0,
				phaseInit : false,
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.moveToY = c.randomRange(50, 75)
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit)
							this.phaseInit = true;
						if (this.position.y >= this.moveToY) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 1:
						if (!this.phaseInit) {
							this.animated = false;
							this.stopMoving();
							this.addState(c.Object.states.INVINCIBLE);
							this.phaseTimer.start(1E3);
							this.phaseInit = true;
							c.sound.play(this.soundDisappear)
						}
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.speed = 500;
							this.addState(c.Object.states.INVISIBLE);
							this.phaseTimer.start(c.randomRange(1E3, 2E3));
							this.phaseInit = true
						}
						var e = this.boundingBox().center();
						e = d.getPlayerObject().boundingBox().center().clone()
								.subtract(e).abs();
						a.wander.apply(this, arguments);
						if (this.phaseTimer.expired() && e.magnitude() > 90) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 3:
						if (!this.phaseInit) {
							this.stopMoving();
							this.removeState(c.Object.states.INVISIBLE);
							this.phaseTimer.start(1E3);
							this.phaseInit = true;
							c.sound.play(this.soundReappear)
						}
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 4:
						if (!this.phaseInit) {
							this.speed = 0;
							this.animated = true;
							this.removeState(c.Object.states.INVINCIBLE);
							this.phaseTimer.start(c.randomRange(2E3, 3E3));
							this.phaseInit = true;
							this.shotOnce = false
						}
						this.chase(d.getPlayerObject());
						if (this.phaseTimer.expired()) {
							this.phase = 1;
							this.phaseInit = false
						}
						if (!this.shotOnce) {
							this.shotOnce = true;
							return "shoot"
						}
					}
				}
			};
			f.sandworm = {
				role : "monster",
				team : 1,
				animated : true,
				animDelay : 200,
				spriteSheet : "characters",
				spriteY : 480,
				spawnFramesX : 544,
				spawnFramesY : 448,
				spawnFrameCount : 2,
				damage : 25,
				hitPoints : 50,
				speed : 50,
				worth : 0,
				phase : 0,
				phaseInit : false,
				moveChangeElapsed : 0,
				moveChangeDelay : 2E3,
				soundAttacks : "sandworm_attacks",
				soundDamage : "goblin_damage",
				soundDies : "sandworm_dies",
				lootTable : [ {
					type : null,
					weight : 4
				}, {
					type : "item_chest",
					weight : 2
				}, {
					type : "WEAPON_DROP",
					weight : 2
				}, {
					type : "item_food",
					weight : 2
				} ],
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.dirtTimer = new c.Timer;
					this.attackTimer = new c.Timer
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 50;
							this.addState(c.Object.states.INVISIBLE);
							this.phaseTimer.start(c.randomRange(5E3, 1E4));
							this.dirtTimer.start(150);
							this.phaseInit = true
						}
						this.dirtTimer.update(b);
						this.position.y <= 50 ? this.setDirection(c.directions
								.toVector(c.directions.DOWN)) : a.wander.apply(
								this, arguments);
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						if (this.dirtTimer.expired()) {
							d.spawnObject(this, "e_dirt_pile");
							this.dirtTimer.reset()
						}
						break;
					case 1:
						if (!this.phaseInit) {
							this.stopMoving();
							this.speed = 0;
							this.removeState(c.Object.states.INVISIBLE);
							this.addState(c.Object.states.SPAWNING);
							this.spawnFrameIndex = 0;
							this.phaseInit = true
						}
						if (!this.hasState(c.Object.states.SPAWNING)) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.phaseAttacks = 0;
							this.phaseInit = true;
							this.attackTimer.start(200)
						}
						this.attackTimer.update(b);
						if (this.phaseAttacks < 1 && this.attackTimer.expired()) {
							this.phaseAttacks++;
							this.setDirection(c.randomDirection());
							d.spawnObject(this, "e_worm_spit");
							c.sound.play(this.soundAttacks);
							this.attackTimer.reset();
							this.phaseAttacks === 1
									&& this.phaseTimer.start(2E3)
						}
						if (this.phaseAttacks >= 1 && this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 3:
						if (!this.phaseInit) {
							this.addState(c.Object.states.DESPAWNING);
							this.spawnFrameIndex = 2;
							this.phaseInit = true
						}
						if (!this.hasState(c.Object.states.DESPAWNING)) {
							this.addState(c.Object.states.INVISIBLE);
							this.phase = 0;
							this.phaseInit = false
						}
					}
				}
			};
			f.doppelganger = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				spriteSheet : "characters",
				spriteY : 0,
				spriteY : 768,
				spriteYOverlay : 928,
				damage : 20,
				hitPoints : 5E3,
				speed : 200,
				soundAttacks : "dopp_attacks",
				soundDamage : "dopp_damage",
				soundDies : "dopp_dies",
				onInit : function() {
					this.phaseTimer = new c.Timer
				},
				onKilled : function(b, d) {
					for ( var e in d.objects) {
						var g = d.objects[e];
						if (g.role === "monster" && g.id !== this.id)
							g.wound(g.hitPoints);
						else if (g.role === "trap")
							g.ttl = 1500
					}
				},
				onUpdate : function(b, d) {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 300;
							this.animDelay = 100;
							this.phaseInit = true
						}
						this.position.y > 100 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 200;
							this.waypoints = this.getPattern();
							this.currentWaypoint = this.waypoints.shift();
							this.phaseInit = true
						}
						this.moveToward(this.currentWaypoint);
						var e = this.currentWaypoint.clone().subtract(
								this.position).abs().magnitude();
						if (e < 10) {
							this.position = this.currentWaypoint.clone();
							this.nextPhase()
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.setDirection(new c.Vector2(0, 1));
							this.stopMoving();
							this.phaseTimer.start(500);
							this.phaseInit = true
						}
						this.position.x += c.randomRange(-1, 1);
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 3:
						if (!this.phaseInit) {
							this.currentWaypoint = this.waypoints.shift();
							this.speed = 400;
							this.animDelay = 100;
							this.phaseInit = true;
							this.spikeTimer = new c.Timer;
							this.spikeTimer.start(200)
						}
						this.spikeTimer.update(b);
						if (this.spikeTimer.expired()) {
							c.sound.play("spike_attack");
							var g = d.spawnObject(this, "spikes");
							if (g = d.objects[g])
								g.ttl = 1E4;
							this.spikeTimer.reset()
						}
						this.moveToward(this.currentWaypoint);
						e = this.currentWaypoint.clone()
								.subtract(this.position).abs().magnitude();
						if (e < 10) {
							this.position = this.currentWaypoint.clone();
							if (this.waypoints.length > 0)
								this.currentWaypoint = this.waypoints.shift();
							else
								this.nextPhase()
						}
						break;
					case 4:
						if (!this.phaseInit) {
							this.speed = 100;
							this.animDelay = 200;
							this.phaseTimer.start(7500);
							this.phaseInit = true
						}
						e = d.getPlayerObject();
						e.wounds < e.hitPoints && this.chase(e);
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 5:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 200;
							this.phaseInit = true;
							this.targetPos = new c.Vector2(32, 66)
						}
						this.moveToward(this.targetPos);
						e = this.targetPos.clone().subtract(this.position)
								.abs().magnitude();
						if (e < 10) {
							this.position = this.targetPos.clone();
							this.nextPhase()
						}
						break;
					case 6:
						if (!this.phaseInit) {
							this.setDirection(new c.Vector2(0, 1));
							this.stopMoving();
							this.phaseInit = true;
							this.makeSpikeWalls(d);
							this.weapons = [ {
								type : "e_dopp_sword",
								count : null
							} ]
						}
						this.phaseTimer.expired() && this.nextPhase();
						this.chase(d.getPlayerObject());
						this.stopMoving();
						if (this.wounds > this.hitPoints * 0.33)
							return "shoot";
						break;
					case 7:
						if (!this.phaseInit) {
							this.stopMoving();
							this.phaseTimer.start(4E3);
							this.phaseInit = true
						}
						if (this.phaseTimer.expired()) {
							e = c.makeObject("item_food");
							e.position.x = 32;
							e.position.y = 64;
							d.addObject(e);
							this.nextPhase()
						}
						break;
					case 8:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 200;
							this.weapons = [ {
								type : "e_dopp_axe",
								count : null
							} ];
							this.cooldown = false;
							this.waypoints = this.getPattern();
							this.currentWaypoint = this.waypoints.shift();
							this.axeTimer = new c.Timer;
							this.axeTimer.start(3E3);
							this.axeTimer.update(3E3);
							this.phaseInit = true
						}
						this.axeTimer.update(b);
						if (this.axeTimer.expired()) {
							this.chase(d.getPlayerObject());
							d.spawnObject(this, "e_dopp_axe");
							this.axeTimer.reset()
						}
						this.moveToward(this.currentWaypoint);
						e = this.currentWaypoint.clone()
								.subtract(this.position).abs().magnitude();
						if (e < 10) {
							this.position = this.currentWaypoint.clone();
							if (this.waypoints.length > 0)
								this.currentWaypoint = this.waypoints.shift();
							else
								this.nextPhase()
						}
						break;
					case 9:
						if (!this.phaseInit) {
							this.animDelay = this.speed = 200;
							this.phaseInit = true;
							this.targetPos = new c.Vector2(304, 224)
						}
						this.moveToward(this.targetPos);
						e = this.targetPos.clone().subtract(this.position)
								.abs().magnitude();
						if (e < 10) {
							this.position = this.targetPos.clone();
							this.nextPhase()
						}
						break;
					case 10:
						if (!this.phaseInit) {
							c.sound.play("minotaur_dies");
							this.setDirection(new c.Vector2(0, 1));
							this.stopMoving();
							this.phaseInit = true;
							for (e = 0; e < 60; ++e) {
								g = d.spawnObject(this, "dire_bat");
								g = d.objects[g];
								g.setDirection(c.randomDirection());
								g.addState(c.Object.states.INVINCIBLE, 250)
							}
							this.phaseTimer.start(8E3)
						}
						this.phaseTimer.expired() && this.setPhase(1)
					}
				},
				getPattern : function() {
					switch (c.randomRange(1, 3)) {
					case 1:
						return [ new c.Vector2(64, 320), new c.Vector2(64, 96),
								new c.Vector2(544, 96),
								new c.Vector2(544, 320),
								new c.Vector2(128, 320),
								new c.Vector2(128, 160),
								new c.Vector2(480, 160),
								new c.Vector2(480, 256),
								new c.Vector2(192, 256) ];
					case 2:
						return [ new c.Vector2(576, 352),
								new c.Vector2(32, 352), new c.Vector2(32, 288),
								new c.Vector2(576, 288),
								new c.Vector2(576, 224),
								new c.Vector2(32, 224), new c.Vector2(32, 160),
								new c.Vector2(576, 160),
								new c.Vector2(576, 96), new c.Vector2(32, 96) ];
					case 3:
						return [ new c.Vector2(576, 64), new c.Vector2(32, 64),
								new c.Vector2(288, 192),
								new c.Vector2(32, 352),
								new c.Vector2(576, 352),
								new c.Vector2(352, 224), new c.Vector2(576, 64) ]
					}
				},
				makeSpikeWalls : function(b) {
					c.sound.play("wizard_reappear");
					var d = 3, e = 5E3, g = 2;
					if (this.wounds > this.hitPoints * 0.66) {
						d = 1;
						e = 5E3;
						g = 2
					} else if (this.wounds > this.hitPoints * 0.33) {
						d = 2;
						e = 7500;
						g = 1.5
					}
					this.phaseTimer.start(e - 1500);
					for ( var i = [], h = 0; h < 18; ++h)
						i.push(true);
					for (h = 0; h < d; ++h) {
						for ( var j = 0, k = false; k === false;) {
							j = c.randomRange(3, i.length - 1);
							k = i[j] === true
						}
						i[j] = false
					}
					for (h = 0; h < i.length; ++h)
						if (i[h] === true) {
							j = c.makeObject("spike_wall");
							j.position = new c.Vector2(32 + h * 32, 64);
							j.spinUpTime = e;
							j.speed *= g;
							b.addObject(j)
						}
					i = [];
					for (h = 0; h < 10; ++h)
						i.push(true);
					for (h = 0; h < d; ++h) {
						j = 0;
						for (k = false; k === false;) {
							j = c.randomRange(3, i.length - 1);
							k = i[j] === true
						}
						i[j] = false
					}
					for (h = 0; h < i.length; ++h)
						if (i[h] === true) {
							j = c.makeObject("spike_wall");
							j.position = new c.Vector2(32, 64 + h * 32);
							j.wallDirection = new c.Vector2(1, 0);
							j.spinUpTime = e;
							j.speed = 275;
							j.speed *= g;
							b.addObject(j)
						}
				}
			};
			f.e_dopp_axe = {
				role : "projectile",
				cooldown : 2500,
				speed : 250,
				hitPoints : Infinity,
				damage : 15,
				spriteSheet : "objects",
				spriteX : 160,
				spriteY : 32,
				rotate : true,
				rotateSpeed : 700,
				priority : 5,
				ttl : 1E4,
				soundAttacks : "dopp_attacks",
				onInit : function() {
					this.spawnTimer = new c.Timer;
					this.spawnTimer.start(50)
				},
				onUpdate : function(b, d) {
					d.objectExists(this.ownerId) || this.die();
					this.spawnTimer.update(b);
					if (this.spawnTimer.expired()) {
						d.spawnObject(this, "e_dopp_fire");
						this.spawnTimer.reset()
					}
				}
			};
			f.e_dopp_sword = {
				role : "projectile",
				cooldown : 750,
				speed : 350,
				hitPoints : Infinity,
				damage : 5,
				spriteSheet : "objects",
				spriteX : 384,
				spriteY : 544,
				spriteAlign : true,
				priority : 2,
				bounce : false,
				piercing : true,
				soundAttacks : "dopp_attacks",
				onInit : function() {
					this.spawnTimer = new c.Timer;
					this.spawnTimer.start(50)
				},
				onUpdate : function(b, d) {
					this.spawnTimer.update(b);
					if (this.spawnTimer.expired()) {
						d.spawnObject(this, "e_dopp_fire");
						this.spawnTimer.reset()
					}
				}
			};
			f.beholder = {
				role : "monster",
				team : 1,
				badass : true,
				size : new c.Size(128, 128),
				spriteSheet : "beholder",
				animated : true,
				animDelay : 350,
				drawIndex : 3,
				damage : 30,
				hitPoints : 3E3,
				speed : 50,
				soundDamage : "beholder_damage",
				soundDies : "beholder_dies",
				collidable : false,
				lootTable : [ {
					type : "item_weapon_fire_sword",
					weight : 1
				} ],
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.attackTimer = new c.Timer;
					this.eyeletOffset = 100;
					this.eyeletOffsetMod = 1;
					this.enraged = false
				},
				onUpdate : function(b, d) {
					this.attackTimer.update(b);
					if (this.attackTimer.expired()) {
						c.sound.play("wizard_attacks");
						var e = d.spawnObject(this, "e_energy_ball"), g = d.objects[e];
						g.chase(d.getPlayerObject());
						this.attackTimer.reset()
					}
					this.eyeletOffset += 0.02 * b * this.eyeletOffsetMod;
					if (this.eyeletOffset > 120)
						this.eyeletOffsetMod = -1;
					if (this.eyeletOffset < 100)
						this.eyeletOffsetMod = 1;
					if (this.wounds > this.hitPoints / 2 && !this.enraged) {
						this.enraged = true;
						this.speed *= 1.5;
						this.animDelay /= 2;
						this.attackTimer.start(2E3)
					}
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 200;
							this.addState(c.Object.states.INVISIBLE);
							this.phaseInit = true
						}
						this.position.y >= 70 && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							c.sound.play("wizard_reappear");
							this.speed = 50;
							this.removeState(c.Object.states.INVISIBLE);
							this.addState(c.Object.states.INVINCIBLE);
							this.phaseTimer.start(2E3);
							this.phaseInit = true
						}
						a.wander.apply(this, arguments);
						if (this.phaseTimer.expired()) {
							this.attackTimer.start(4E3);
							this.nextPhase()
						}
						break;
					case 2:
						if (!this.phaseInit) {
							this.removeState(c.Object.states.INVINCIBLE);
							this.collidable = true;
							this.eyeletTimer = new c.Timer;
							this.eyeletTimer.start(500);
							this.eyeletsSpawned = 0;
							this.phaseInit = true
						}
						this.eyeletTimer.update(b);
						a.wander.apply(this, arguments);
						if (this.eyeletTimer.expired()) {
							c.sound.play("wizard_reappear");
							this.eyeletTimer.reset();
							e = d.spawnObject(this, "eyelet");
							if (this.wounds > this.hitPoints / 2) {
								g = d.objects[e];
								g.makeBadass()
							}
							++this.eyeletsSpawned;
							this.eyeletsSpawned >= 12 && this.nextPhase()
						}
						break;
					case 3:
						if (!this.phaseInit) {
							this.phaseTimer.start(2E4);
							this.phaseInit = true
						}
						g = false;
						for (e in d.objects)
							if (d.objects[e].ownerId === this.id) {
								g = true;
								break
							}
						if (this.phaseTimer.expired() || !g)
							this.nextPhase();
						a.wander.apply(this, arguments);
						break;
					case 4:
						if (!this.phaseInit) {
							this.stopMoving();
							this.phaseTimer.start(2E3);
							this.phaseInit = true
						}
						this.position.x += c.randomRange(-2, 2);
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 5:
						for (e = 0; e < 2; ++e)
							d.spawnObject(this, "gas_cloud");
						this.nextPhase();
						break;
					case 6:
						if (!this.phaseInit) {
							this.oldSpeed = this.speed;
							this.speed = 250;
							this.oldAnimDelay = this.animDelay;
							this.animDelay = 100;
							this.chase(d.getPlayerObject());
							this.phaseTimer.start(1E3);
							this.phaseInit = true
						}
					}
				},
				onWallCollide : function() {
					if (this.phase === 6 && this.phaseTimer.expired()) {
						this.speed = this.oldSpeed;
						this.animDelay = this.oldAnimDelay;
						this.setPhase(2)
					}
				}
			};
			f.gas_cloud = {
				role : "trap",
				team : 1,
				animated : true,
				size : new c.Size(128, 128),
				spriteSheet : "characters",
				spriteX : 640,
				spriteY : 416,
				drawIndex : 2,
				animDelay : 400,
				damage : 20,
				hitPoints : 9999,
				speed : 10,
				ttl : 9E4,
				damageType : "magic",
				onInit : function() {
					this.setDirection(c.randomDirection());
					this.moveChangeDelay = c.randomRange(5E3, 1E4)
				},
				onUpdate : function(b, d) {
					if (this.animFrameIndex === 2) {
						this.animated = false;
						this.spriteX = 896
					}
					if (this.team === 1 && !d.objects[this.ownerId]
							&& this.ttl - this.ttlElapsed > 2E3)
						this.ttlElapsed = this.ttl - 2E3;
					a.wander.apply(this, arguments)
				},
				onObjectCollide : function(b) {
					b.team !== this.team && b.role !== "projectile"
							&& b.addState(c.Object.states.SLOWED, 300);
					if (this.team !== 3 && b.damageType == "magic") {
						c.sound.play("fire_attack");
						this.ownerId = null;
						this.team = 3;
						this.damage = 5;
						this.ttl = 2E3;
						this.ttlElapsed = 0;
						this.spriteY += 224;
						this.animDelay = 500;
						this.animFrameIndex = 0;
						this.animNumFrames = 3
					}
				}
			};
			f.dragon = {
				role : "monster",
				team : 1,
				badass : true,
				animated : true,
				gibletSize : "large",
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteY : 352,
				moveChangeElapsed : 0,
				moveChangeDelay : 0,
				damage : 20,
				hitPoints : 1E3,
				speed : 20,
				worth : 0,
				soundAttacks : "dragon_attacks",
				soundDamage : "dragon_damage",
				soundDies : "dragon_dies",
				weapons : [ {
					type : "e_fireball",
					count : null
				} ],
				lootTable : [ {
					type : "item_gold_chest",
					weight : 1
				} ],
				phase : 0,
				phaseInit : false,
				onInit : function() {
					this.phaseTimer = new c.Timer;
					this.moveChangeDelay = c.randomRange(500, 1E3);
					this.setDirection(c.directions.toVector(c.directions.DOWN));
					this.altTimer = new c.Timer
				},
				onUpdate : function(b, d) {
					this.altTimer.update(b);
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.speed = 200;
							this.animDelay = 50;
							this.phaseInit = true
						}
						if (this.position.y >= 200) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 1:
						if (!this.phaseInit) {
							this.stopMoving();
							this.animDelay = 300;
							this.phaseTimer.start(1E3);
							this.phaseInit = true
						}
						this.position.x += c.randomRange(-1, 1);
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 2:
						if (!this.phaseInit) {
							this.cooldown = false;
							this.stopMoving();
							this.weapons = [ {
								type : "e_ring_fire",
								count : null
							} ];
							this.phaseInit = false
						}
						d.objectAttack(this);
						this.nextPhase();
						break;
					case 3:
						if (!this.phaseInit) {
							this.speed = 0;
							this.animDelay = 100;
							this.phaseTimer.start(2E3);
							this.phaseInit = true;
							this.altTimer.start(350);
							this.followUpShot = false
						}
						if (!this.followUpShot && this.altTimer.expired())
							if (this.wounds > this.hitPoints / 2) {
								this.cooldown = false;
								this.weapons = [ {
									type : "e_ring_fire_dopp",
									count : null
								} ];
								d.objectAttack(this);
								this.followUpShot = true
							}
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						this.position.x += c.randomRange(-1, 1);
						break;
					case 4:
						if (!this.phaseInit) {
							this.speed = 350;
							this.animDelay = 100;
							this.phaseTimer.start(500);
							this.phaseInit = true;
							var e = d.getPlayerObject();
							this.chase(e)
						}
						if (this.phaseTimer.expired()) {
							this.phase++;
							this.phaseInit = false
						}
						break;
					case 5:
						if (!this.phaseInit) {
							this.speed = 0;
							this.animDelay = 400;
							this.weapons = [ {
								type : "e_fireball_green",
								count : null
							} ];
							this.cooldown = false;
							this.cooldownElapsed = 0;
							this.phaseTimer.start(2500);
							this.phaseInit = true;
							this.altTimer.start(750)
						}
						if (this.phaseTimer.expired()) {
							this.phase = 2;
							this.phaseInit = false
						}
						e = d.getPlayerObject();
						this.chase(e);
						if (this.altTimer.expired()
								&& this.wounds > this.hitPoints / 2) {
							d.spawnObject(this, "e_fireball");
							this.altTimer.reset()
						}
						return "shoot"
					}
				}
			};
			f.e_arrow = {
				role : "projectile",
				cooldown : 4E3,
				speed : 200,
				hitPoints : 1,
				damage : 5,
				spriteSheet : "objects",
				spriteX : 256,
				spriteY : 0,
				spriteAlign : true,
				bounce : false
			};
			f.e_trident = {
				role : "projectile",
				cooldown : 5E3,
				speed : 200,
				hitPoints : 1,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 160,
				spriteY : 0,
				spriteAlign : true,
				bounce : false
			};
			f.e_boulder = {
				role : "projectile",
				cooldown : 2E3,
				speed : 150,
				hitPoints : Infinity,
				damage : 15,
				spriteSheet : "objects",
				spriteX : 224,
				spriteY : 0,
				rotate : true,
				bounce : false
			};
			f.e_bouncing_boulder = {
				role : "projectile",
				cooldown : 1500,
				speed : 150,
				hitPoints : Infinity,
				damage : 15,
				spriteSheet : "objects",
				spriteX : 224,
				spriteY : 0,
				rotate : true,
				bounce : true,
				ttl : 5E3
			};
			f.e_minotaur_trident = {
				role : "projectile",
				cooldown : 2E3,
				speed : 200,
				hitPoints : Infinity,
				damage : 20,
				spriteAlign : true,
				spriteSheet : "objects",
				spriteX : 160,
				spriteY : 0,
				bounce : false
			};
			f.e_energy_ball = {
				role : "projectile",
				cooldown : 2E3,
				speed : 200,
				hitPoints : Infinity,
				damage : 25,
				spriteSheet : "objects",
				spriteX : 320,
				spriteY : 0,
				rotate : true,
				bounce : false
			};
			f.e_ring_fire = {
				role : "projectile",
				cooldown : 2E3,
				speed : 200,
				hitPoints : Infinity,
				damage : 20,
				spriteSheet : "objects",
				spriteX : 352,
				spriteY : 0,
				rotate : true,
				bounce : false,
				damageType : "magic"
			};
			f.e_ring_fire_dopp = {
				role : "projectile",
				cooldown : 2E3,
				speed : 150,
				hitPoints : Infinity,
				damage : 25,
				spriteSheet : "objects",
				spriteX : 352,
				spriteY : 544,
				rotate : true,
				bounce : false,
				damageType : "magic"
			};
			f.e_fireball = {
				role : "projectile",
				cooldown : 2E3,
				speed : 350,
				hitPoints : Infinity,
				damage : 20,
				spriteSheet : "objects",
				spriteX : 352,
				spriteY : 544,
				rotate : true,
				bounce : false,
				damageType : "magic"
			};
			f.e_fireball_green = {
				role : "projectile",
				cooldown : 75,
				speed : 350,
				hitPoints : Infinity,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 352,
				spriteY : 0,
				rotate : true,
				ttl : 400,
				bounce : false,
				damageType : "magic"
			};
			f.e_static_blue_fire = {
				role : "projectile",
				cooldown : 100,
				speed : 0,
				hitPoints : Infinity,
				damage : 5,
				spriteSheet : "objects",
				spriteX : 288,
				spriteY : 32,
				rotate : true,
				rotateSpeed : 100,
				ttl : 1E3,
				bounce : false,
				drawIndex : 0,
				damageType : "magic"
			};
			f.e_dopp_fire = {
				role : "projectile",
				cooldown : 200,
				speed : 0,
				hitPoints : Infinity,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 288,
				spriteY : 32,
				rotate : true,
				rotateSpeed : 200,
				ttl : 250,
				bounce : false,
				drawIndex : 0,
				damageType : "magic"
			};
			f.e_static_green_fire = {
				role : "projectile",
				cooldown : 200,
				speed : 0,
				hitPoints : Infinity,
				damage : 10,
				size : new c.Size(64, 64),
				spriteSheet : "objects",
				spriteX : 64,
				spriteY : 192,
				rotate : true,
				rotateSpeed : 150,
				ttl : 2E3,
				bounce : false,
				drawIndex : 0,
				damageType : "magic"
			};
			f.e_dirt_pile = {
				role : "trap",
				cooldown : 100,
				speed : 0,
				hitPoints : Infinity,
				damage : 0,
				spriteSheet : "characters",
				spriteX : 0,
				spriteY : 448,
				ttl : 3E3,
				bounce : false,
				drawIndex : -2,
				onInit : function() {
					if (c.randomRange(1, 10) > 5)
						this.spriteX += 32
				},
				onObjectCollide : function(b) {
					b.team !== this.team && b.role !== "projectile"
							&& b.addState(c.Object.states.SLOWED, 300)
				}
			};
			f.e_spit_pool = {
				role : "trap",
				cooldown : 100,
				speed : 0,
				hitPoints : 9999,
				damage : 5,
				size : new c.Size(64, 64),
				spriteSheet : "characters",
				spriteX : 896,
				spriteY : 416,
				animated : true,
				ttl : 7500,
				bounce : false,
				drawIndex : -1,
				collidable : false,
				onObjectCollide : function(b) {
					b.team !== this.team && b.role !== "projectile"
							&& b.addState(c.Object.states.SLOWED, 300)
				}
			};
			f.e_shock_wave = {
				role : "projectile",
				cooldown : 1E3,
				speed : 200,
				hitPoints : Infinity,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 224,
				spriteY : 32,
				spriteAlign : true,
				bounce : false,
				animated : true,
				damageType : "magic"
			};
			f.e_worm_spit = {
				role : "projectile",
				cooldown : 1E3,
				speed : 200,
				hitPoints : 1,
				damage : 10,
				spriteSheet : "objects",
				spriteX : 128,
				spriteY : 64,
				spriteAlign : true,
				bounce : false,
				animated : true,
				damageType : "magic",
				onInit : function() {
					this.dieTimer = new c.Timer;
					this.dieTimer.start(1E3)
				},
				onUpdate : function(b) {
					this.dieTimer.update(b);
					this.dieTimer.expired() && this.die()
				},
				onDelete : function(b) {
					b.spawnObject(this, "e_spit_pool")
				}
			};
			f.mini_heart = {
				role : "fluff",
				spriteSheet : "objects",
				spriteX : 288,
				spriteY : 128,
				size : new c.Size(10, 10),
				ttl : 600,
				speed : 75,
				collidable : false,
				drawIndex : 5,
				onInit : function() {
					this.setDirection(new c.Vector2(0, -1));
					this.speed = c.randomRange(55, 85)
				}
			};
			f.mini_skull = {
				role : "fluff",
				spriteSheet : "objects",
				spriteX : 320,
				spriteY : 128,
				size : new c.Size(10, 10),
				ttl : 1300,
				collidable : false,
				drawIndex : 5,
				onInit : function() {
					this.setDirection(new c.Vector2(0, -1));
					this.speed = c.randomRange(25, 60)
				}
			};
			f.rose = {
				role : "fluff",
				spriteSheet : "objects",
				collidable : false,
				rotate : true,
				spriteX : 192,
				spriteY : 256,
				drawIndex : -1,
				onInit : function() {
					this.speed = c.randomRange(150, 200);
					this.rotateSpeed = c.randomRange(75, 100);
					this.phaseTimer = new c.Timer
				},
				onUpdate : function() {
					switch (this.phase) {
					case 0:
						if (!this.phaseInit) {
							this.phaseInit = true;
							this.direction.y = -(c.randomRange(0, 5) / 10);
							this.phaseTimer.start(c.randomRange(500, 1750))
						}
						this.direction.y += 0.01;
						this.phaseTimer.expired() && this.nextPhase();
						break;
					case 1:
						if (!this.phaseInit) {
							this.stopMoving();
							this.rotate = false;
							this.phaseInit = true
						}
					}
				}
			};
			f.cloud = {
				role : "fluff",
				spriteSheet : "objects",
				collidable : false,
				drawIndex : 10,
				onInit : function() {
					this.alpha = 0.25;
					this.speed = c.randomRange(5, 25);
					this.size = new c.Size(192, 128);
					switch (c.randomRange(1, 4)) {
					case 1:
						this.spriteX = 0;
						this.spriteY = 288;
						break;
					case 2:
						this.size = new c.Size(128, 96);
						this.spriteX = 192;
						this.spriteY = 288;
						break;
					case 3:
						this.spriteX = 0;
						this.spriteY = 416;
						break;
					case 4:
						this.size = new c.Size(160, 128);
						this.spriteX = 192;
						this.spriteY = 416
					}
				}
			};
			f.gate = {
				role : "fluff",
				speed : 25,
				spriteSheet : "objects",
				spriteX : 0,
				spriteY : 192,
				size : new c.Size(64, 64)
			};
			f.pickup_arrow = {
				role : "fluff",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 0,
				spriteY : 608,
				size : new c.Size(118, 52),
				drawIndex : 9,
				animated : true
			};
			f.item_food = {
				role : "powerup_food",
				healAmount : 10,
				speed : 0,
				spriteSheet : "objects",
				spriteX : 96,
				spriteY : 32,
				ttl : 8E3
			};
			f.item_coin = {
				role : "powerup_coin",
				coinAmount : 10,
				speed : 0,
				spriteSheet : "objects",
				spriteX : 64,
				spriteY : 32,
				ttl : 5E3
			};
			f.item_chest = {
				role : "powerup_coin",
				coinAmount : 100,
				speed : 0,
				spriteSheet : "objects",
				spriteX : 32,
				spriteY : 32,
				ttl : 5E3
			};
			f.item_gold_chest = {
				role : "powerup_coin",
				coinAmount : 500,
				speed : 0,
				spriteSheet : "objects",
				spriteX : 0,
				spriteY : 32
			};
			f.item_weapon_knife = {
				role : "powerup_weapon",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 32,
				spriteY : 0,
				ttl : 5E3,
				wepType : "h_knife",
				wepCount : 125
			};
			f.item_weapon_spear = {
				role : "powerup_weapon",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 96,
				spriteY : 0,
				ttl : 5E3,
				wepType : "h_spear",
				wepCount : 100
			};
			f.item_weapon_fireball = {
				role : "powerup_weapon",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 0,
				ttl : 5E3,
				wepType : "h_fireball",
				wepCount : 100
			};
			f.item_weapon_axe = {
				role : "powerup_weapon",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 192,
				spriteY : 32,
				ttl : 5E3,
				wepType : "h_axe",
				wepCount : 75
			};
			f.item_weapon_fire_sword = {
				role : "powerup_weapon",
				speed : 0,
				spriteSheet : "objects",
				spriteX : 384,
				spriteY : 0,
				wepType : "h_fire_sword",
				wepCount : 5E3
			}
		})();
		(function() {
			c.ImageLoader = function() {
				this.images = {};
				this.numImages = this.numLoaded = 0
			};
			var f = c.ImageLoader.prototype;
			f.load = function(a, b, d) {
				this.callback = function() {
					b.call(d)
				};
				for ( var e in a) {
					this.numImages++;
					this.images[e] = new Image;
					c.on("load", this.handleImageLoad, this.images[e], this);
					c.on("error", this.handleImageError, this.images[e], this);
					this.images[e].src = a[e]
				}
			};
			f.increment = function() {
				this.numLoaded++;
				this.numLoaded >= this.numImages && this.callback()
			};
			f.handleImageLoad = function() {
				this.increment()
			};
			f.handleImageError = function() {
				this.increment()
			};
			f.getImage = function(a) {
				if (this.images[a])
					return this.images[a];
				return false
			}
		})();
		(function() {
			c.SpawnPoint = function(a, b, d, e) {
				this.delay = 500;
				this.lastSpawnElapsed = 0;
				this.location = new c.Rect(a, b, d, e);
				this.queue = []
			};
			var f = c.SpawnPoint.prototype;
			f.update = function(a, b) {
				this.lastSpawnElapsed += a;
				if (this.lastSpawnElapsed >= this.delay || b === true) {
					this.lastSpawnElapsed = 0;
					if (this.queue.length < 1)
						return false;
					var d = this.queue.shift(), e = this.location;
					d = c.makeObject(d);
					d.position.x = c.randomRange(e.left, e.left + e.width
							- d.size.width);
					d.position.y = c.randomRange(e.top, e.top + e.height
							- d.size.height);
					e = d.direction.clone();
					e.y = 1;
					d.setDirection(e);
					return d
				}
				return false
			};
			f.queueSpawn = function(a, b) {
				b = Number(b) || 1;
				for ( var d = 0; d < b; d++)
					this.queue.push(a)
			}
		})();
		(function() {
			c.SpawnWave = function() {
				this.points = [];
				this.nextWaveTime = 2E4;
				this.bossWave = false
			};
			var f = c.SpawnWave.prototype;
			f.addSpawnPoint = function(a, b) {
				this.points.push({
					spawnPointId : a,
					delay : b,
					objects : []
				})
			};
			f.addObjects = function(a, b, d) {
				var e = null, g;
				for (g in this.points)
					if (this.points[g].spawnPointId === a)
						e = this.points[g];
				if (e === null)
					return false;
				e.objects.push({
					type : b,
					count : Math.floor(d)
				})
			}
		})();
		(new c.Engine).run()
	})();
