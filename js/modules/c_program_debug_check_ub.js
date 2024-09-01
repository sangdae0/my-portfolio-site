class c_program_debug_check_ub {
	m_program;

	m_phong_prop_ub_config;
	m_phong_prop_ubo;

	m_lights_ub_config;
	m_lights_ubo;

	/* public */
	m_buffer_phong_prop;
	m_buffer_lights;

	m_attloc_vert_pos_;
	m_attloc_vert_normal_;
	m_attloc_vert_uv_;

	m_loc_model_view_mat_;
	m_loc_normal_model_view_mat_;
	m_loc_proj_mat_;

	m_loc_material_has_diffuse_tex_;
	m_loc_material_diffuse_tex_;
	m_loc_material_has_specular_tex_;
	m_loc_material_specular_tex_;
	m_loc_material_ambient_;
	m_loc_material_diffuse_;
	m_loc_material_specular_;
	m_loc_material_emission_;
	m_loc_material_shininess_;

	set_program(program_) {
		this.m_program = program_;
	}

	init() {
		this.use();
		this.setup_phong_prop_ubo();
		this.setup_lights_ubo();

		this.m_attloc_vert_pos_ = gl.getAttribLocation(this.m_program, "vert_pos_");
		this.m_attloc_vert_normal_ = gl.getAttribLocation(this.m_program, "vert_normal_");
		this.m_attloc_vert_uv_ = gl.getAttribLocation(this.m_program, "vert_uv_");
		
		this.m_loc_model_view_mat_ = gl.getUniformLocation(this.m_program, "model_view_mat_");
		this.m_loc_normal_model_view_mat_ = gl.getUniformLocation(this.m_program, "normal_model_view_mat_");
		this.m_loc_proj_mat_ = gl.getUniformLocation(this.m_program, "proj_mat_");

		this.m_loc_material_has_diffuse_tex_ = gl.getUniformLocation(this.m_program, "material_has_diffuse_tex_");
		this.m_loc_material_diffuse_tex_ = gl.getUniformLocation(this.m_program, "material_diffuse_tex_");
		this.m_loc_material_has_specular_tex_ = gl.getUniformLocation(this.m_program, "material_has_specular_tex_");
		this.m_loc_material_specular_tex_ = gl.getUniformLocation(this.m_program, "material_specular_tex_");
		this.m_loc_material_ambient_ = gl.getUniformLocation(this.m_program, "material_ambient_");
		this.m_loc_material_diffuse_ = gl.getUniformLocation(this.m_program, "material_diffuse_");
		this.m_loc_material_specular_ = gl.getUniformLocation(this.m_program, "material_specular_");
		this.m_loc_material_emission_ = gl.getUniformLocation(this.m_program, "material_emission_");
		this.m_loc_material_shininess_ = gl.getUniformLocation(this.m_program, "material_shininess_");
	}

	use() {
		gl.useProgram(this.m_program);
	}

	get_program() {
		return this.m_program;
	}

	update_specific_light(idx_, light_) {
		this.m_buffer_lights.set_lt_type(idx_, light_.m_lt_type);
		if (light_.m_lt_type < 0)
			return;
		this.m_buffer_lights.set_lt_ambient(idx_, light_.m_ambient);
		this.m_buffer_lights.set_lt_diffuse(idx_, light_.m_diffuse);
		this.m_buffer_lights.set_lt_specular(idx_, light_.m_specular);
		if (light_.m_lt_type === 0) // dir light
			this.m_buffer_lights.set_lt_dir(idx_, light_.m_lt_dir);
		else if (light_.m_lt_type === 1) { // point light
			this.m_buffer_lights.set_lt_pos(idx_, light_.m_lt_pos);
			this.m_buffer_lights.set_constant_att(idx_, light_.m_constant_att);
			this.m_buffer_lights.set_linear_att(idx_, light_.m_linear_att);
			this.m_buffer_lights.set_quadratic_att(idx_, light_.m_quadratic_att);
		} else if (light_.m_lt_type === 2) { // spot light
			this.m_buffer_lights.set_lt_dir(idx_, light_.m_lt_dir);
			this.m_buffer_lights.set_lt_pos(idx_, light_.m_lt_pos);
			this.m_buffer_lights.set_constant_att(idx_, light_.m_constant_att);
			this.m_buffer_lights.set_linear_att(idx_, light_.m_linear_att);
			this.m_buffer_lights.set_quadratic_att(idx_, light_.m_quadratic_att);
			let spot_cos_inner = Math.cos(c_math.deg_to_rad(light_.m_spot_inner_angle));
			let spot_cos_outer = Math.cos(c_math.deg_to_rad(light_.m_spot_outer_angle));
			this.m_buffer_lights.set_spot_cos_inner_and_outer(idx_, spot_cos_inner, spot_cos_outer);
			this.m_buffer_lights.set_spot_cutoff(idx_, light_.m_spot_cutoff);
		}
	}

	update_phong_props(global_ambient_intensity_,
						fog_intensity_,
						current_lt_count_,
						z_near_,
						z_far_) {
		this.m_buffer_phong_prop.set_global_ambient_intensity(global_ambient_intensity_);
		this.m_buffer_phong_prop.set_fog_intensity(fog_intensity_);
		this.m_buffer_phong_prop.set_current_lt_count(current_lt_count_);
		this.m_buffer_phong_prop.set_z_near_and_far(z_near_, z_far_);

		this.use();
		this.update_phong_prop_ubo();
	}

	update_mesh_info(model_view_mat_,
						normal_view_mat_,
						proj_mat_,
						material_) {
		gl.uniformMatrix4fv(this.m_loc_model_view_mat_,
							false,
							model_view_mat_.m_arr);
		gl.uniformMatrix4fv(this.m_loc_normal_model_view_mat_,
							false,
							normal_view_mat_.m_arr);
		gl.uniformMatrix4fv(this.m_loc_proj_mat_,
							false,
							proj_mat_.m_arr);

							if (material_.m_has_diffuse_tex) {
								gl.uniform1i(this.m_loc_material_has_diffuse_tex_, 1);
								gl.uniform1i(this.m_loc_material_diffuse_tex_, 0);
							} else
								gl.uniform1i(this.m_loc_material_has_diffuse_tex_, 0);
					
							if (material_.m_has_specular_tex) {
								gl.uniform1i(this.m_loc_material_has_specular_tex_, 1);
								gl.uniform1i(this.m_loc_material_specular_tex_, 1);
							} else
								gl.uniform1i(this.m_loc_material_has_specular_tex_, 0);
					
		gl.uniform3f(this.m_loc_material_ambient_, material_.m_ambient.m_x, material_.m_ambient.m_y, material_.m_ambient.m_z);
		gl.uniform3f(this.m_loc_material_diffuse_, material_.m_diffuse.m_x, material_.m_diffuse.m_y, material_.m_diffuse.m_z);
		gl.uniform3f(this.m_loc_material_specular_, material_.m_specular.m_x, material_.m_specular.m_y, material_.m_specular.m_z);
		gl.uniform3f(this.m_loc_material_emission_, material_.m_emission.m_x, material_.m_emission.m_y, material_.m_emission.m_z);
		gl.uniform1f(this.m_loc_material_shininess_, material_.m_shininess);
	}

	destroy() {
		this.delete_phong_prop_ubo();
		this.delete_lights_ubo();
	}

	setup_phong_prop_ubo() {
		this.m_phong_prop_ub_config = new c_uniform_buffer_config();
		let phong_prop_ub_uniform_names = ["phong_prop.global_ambient_intensity",
											"phong_prop.fog_intensity",
											"phong_prop.current_lt_count",
											"phong_prop.z_near",
											"phong_prop.z_far"];
		this.m_phong_prop_ub_config.init(this.m_program,
									"phong_prop",
									phong_prop_ub_uniform_names);
		// https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/draw_instanced_ubo.html
		gl.uniformBlockBinding(this.m_program, this.m_phong_prop_ub_config.m_ub_idx, 0);
		this.m_phong_prop_ubo = gl.createBuffer();
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_phong_prop_ubo);
		this.m_buffer_phong_prop = new c_buffer_phong_prop();
		this.m_buffer_phong_prop.init(this.m_phong_prop_ub_config);
		gl.bufferData(gl.UNIFORM_BUFFER,
						this.m_buffer_phong_prop.m_buffer,
						gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	}

	update_phong_prop_ubo() {
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_phong_prop_ubo);
		gl.bufferSubData(gl.UNIFORM_BUFFER,
							0,
							this.m_buffer_phong_prop.m_buffer);
		gl.bindBufferBase(gl.UNIFORM_BUFFER,
							0, // binding point
							this.m_phong_prop_ubo);
	}

	delete_phong_prop_ubo() {
		gl.deleteBuffer(this.m_phong_prop_ubo);
	}

	setup_lights_ubo() {
		this.m_lights_ub_config = new c_uniform_buffer_config();
		let lights_ub_uniform_names = ["lights.lt_type_arr",
										"lights.pos_arr",
										"lights.dir_arr",
										"lights.spot_cos_inner_angle_arr",
										"lights.spot_cos_outer_angle_arr",
										"lights.spot_cutoff_arr",
										"lights.ambient_arr",
										"lights.diffuse_arr",
										"lights.specular_arr",
										"lights.constant_att_arr",
										"lights.linear_att_arr",
										"lights.quadratic_att_arr"];
		this.m_lights_ub_config.init(this.m_program,
										"lights",
										lights_ub_uniform_names);
		// https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/draw_instanced_ubo.html
		gl.uniformBlockBinding(this.m_program, this.m_lights_ub_config.m_ub_idx, 1);
		this.m_lights_ubo = gl.createBuffer();
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_lights_ubo);
		this.m_buffer_lights = new c_buffer_lights();
		this.m_buffer_lights.init(this.m_lights_ub_config);
		gl.bufferData(gl.UNIFORM_BUFFER,
						this.m_buffer_lights.m_buffer,
						gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	}

	update_lights_ubo() {
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_lights_ubo);
		gl.bufferSubData(gl.UNIFORM_BUFFER,
							0,
							this.m_buffer_lights.m_buffer);
		gl.bindBufferBase(gl.UNIFORM_BUFFER,
							1, // binding point
							this.m_lights_ubo);
	}

	delete_lights_ubo() {
		gl.deleteBuffer(this.m_lights_ubo);
	}
}
