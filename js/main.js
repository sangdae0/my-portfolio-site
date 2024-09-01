var gl;
var shader_mgr;
var light_mgr;
var input_mgr;
var current_scene;

function main() {
	// http://www.javascriptkit.com/javatutors/error2.shtml
	window.onerror = function() {
		alert('An error occurred!');
		return false;
	}

	input_mgr = new c_input_mgr();
	input_mgr.init(false);

	var gl_canvas = document.getElementById("gl_canvas");
	
	gl_canvas.onwheel = function(event_) {
		if (current_scene === null)
			return;
		let zoom_amount = event_.deltaY * 0.0001;
		current_scene.m_camera.zoom(zoom_amount);
	};

	gl = gl_canvas.getContext("webgl2");	
	if (!gl) {
		alert("webGL2 not supported");
		return;
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
	document.onkeydown = callback_keydown;
	document.onkeyup = callback_keyup;


	// https://stackoverflow.com/a/23791450
	console.log(gl.getParameter(gl.VERSION));
	console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.log(gl.getParameter(gl.VENDOR));
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	let init_promise = new Promise((resolve, reject) => {
		shader_mgr = new c_shader_mgr();
		shader_mgr.init();
		// https://stackoverflow.com/a/30506051
		(function waitForFinishInit() {
			if (shader_mgr.m_init_done)
				return resolve();
			setTimeout(waitForFinishInit, 30);
		})();
	}).then(() => {
		current_scene = new c_scene();
		current_scene.init(true);

		// WebGL Programming Guide(OpenGL)
		let last = Date.now();	
		var tick = function() {
			let now = Date.now();
			let elapsed_ms = now - last;
			last = now;
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_objects_with_WebGL
			let dt = elapsed_ms * 0.001;
			input_mgr.update(dt);
			current_scene.update(dt);
			requestAnimationFrame(tick);
		}
		tick();
	});
}

function btn_cam_zoom_in() {
	if (current_scene === null)
		return;
	current_scene.m_camera.zoom(1.0);
}

function btn_cam_zoom_out() {
	if (current_scene === null)
		return;
	current_scene.m_camera.zoom(-1.0);	
}

function btn_cam_rotate_left() {
	if (current_scene === null)
		return;
	current_scene.m_camera.rotate(-5.0);	
}

function btn_cam_rotate_right() {
	if (current_scene === null)
		return;
	current_scene.m_camera.rotate(5.0);	
}

function btn_copy_template_to_edit_area(text_area_id_) {
	let str_to_copy = document.getElementById(text_area_id_).value;
	document.getElementById("text_area_l_system_input").value = str_to_copy;
}

function btn_gen_from_l_system() {
	let l_str = document.getElementById("text_area_l_system_input").value;
	if (l_str.length > 0) {
		if (current_scene !== null) {
			current_scene.m_plant_tree = c_plant_tree.gen(l_str);
		}
	}
}

function btn_derive_next() {
	if (current_scene !== null
		&& current_scene.m_plant_tree !== null) {
		current_scene.m_plant_tree.derive_next();
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
function callback_keydown(event_) {
	if (event_.isComposing || event_.keyCode === 229) {
		return;
	}
	input_mgr.callback_keydown(event_.keyCode);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
function callback_keyup(event_) {
	if (event_.isComposing || event_.keyCode === 229) {
		return;
	}
	input_mgr.callback_keyup(event_.keyCode);
}