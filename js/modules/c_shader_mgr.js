class c_shader_mgr {
	/* private */
	m_vtx_src_map = new Map();
	m_frag_src_map = new Map();
	m_shader_dir = '../../shader/';

	load_shaders() {
		this.m_program_phong = new c_program_phong();
		this.load_shader("phong", this.m_program_phong);
		this.m_program_debug_normal_line = new c_program_debug_normal_line();
		this.load_shader("debug_normal_line", this.m_program_debug_normal_line);
		this.m_program_debug_check_vao = new c_program_debug_check_vao();
		this.load_shader("debug_check_vao", this.m_program_debug_check_vao);
		this.m_program_debug_check_ub = new c_program_debug_check_ub();
		this.load_shader("debug_check_ub", this.m_program_debug_check_ub);
	}

	load_shader(shader_name_, program_mapper_) {
		this.load_shader_from_file(shader_name_,
					   this.m_shader_dir + shader_name_ + '.vert',
					   gl.VERTEX_SHADER,
					   program_mapper_);
		this.load_shader_from_file(shader_name_,
					   this.m_shader_dir + shader_name_ + '.frag',
					   gl.FRAGMENT_SHADER,
					   program_mapper_);
	}

	// from book WebGL Programming Guide (OpenGL)
	load_shader_from_file(shader_name_,
			      file_name_,
			      shader_type_,
				  program_mapper_) {
		var http_req = new XMLHttpRequest();
		http_req.onreadystatechange = function() {
			if (http_req.readyState === 4
			    && http_req.status !== 404) {
				shader_mgr.on_load_shader(shader_name_,
						    http_req.responseText,
						    shader_type_,
							program_mapper_);
			}
		}
		http_req.open('GET', file_name_, true);
		http_req.send();
	}

	// refer from book WebGL Programming Guide (OpenGL)
	on_load_shader(shader_name_,
		       	file_as_str_,
		       	shader_type_,
				program_mapper_) {
		var okay_to_compile = false;
		if (shader_type_ == gl.VERTEX_SHADER) {
			this.m_vtx_src_map.set(shader_name_, file_as_str_);
			if (this.m_frag_src_map.has(shader_name_))
				okay_to_compile = true;
		} else if (shader_type_ == gl.FRAGMENT_SHADER) {
			this.m_frag_src_map.set(shader_name_, file_as_str_);
			if (this.m_vtx_src_map.has(shader_name_))
				okay_to_compile = true;
		}
		
		if (okay_to_compile) {
			// https://www.toptal.com/javascript/3d-graphics-a-webgl-tutorial
			var vs_id = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vs_id, this.m_vtx_src_map.get(shader_name_));
			gl.compileShader(vs_id);
			if (!gl.getShaderParameter(vs_id, gl.COMPILE_STATUS)) {
				console.error(gl.getShaderInfoLog(vs_id));
				throw new Error("Failed to compile vs");
			}

			var fs_id = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fs_id, this.m_frag_src_map.get(shader_name_));
			gl.compileShader(fs_id);
			if (!gl.getShaderParameter(fs_id, gl.COMPILE_STATUS)) {
				console.error(gl.getShaderInfoLog(fs_id));
				throw new Error("Failed to compile fs");
			}
			var program = gl.createProgram();
			gl.attachShader(program, vs_id);
			gl.attachShader(program, fs_id);
			gl.linkProgram(program);
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.error(gl.getProgramInfoLog(program));
				throw new Error("Failed to compile program");
			}
			gl.useProgram(program);
			program_mapper_.set_program(program);
			this.m_init_done = true;
		}
	}
	
	/* public */
	m_init_done = false;
	m_program_phong;
	m_program_debug_normal_line;
	m_program_debug_check_vao;
	m_program_debug_check_ub;
	init() {
		this.load_shaders();
	}
}
