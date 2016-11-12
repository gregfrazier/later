(function(window, fn){
	fn(window);
}(window, function(window) {
	var helper = {
		r2d: function(angle){ return angle * 57.295779513082; },
		d2r: function(angle){ return angle * 0.017453292519; }
	};
	
	var world = {
		scale: 10,
		size: 30, // square
		textureSize: { w: 128, h: 128 }
	};
	
	var keyboard = {
		up: false,
		down: false,
		right: false,
		left: false,
		rays: false,
		fishEye: false,
		fovMod: false,
		floor: true,
		sky: false,
		Mouse: {
			x: 0,
			y: 0,
			button: false
		}
	};
	
	var Surface;
	var SurfaceData;
	var RenderSize = { w: 320, h: 320 };
	var GreenWallTexture = null;
	var CobbleStoneTexture = null;
	var floorCanvas = null;
	
	var player = { 
		x:1.5144515963701148, 
		y:28.340677052796718, 
		d: 0, // direction facing, -1 for left / 1 for right
		rot: 0, // angle in radians 
		fov: 0.575958653127, // radians, split in half of real FOV
		rotSpeed: 0.052359877557, // turning speed, in radians
		movSpeed: 0.05
	};	

	var map = [
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,1,
		1,0,0,1,1,1,0,1,0,1,1,1,0,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,
		1,0,0,1,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,
		1,0,0,1,0,1,0,1,1,1,1,1,0,0,1,0,0,0,1,1,0,1,1,1,0,0,1,0,0,1,
		1,0,0,1,0,1,0,0,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1,0,1,1,0,0,1,
		1,1,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1,0,0,0,1,1,1,1,0,0,1,0,0,1,
		1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
		1,0,0,1,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,1,0,0,1,1,1,1,1,0,1,
		1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,
		1,1,0,0,0,1,0,0,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,1,
		1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,
		1,0,0,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1,
		1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,
		1,0,1,1,1,1,1,1,0,0,0,1,1,1,0,1,1,1,1,0,1,0,1,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,1,1,1,1,1,0,0,1,
		1,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,1,
		1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,1,0,0,1,1,1,1,0,0,1,
		1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,
		1,0,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,
		1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,
		1,0,0,1,0,1,0,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,1,0,0,0,1,0,0,1,
		1,0,0,1,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,1,
		1,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,1,1,0,0,0,0,1,
		1,0,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,
		1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
	
	// Clean Slate
	// 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	// 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
	];
	
	// Calculate Horizontal Intersections, return first block that's hit.
	function calcIntersections(player, rayAngle, vertical)
	{
		rayAngle %= 6.283185307179586;
		if(rayAngle < 0) rayAngle += 6.283185307179586;
	
		var rayFacingNegative = vertical ? 
								!(rayAngle > 6.283185307179586 * 0.75 || rayAngle < 6.283185307179586 * 0.25) :
								(rayAngle < 0 || rayAngle > Math.PI);
		var slope = vertical ? Math.sin(rayAngle) / Math.cos(rayAngle) : Math.cos(rayAngle) / Math.sin(rayAngle);
		
		var Xa = rayFacingNegative ? -1 : 1;
		var Ya = Xa * slope;
		if(!vertical)
		{
			Ya = rayFacingNegative ? -1 : 1;
			Xa = Ya * slope;
		}	
		var isFound = false;
	
		// This is the first block to check if something is there.
		var initialA = vertical ? (rayFacingNegative ? Math.floor(player.x) : Math.ceil(player.x)) : (rayFacingNegative ? Math.ceil(player.y) : Math.floor(player.y)),
			initialB = vertical ? player.y + (initialA - player.x) * slope : player.x + (initialA - player.y) * slope;
		var startingCoordinates = {
			x: vertical ? initialA : initialB,
			y: vertical ? initialB : initialA
		};
	
		var checkMap = function(coordinate, mapArray){
			var x = Math.floor(coordinate.x + (vertical ? (rayFacingNegative ? -1 : 0): 0)),
				y = Math.floor(coordinate.y + (!vertical ? (rayFacingNegative ? -1 : 0): 0)), 
				bounds = (y * world.size) + x;
			if(x < world.size && y < world.size && x >= 0 && y >= 0){
				if(bounds >= 0 && bounds < mapArray.length){
					return mapArray[bounds];
				}else{
					return 1;
				}
			}
			return 2;
		};
		
		// This doesn't do ceil operator, because we need the precision for texel calcs.
		var takeStep = function(dX, dY, coordinate){
			coordinate.x += dX;
			coordinate.y += dY;
			return coordinate;
		};	
	
		var tempCoordinates = { x: 0, y: 0 };
		// check for block in coordinates, if so, return that block coordinate
		// if not, take a step and check until it hits or is out of bounds.
		if(vertical ? checkMap(startingCoordinates, map) != 1 : true)
			while(!isFound){
				tempCoordinates = takeStep(Xa, Ya, startingCoordinates);
				switch(checkMap(tempCoordinates, map))
				{
					case 1: startingCoordinates = tempCoordinates; isFound = true; break;
					case 2: startingCoordinates = { x: -10000, y: -10000 }; isFound = true; break;
					default: break;
				}
			}
	
		var distanceFromPlayerX = startingCoordinates.x - player.x,
			distanceFromPlayerY = startingCoordinates.y - player.y;
		return { x: Math.floor(startingCoordinates.x), 
				y: Math.floor(startingCoordinates.y), 
				dist: distanceFromPlayerX * distanceFromPlayerX + distanceFromPlayerY * distanceFromPlayerY,
				actCoords: startingCoordinates };
	}
	
	function verticalSliceLength(distance, viewDist)
	{
		return Math.ceil(viewDist / distance);
	}
	
	function updatePlayer(){
		
		var checkMap = function(coordinate, mapArray){
			var x = Math.floor(coordinate.x),
				y = Math.floor(coordinate.y),
				bounds = (y * world.size) + x;
			if(x < world.size && y < world.size && x >= 0 && y >= 0){
				if(bounds >= 0 && bounds < mapArray.length){
					return mapArray[bounds];
				}else{
					return 0;
				}
			}
			return 0;
		};
	
		// Check mouse position when left-button is pressed
		if(keyboard.Mouse.button){
			keyboard.Mouse.button = false;
			if(keyboard.Mouse.x > 0 && keyboard.Mouse.x < (world.size-1) && keyboard.Mouse.y > 0 && keyboard.Mouse.y < (world.size-1)){
				var toggle = checkMap(keyboard.Mouse, map);
				map[(keyboard.Mouse.y * world.size) + keyboard.Mouse.x] = (toggle == 0 ? 1 : 0);
			}
		}
	
		player.d = 0;
		if(keyboard.left)
			player.d = -1;
		if(keyboard.right)
			player.d = 1;
		if(player.d != 0)
			player.rot += player.d * player.rotSpeed;
	
		while (player.rot < 0) player.rot += 6.283185307179586;
		while (player.rot >= 6.283185307179586) player.rot -= 6.283185307179586;
	
		var movement = 0;
		if(keyboard.up)
			movement = 1;
		if(keyboard.down)
			movement = -1;
		if(movement != 0){
			var nX = player.x + Math.cos(player.rot) * (movement * player.movSpeed);
			var nY = player.y + Math.sin(player.rot) * (movement * player.movSpeed);
			if(checkMap({x: nX, y: nY}, map) != 1){
				player.x = player.x + Math.cos(player.rot) * (movement * player.movSpeed);
				player.y = player.y + Math.sin(player.rot) * (movement * player.movSpeed);
			}
		}
	
		// Modify the field of vision
		if(keyboard.fovMod){
			keyboard.fovMod = false;
			player.fov = helper.d2r(1 + ((helper.r2d(player.fov) + 1) % 179));
		}
	
	}
	
	// player, map
	function render()
	{
		Surface.clearRect(0,0,320,520);
	
		// Draw 2D map
		map.forEach(function(o, i){
			if(o == 1){
				Surface.fillStyle = 'rgb(128,128,128)';
				Surface.fillRect(i % world.size * world.scale, Math.floor(i / world.size) * world.scale, world.scale, world.scale);
			}
		});
	
		// Draw player block
		Surface.fillStyle = 'rgb(0,128,0)';
		Surface.fillRect(player.x * world.scale, player.y * world.scale, 4, 4);
		
		// Draw player direction arrow
		var arrowX = player.x + Math.cos(player.rot) * 0.5; // 0.5 is just an arbitrary length
		var arrowY = player.y + Math.sin(player.rot) * 0.5;
		Surface.strokeStyle = 'rgb(0,0,255)';
		Surface.beginPath();
			Surface.moveTo(player.x * world.scale, player.y * world.scale);
			Surface.lineTo(arrowX * world.scale, arrowY * world.scale);
		Surface.closePath();	
		Surface.stroke();
	
		// Fill in 3D viewing area with split colors (sky and ground)
		Surface.fillStyle = 'rgb(137,186,216)';
		Surface.fillRect(0, 320, 320, 100);
		Surface.fillStyle = 'rgb(36,38,34)';
		Surface.fillRect(0, 420, 320, 100);
		
		// View Distance
		var viewDist = (320/2) / Math.tan(player.fov);
		
		// Draw each ray column
		for(var rayNumber = 0; rayNumber < 320; rayNumber++)
		{
			// half vertical resolution for slow computers/browser
			//if(rayNumber % 2 == 0) continue;
			
			var rayScreenPos = (-320/2 + rayNumber);
			var rayViewDist = Math.sqrt(rayScreenPos*rayScreenPos + viewDist*viewDist);
			var rayAngle = Math.asin(rayScreenPos / rayViewDist);
	
			// Get the first hit wall
			var hitBlockH = calcIntersections(player, rayAngle + player.rot, false),
				hitBlockV = calcIntersections(player, rayAngle + player.rot, true);
			
			var drawRay = function(block, texture, wallType){
				// Draw ray on 2D Map, if enabled
				if(keyboard.rays){
					Surface.strokeStyle = 'rgb(100,77,82)';
					Surface.lineWidth = 1;
					Surface.beginPath();
						Surface.moveTo(player.x * world.scale, player.y * world.scale);
						Surface.lineTo(Math.floor(block.actCoords.x * world.scale), Math.floor(block.actCoords.y * world.scale));
					Surface.closePath();	
					Surface.stroke();
				}
	
				// Draw rays on pseudo-3D map
				var f = keyboard.fishEye ? block.dist : Math.sqrt(block.dist) * Math.cos(rayAngle) * 2,
				    lineSize = verticalSliceLength(f, viewDist),
					overDraw = Math.floor(lineSize / 2) - 100,
					overDrawWall = Math.ceil((overDraw / Math.floor(lineSize / 2)) * (world.textureSize.w / 2)) % ((world.textureSize.w / 2) - 1);
				
				// Cuts off line to avoid overdraw
				if(overDraw > 0)
					lineSize -= overDraw * 2;
				else
					overDraw = 0, overDrawWall = 0;
				
				var underDraw = 100 - Math.floor(lineSize/2),
				    textureX = Math.ceil((block.actCoords[wallType] - Math.floor(block.actCoords[wallType])) * world.textureSize.w) % (world.textureSize.w - 1);			
	
				// Draw Floor, this is SLOW in everything except Firefox
				var drawEnd = (Math.floor(lineSize / 2) + 100);
				if(keyboard.sky || keyboard.floor) // don't bother calculating if we aren't even using it.
					for(var y = drawEnd; y < 200; y+=2){
						// Due to how slow this is, we skip every 2nd and 4th line, we make up for it by overdrawing below
						if(rayNumber % 2 == 0 || rayNumber % 4 == 0) continue;
						var currentDist = 200 / (2 * y - 200),
						    weight = currentDist / f,
							floorMapX, floorMapY;
	
						// This gets the exact coordinate within the wall to determine the texel location for the floor
						if(wallType == 'y'){
							floorMapX = block.x;
							floorMapY = block.actCoords.y;
						}else{
							floorMapX = block.actCoords.x;
							floorMapY = block.y;
						}
	
						var cFloorX = weight * floorMapX + (1 - weight) * player.x,
						    cFloorY = weight * floorMapY + (1 - weight) * player.y,
							floorTexX = ((cFloorX * world.textureSize.w) % (world.textureSize.w-1)) | 0,
							floorTexY = ((cFloorY * world.textureSize.w) % (world.textureSize.w-1)) | 0;
	
						// Believe it not, this is faster than direct pixel access
						if(keyboard.floor)
							Surface.drawImage(CobbleStoneTexture, floorTexX, floorTexY, 1, 1, 
											  rayNumber, 320 + y, 4, 4);	
						if(keyboard.sky)
							Surface.drawImage(SkyTexture, floorTexX, floorTexY, 1, 1, 
											  rayNumber, 320 + (200-y), 4, 4);
					}
				// Draw the wall, this will go on top of the sky/floor to cover the lower precision of the floor
				Surface.drawImage(texture, textureX, 0 + overDrawWall, 2, world.textureSize.w - (overDrawWall * 2), rayNumber, 320 + underDraw, 2, lineSize);		 	
			};
	
			var which = (hitBlockH.dist < hitBlockV.dist);
			drawRay(which ? hitBlockH : hitBlockV, 
					GreenWallTexture,
					which ? 'x' : 'y');
		}
		window.requestAnimationFrame(function () { updatePlayer(); render(); });
	}
	
	var captureKeys = function(e, t) {
		"undefined" == typeof e && (e = window.event);
		switch([69,70,32,38,37,40,39,49,50].indexOf(e.which || e.keyCode))
		{
			case 0: keyboard.fovMod = true; break;
			case 1: keyboard.fishEye = !keyboard.fishEye; break;
			case 2: keyboard.rays = !keyboard.rays; break;
			case 3: keyboard.up = true; break;
			case 4: keyboard.left = true; break;                
			case 5: keyboard.down = true; break;
			case 6: keyboard.right = true; break;
			case 7: keyboard.floor = !keyboard.floor; break;
			case 8: keyboard.sky = !keyboard.sky; break;
			default: return;
		}
		e.returnValue = !1, e.preventDefault && e.preventDefault();
	};
	
	var uncaptureKeys = function(e, t) {
		"undefined" == typeof e && (e = window.event);
	
		switch([69,38,37,40,39].indexOf(e.which || e.keyCode))
		{
			case 0: keyboard.fovMod = false; break;
			case 1: keyboard.up = false; break;
			case 2: keyboard.left = false; break;                
			case 3: keyboard.down = false; break;
			case 4: keyboard.right = false; break;
			default: return;
		}
		e.returnValue = !1, e.preventDefault && e.preventDefault();
	};
	
	function initScreen() {
		var canvas = document.getElementById('cSurface');
		if (canvas.getContext) {
			Surface = canvas.getContext('2d');
			Surface.fillStyle = 'rgb(0,0,0)';			
			// Load the textures
			GreenWallTexture = new Image();
			GreenWallTexture.src = 'data:image/jpeg;base64,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'; //'hedge.jpg';
			//BrickWallTexture = new Image();
			//BrickWallTexture.src = 'hedge.jpg';	
			CobbleStoneTexture = new Image();
			CobbleStoneTexture.src = 'data:image/jpeg;base64,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';	
			SkyTexture = new Image();
			SkyTexture.src = 'data:image/jpeg;base64,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';
	
			canvas.addEventListener('mousemove', function (e) {
				e.returnValue = !1, e.preventDefault && e.preventDefault();
				keyboard.Mouse.x = Math.floor((e.clientX - e.target.offsetLeft) / world.scale);
				keyboard.Mouse.y = Math.floor((e.clientY - e.target.offsetTop) / world.scale);
			}, false);	
			canvas.addEventListener('mousedown', function (e) {
				e.returnValue = !1, e.preventDefault && e.preventDefault();
				keyboard.Mouse.button = true;
			}, false);	
			canvas.addEventListener('mouseup', function (e) {
				e.returnValue = !1, e.preventDefault && e.preventDefault();
				keyboard.Mouse.button = false;
			}, false);
			
			document.addEventListener("keydown", function(t) { captureKeys(t, player); }, true);	
			document.addEventListener("keyup", function(t) { uncaptureKeys(t, player); }, true);		
			// Kick it off.
			updatePlayer();
			render();	
		} else {
			return;
		}
	}
	initScreen();
}));