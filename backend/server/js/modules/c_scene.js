class c_scene {
	/* private */
	m_phong_prop_global_ambient_intensity;
	m_phong_prop_fog_intensity;
	m_phong_prop_current_light_count;
	m_phong_prop_z_near;
	m_phong_prop_z_far;

	m_objects = [];
	m_lights = [];

	/* public */
	m_camera;

	m_plant_tree;
	m_player;

	m_max_num_of_lights = 16;

	/**
	 * @param {boolean} is_orbit_mode_ 
	 */	
	init(is_orbit_mode_) {
		shader_mgr.m_program_phong.init();
		shader_mgr.m_program_debug_normal_line.init();
		shader_mgr.m_program_debug_check_vao.init();
		shader_mgr.m_program_debug_check_ub.init();

		this.m_phong_prop_global_ambient_intensity = c_vec3.gen(0.5, 0.5, 0.5);
		this.m_phong_prop_fog_intensity = c_vec3.gen(0.2, 0.5, 0.2);
		this.m_phong_prop_current_light_count = 0;
		this.m_phong_prop_z_near = 0.1;
		this.m_phong_prop_z_far = 100.0;

		this.m_camera = new c_camera();
		this.m_camera.m_target = c_vec3.gen(50, 5, 50);
		this.m_camera.m_eye = c_vec3.gen(50, 5, 75);
		this.m_camera.init(is_orbit_mode_);

		
		this.add_directional_light(c_directional_light.gen(c_vec3.gen(-1, 0, 0).get_normalized(), // direction
															c_vec3.gen(0.1, 0.1, 0.1), // ambient
															c_vec3.gen(1.0, 1.0, 0.2), // diffuse
															c_vec3.gen(1.0, 1.0, 0.3))); // specular

	/*		
		this.add_point_light(c_point_light.gen(c_vec3.gen(0.3, 0, 0), // position
												c_vec3.gen(0.8, 0.2, 0.2), // ambient
												c_vec3.gen(0.1, 0, 0), // diffuse
												c_vec3.gen(0, 0.2, 0), // specular
												1.0, // constant att
												0.1, // linear att
												0.1)); // quadratic att
	*/	
/*
		this.add_spot_light(c_spot_light.gen(c_vec3.gen(0, 5, 0), // position
												c_vec3.gen(0.0, -5, 0).get_normalized(), // direction
												c_vec3.gen(1.0, 0.3, 0.3), // ambient
												c_vec3.gen(0.0, 0.0, 0.0), // diffuse
												c_vec3.gen(0.0, 0.0, 0.0), // specular
												1.0, // constant att
												0.1, // linear att
												0.1, // quadratic att
												45.0, // inner angle
												80.0, // outer angle
												10.0)); // fall off
		*/

	
		let terrain_width = 100.0;
		let terrain_height = 100.0;
		let terrain_row_tile_count = 10;
		let terrain_col_tile_count = 10;
		let terrain_start_pos = c_vec3.gen(0, 0, 0);
		let terrain = c_object.gen_with_mesh_builder(
								c_mesh_builder.gen_terrain(null,
															terrain_width,
															terrain_height,
															terrain_row_tile_count,
															terrain_col_tile_count,
															terrain_start_pos),
								c_material.gen(false,
												false,
												c_vec3.gen(0.3, 0.3, 0.3), // ambient
												c_vec3.gen(0.4, 0.4, 0.4), // diffuse
												c_vec3.gen(0.3, 0.3, 0.1), // specular
												c_vec3.gen(0.0, 0.0, 0.0), // emission
												32) // shininess
		);
		this.m_objects.push(terrain);
		/*
		let xy_quad = c_object.gen_with_mesh_builder(
						c_mesh_builder.gen_quad(null,
													0.5,
													0.5,
													true,
													c_vec3.gen(0, 0, 0)),
						c_material.gen(false,
										false,
										c_vec3.gen(0.2, 1.0, 0.2), // ambient
										c_vec3.gen(0.2, 0.2, 0.2), // diffuse
										c_vec3.gen(0.1, 0.1, 0.1), // specular
										c_vec3.gen(0.5, 0.1, 0.1), // emission
										1) // shininess
		);
		this.m_objects.push(xy_quad);

		
		let sample_ring = c_object.gen_with_mesh_builder(
								c_mesh_builder.gen_ring(null,
														c_vec3.gen(0, 2, 0),
														2.0,
														1.0,
														10),
								c_material.gen(false,
												false,
												c_vec3.gen(0.2, 0.1, 0.2), // ambient
												c_vec3.gen(0.5, 0.2, 0.2), // diffuse
												c_vec3.gen(0.1, 0.1, 0.1), // specular
												c_vec3.gen(0.5, 0.1, 0.1), // emission
												1) // shininess
		);
		this.m_objects.push(sample_ring);

		let sample_cap = c_object.gen_with_mesh_builder(
			c_mesh_builder.gen_cap(null,
									c_vec3.gen(2, 4, 2),
									2.0,
									false,
									10),
			c_material.gen(false,
							false,
							c_vec3.gen(0.2, 0.1, 0.2), // ambient
							c_vec3.gen(0.5, 0.2, 0.2), // diffuse
							c_vec3.gen(0.1, 0.1, 0.1), // specular
							c_vec3.gen(0.5, 0.1, 0.1), // emission
							1) // shininess
		);
		this.m_objects.push(sample_cap);

		let sample_cylinder = c_object.gen_with_mesh_builder(
			c_mesh_builder.gen_cylinder(null,
										c_vec3.gen(5, 6, 5),
										1.0,
										1.0,
										1.0,
										10,
										5),
			c_material.gen(false,
							false,
							c_vec3.gen(0.2, 0.1, 0.2), // ambient
							c_vec3.gen(0.5, 0.2, 0.2), // diffuse
							c_vec3.gen(0.1, 0.1, 0.1), // specular
							c_vec3.gen(0.5, 0.1, 0.1), // emission
							1) // shininess
		);
		this.m_objects.push(sample_cylinder);
		*/
	}

	update(dt_) {
		shader_mgr.m_program_phong.update_phong_props(this.m_phong_prop_global_ambient_intensity,
														this.m_phong_prop_fog_intensity,
														this.m_phong_prop_current_light_count,
														this.m_phong_prop_z_near,
														this.m_phong_prop_z_far);
		shader_mgr.m_program_debug_check_ub.update_phong_props(this.m_phong_prop_global_ambient_intensity,
																this.m_phong_prop_fog_intensity,
																this.m_phong_prop_current_light_count,
																this.m_phong_prop_z_near,
																this.m_phong_prop_z_far);
		let rotate_lights = true;
		let rot_speed = 50.0;
		for (let i = 0; i < this.m_phong_prop_current_light_count; ++ i) {
			let lt = this.m_lights[i];
			if (lt.m_lt_type === 0) { // directional light
				if (rotate_lights === true) {
					let rot_mat = c_mat4.get_rotated_y(c_math.deg_to_rad(rot_speed * dt_));
					lt.m_lt_dir = lt.m_lt_dir.get_mat4_multiplied(rot_mat);
				}
			} else if (lt.m_lt_type === 1) { // point light
			} else if (lt.m_lt_type === 2) { // spot light
			}
			shader_mgr.m_program_phong.update_specific_light(i, lt);
			shader_mgr.m_program_debug_check_ub.update_specific_light(i, lt);
		}
		shader_mgr.m_program_phong.use();
		shader_mgr.m_program_phong.update_lights_ubo();

		shader_mgr.m_program_debug_check_ub.use();
		shader_mgr.m_program_debug_check_ub.update_lights_ubo();

		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL); // Near things obscure far things
		
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		let view_mat = this.m_camera.get_view_mat();
		let proj_mat = this.m_camera.get_perspective_proj_mat(85.0,
																16.0 / 9.0,
																this.m_phong_prop_z_near,
																this.m_phong_prop_z_far);

		for (let i = 0; i < this.m_objects.length; ++ i) {
			let object = this.m_objects[i];
			object.render(dt_,
						  view_mat,
						  proj_mat);
			object.debug_render(dt_,
								view_mat,
								proj_mat);
		}
		if (this.m_plant_tree !== undefined) {
			this.m_plant_tree.render(dt_,
										view_mat,
										proj_mat);
		}
	}

	destroy() {
		shader_mgr.m_program_phong.destroy();
		this.m_lights.destroy();
	}

	add_directional_light(directional_lt_) {
		if (this.m_lights.length >= this.m_max_num_of_lights)
			return;
		this.m_lights.push(directional_lt_);
		this.m_phong_prop_current_light_count += 1;
	}

	add_point_light(point_lt_) {
		if (this.m_lights.length >= this.m_max_num_of_lights)
			return;		
		this.m_lights.push(point_lt_);
		this.m_phong_prop_current_light_count += 1;
	}

	add_spot_light(spot_lt_) {
		if (this.m_lights.length >= this.m_max_num_of_lights)
			return;				
		this.m_lights.push(spot_lt_);
		this.m_phong_prop_current_light_count += 1;
	}
}
