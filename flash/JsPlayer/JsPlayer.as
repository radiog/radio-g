package {
	
	import flash.system.Security;
	import flash.external.ExternalInterface;
	import flash.display.Sprite;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.utils.Timer;
	import flash.errors.IOError;
	import flash.events.*;
	import flash.text.TextField;
	

	public class JsPlayer extends Sprite {
		
		private var _host:*;
		private var _id:String;
		private var _sound:Sound;
		private var _channel:SoundChannel;
		private var _transform:SoundTransform;
		private var _request:URLRequest;
		private var _timer:Timer;
		private var _position: uint;
		private var _is_playing: Boolean;
		private var _is_loading:Boolean;
		private var _duration:Number;


		public function JsPlayer(host) {
			_host = host;
		}
		
		
		public function init():void {
			trace2("init");
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage, false, 0, true);
			_host.addChild(this);
		}
		
		
		private function onAddedToStage(e:Event):void {
			trace2("onAddedToStage");
			removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			go();
		}
	    
	
		private function go():void {
			trace2("go");
			_id = root.loaderInfo.parameters.id;
			
			reset();
			
			_transform = new SoundTransform();
			
			_timer = new Timer(250, 0);
			_timer.addEventListener(TimerEvent.TIMER, onTimer);
			
			ExternalInterface.addCallback("swfSetSrc", setSrc);
			ExternalInterface.addCallback("swfGetCurrentTime", getCurrentTime);
			ExternalInterface.addCallback("swfSetCurrentTime", seek);
			ExternalInterface.addCallback("swfLoad", load);
			ExternalInterface.addCallback("swfPlay", play);
			ExternalInterface.addCallback("swfPause", pause);
			ExternalInterface.addCallback("swfGetVolume", getVolume);
			ExternalInterface.addCallback("swfSetVolume", setVolume);
			ExternalInterface.addCallback("swfGetDuration", getDuration);

			ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.initAudio() }');
		}
		
		
		private function reset():void {
			trace2("reset");
			if (_channel) {
				_channel.removeEventListener(Event.SOUND_COMPLETE, onSoundComplete);
				_channel.stop();
				_channel = null;
			}
			
			if (_sound) {
				_sound.removeEventListener(IOErrorEvent.IO_ERROR, onIoError);
				_sound.removeEventListener(Event.OPEN, onOpen);
				_sound.removeEventListener(ProgressEvent.PROGRESS, onProgress);
				_sound.removeEventListener(Event.COMPLETE, onComplete);
				
				try {
					_sound.close();
				}
				catch (e:Error) {
					trace2(e.message);
				}
				
				_sound = null;
			}
			
			_sound = new Sound();

			_sound.addEventListener(IOErrorEvent.IO_ERROR, onIoError);
			_sound.addEventListener(Event.OPEN, onOpen);
			_sound.addEventListener(ProgressEvent.PROGRESS, onProgress);
			_sound.addEventListener(Event.COMPLETE, onComplete);
			
			_position = 0;
			_is_playing = false;
		}
		
		
		public function setSrc(url):void {
			trace2("setSrc(" + url + ")");
			_request = new URLRequest(url);
		}
		
		
		public function load():void {
			trace2("load");
			
			reset();
			
			if (_request && _request.url != "") {
				_sound.load(_request);
			}
		}
		
		
		public function play():void {
			trace2("play");
			if (!_is_playing) {
				trace2("play " + _sound.url);
				_channel = _sound.play(_position);
				_channel.soundTransform = _transform;
				_channel.addEventListener(Event.SOUND_COMPLETE, onSoundComplete);
				startTimer();
				_is_playing = true;
			}
		}
		
		
		public function pause():void {
			trace2("pause");
			
			if (_channel) {
				_position = _channel.position;
				_channel.stop();
			}
			
			stopTimer();
			_is_playing = false;
		}
		
		
		public function seek(t:Number):void {
			trace2("seek(" + t + ")");
			pause();
			_position = t * 1000;
			play();
		}
		
		
		public function getCurrentTime():Number {
			return _position / 1000;
		}
		
		
		public function getId():String {
			return _id;
		}
		
		
		public function getVolume():Number {
			return _transform.volume;
		}
		
		public function setVolume(v:Number):void {
			_transform.volume = v;
			
			if (_channel) {
				_channel.soundTransform = _transform;
			}
			
			ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioVolumeChange() }');
		}
		
		
		public function getDuration():Number {
			// approx. duration based on percentage loaded or else it gives wrong duration when still loading
			var r:Number =  _sound.bytesTotal / _sound.bytesLoaded;
			var d = r * _sound.length;
			d = Math.floor(d / 1000);
			
			return d;
		}
		
		
		
		private function startTimer():void {
			if (!_timer.running) {
				_timer.start();
			}
		}
		
		private function stopTimer():void {
			if (_timer.running) {
				_timer.stop();
			}
		}
		
		
		private function onTimer(e:TimerEvent):void {
			if (_channel) {
				if (_position != _channel.position) {
					_position = _channel.position;
					ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioTimeUpdate() }');
				}
				
				if (_is_loading) {
					if (_duration != getDuration()) {
						_duration = getDuration()
						ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioDurationChange() }');
					}
				}
			}
			else {
				_position = 0;
			}
		}
		
		
		private function onIoError(e:IOErrorEvent):void {
			// Dispatched when an input/output error occurs that causes a load operation to fail. 
			trace2("onIoError : " + e.text);
		}
		
		
		private function onOpen(e:Event):void {
			// Dispatched when a load operation starts. 
			trace2("onOpen");
			
			// fire canplay now
			// can't wait for COMPLETE (could be hundreds of MO)
			// http://mediaelementjs.com/ fires canplay directly in load()
			_position = 0;
			trace2("canplay");
			ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioCanPlay() }');
		}
		
		
		private function onProgress(e:Event):void {
			// Dispatched when data is received as a load operation progresses.
			_is_loading = true;
		}
		
		
		private function onComplete(e:Event):void {
			// Dispatched when data has loaded successfully. 
			trace2("onComplete");
			_is_loading = false;
			ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioDurationChange() }');
		}
		
		
		private function onSoundComplete(e:Event):void {
			// Dispatched when a sound has finished playing.
			trace2("onSoundComplete");
			pause();
			
			ExternalInterface.call('function() { JsPlayer.getPlayer("' + _id + '").audio.onAudioEnded() }');
		}
		
		
		private function trace2(msg:String):void {
			msg = "FLASH : player " + _id + " : " + msg;
			trace(msg);
			ExternalInterface.call('function() { console.log("' + msg + '") }');
		}
		
		
	}
}
