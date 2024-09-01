class c_mesh {
	/* private */
	m_draw_mesh = true;
	m_mesh_vao;
	m_mesh_pos_vbo;
	m_mesh_normal_vbo;
	m_mesh_uv_vbo;
	m_mesh_ibo = -1;

	m_vertices = [];
	m_normals = [];
	m_uvs = [];
	m_indices = [];

	m_material;

	m_debug_render_normal_line = true;
	m_debug_normal_line_vao;
	m_debug_normal_line_vbo;
	m_debug_normal_line_count;

	m_debug_check_vao = false;
	m_debug_check_vao_vao;
	m_debug_check_vao_pos_vbo;
	m_debug_check_vao_normal_vbo;
	m_debug_check_vao_uv_vbo;
	m_debug_check_vao_ibo = -1;

	m_debug_check_ub = false;
	m_debug_check_ub_vao;
	m_debug_check_ub_pos_vbo;
	m_debug_check_ub_normal_vbo;
	m_debug_check_ub_uv_vbo;
	m_debug_check_ub_ibo = -1;
	
	/* public */
	static gen_with_mesh_builder(mesh_builder_, material_) {
		let ret = new c_mesh();
		ret.m_vertices = mesh_builder_.m_vertices;
		ret.m_indices = mesh_builder_.m_indices;
		ret.m_normals = mesh_builder_.m_normals;
		ret.m_uvs = mesh_builder_.m_uvs;
		ret.m_material = material_;
		ret.init();
		return ret;
	}

	m_local_mat;
	init() {
		this.m_local_mat = c_mat4.identity();

		// vert pos
		let vertices_data = [];
		for (let i = 0; i < this.m_vertices.length; ++ i) {
			for (let j = 0; j < 3; ++ j) {
				vertices_data.push(this.m_vertices[i].m_arr[j]);
			}
		}

		// vert normal
		let normals_data = [];
		for (let i = 0; i < this.m_normals.length; ++ i) {
			for (let j = 0; j < 3; ++ j) {
				normals_data.push(this.m_normals[i].m_arr[j]);
			}
		}

		// vert uv
		let uvs_data = [];
		for (let i = 0; i < this.m_uvs.length; ++ i) {
			for (let j = 0; j < 2; ++ j) {
				uvs_data.push(this.m_uvs[i].m_arr[j]);
			}
		}

		if (this.m_draw_mesh) {
			shader_mgr.m_program_phong.use();
			this.m_mesh_vao = gl.createVertexArray();
			gl.bindVertexArray(this.m_mesh_vao);

			this.m_mesh_pos_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_mesh_pos_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(vertices_data),
							gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_phong.m_attloc_vert_pos_);		
			gl.vertexAttribPointer(shader_mgr.m_program_phong.m_attloc_vert_pos_,
								3,
								gl.FLOAT,
								false,
								0,
								0);

			this.m_mesh_normal_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_mesh_normal_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(normals_data),
							gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_phong.m_attloc_vert_normal_);		
			gl.vertexAttribPointer(shader_mgr.m_program_phong.m_attloc_vert_normal_,
									3,
									gl.FLOAT,
									false,
									0,
									0);

			this.m_mesh_uv_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_mesh_uv_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(uvs_data),
							gl.STATIC_DRAW);
			
			gl.enableVertexAttribArray(shader_mgr.m_program_phong.m_attloc_vert_uv_);		
			gl.vertexAttribPointer(shader_mgr.m_program_phong.m_attloc_vert_uv_,
									2,
									gl.FLOAT,
									false,
									0,
									0);

			this.m_mesh_ibo = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_mesh_ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
							new Uint32Array(this.m_indices),
							gl.STATIC_DRAW);

			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);	
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}

		// gen debug normal
		if (this.m_debug_render_normal_line) {
			shader_mgr.m_program_debug_normal_line.use();
			this.m_debug_normal_line_vao = gl.createVertexArray();
			gl.bindVertexArray(this.m_debug_normal_line_vao);

			// normal start pos, normal end pos
			let debug_normal_line_data = [];
			this.m_debug_normal_line_count = 0;
			if (this.m_normals.length === this.m_vertices.length) {
				let normal_count = this.m_normals.length;
				for (let i = 0; i < normal_count; ++ i) {
					let line_start_pos = this.m_vertices[i];
					// use start pos as vert pos
					for (let j = 0; j < 3; ++ j)
						debug_normal_line_data.push(line_start_pos.m_arr[j]);

					let line_length = 0.2;
					// normal should be normalized
					let line_end_pos = line_start_pos.get_vec3_added(this.m_normals[i].get_num_multiplied(line_length));
					for (let j = 0; j < 3; ++ j)
						debug_normal_line_data.push(line_end_pos.m_arr[j]);
					
					this.m_debug_normal_line_count += 2;
				}
			}

			this.m_debug_normal_line_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_normal_line_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
						  new Float32Array(debug_normal_line_data),
						  gl.STATIC_DRAW);
			
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_normal_line.m_attloc_vert_pos_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_normal_line.m_attloc_vert_pos_,
								   3,
								   gl.FLOAT,
								   false,
								   0,
								   0);

			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		if (this.m_debug_check_vao) {
			shader_mgr.m_program_debug_check_vao.use();
			this.m_debug_check_vao_vao = gl.createVertexArray();
			gl.bindVertexArray(this.m_debug_check_vao_vao);
	
			this.m_debug_check_vao_pos_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_vao_pos_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
						  new Float32Array(vertices_data),
						  gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_vao.m_attloc_vert_pos_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_vao.m_attloc_vert_pos_,
								   3,
								   gl.FLOAT,
								   false,
								   0,
								   0);
	
			this.m_debug_check_vao_normal_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_vao_normal_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(normals_data),
							gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_vao.m_attloc_vert_normal_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_vao.m_attloc_vert_normal_,
									3,
									gl.FLOAT,
									false,
									0,
									0);
									
			this.m_debug_check_vao_uv_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_vao_uv_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(uvs_data),
							gl.STATIC_DRAW);
			
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_vao.m_attloc_vert_uv_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_vao.m_attloc_vert_uv_,
									2,
									gl.FLOAT,
									false,
									0,
									0);
	
			this.m_debug_check_vao_ibo = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_debug_check_vao_ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
						  new Uint32Array(this.m_indices),
						  gl.STATIC_DRAW);
	
			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);	
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);	
		}

		if (this.m_debug_check_ub) {
			shader_mgr.m_program_debug_check_ub.use();
			this.m_debug_check_ub_vao = gl.createVertexArray();
			gl.bindVertexArray(this.m_debug_check_ub_vao);
	
			this.m_debug_check_ub_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_ub_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
						  new Float32Array(vertices_data),
						  gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_ub.m_attloc_vert_pos_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_ub.m_attloc_vert_pos_,
								   3,
								   gl.FLOAT,
								   false,
								   0,
								   0);
	
			this.m_debug_check_ub_normal_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_ub_normal_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(normals_data),
							gl.STATIC_DRAW);
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_ub.m_attloc_vert_normal_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_ub.m_attloc_vert_normal_,
									3,
									gl.FLOAT,
									false,
									0,
									0);
									
			this.m_debug_check_ub_uv_vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_check_ub_uv_vbo);
			gl.bufferData(gl.ARRAY_BUFFER,
							new Float32Array(uvs_data),
							gl.STATIC_DRAW);
			
			gl.enableVertexAttribArray(shader_mgr.m_program_debug_check_ub.m_attloc_vert_uv_);		
			gl.vertexAttribPointer(shader_mgr.m_program_debug_check_ub.m_attloc_vert_uv_,
									2,
									gl.FLOAT,
									false,
									0,
									0);
	
			this.m_debug_check_ub_ibo = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_debug_check_ub_ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
						  new Uint32Array(this.m_indices),
						  gl.STATIC_DRAW);
	
			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);	
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);	
		}
	}

	shutdown() {
		this.m_vertices.destroy();
	}

	render(dt_,
			view_mat_,
			proj_mat_) {
		if (this.m_draw_mesh) {
			shader_mgr.m_program_phong.use();

			gl.bindVertexArray(this.m_mesh_vao);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_mesh_ibo);

			let model_view_mat = view_mat_.get_mat4_multiplied(this.m_local_mat);
			let normal_model_view_mat = model_view_mat.get_copied();
			normal_model_view_mat = normal_model_view_mat.get_inversed();
			normal_model_view_mat = normal_model_view_mat.get_transposed();

			shader_mgr.m_program_phong.update_mesh_info(model_view_mat,
														normal_model_view_mat,
														proj_mat_,
														this.m_material);
			gl.drawElements(gl.TRIANGLES,
							this.m_indices.length,
							gl.UNSIGNED_INT,
							0);

			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}

	debug_render(dt_,
					view_mat_,
	   				proj_mat_) {
		if (this.m_debug_render_normal_line) {
			shader_mgr.m_program_debug_normal_line.use();

			gl.bindVertexArray(this.m_debug_normal_line_vao);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.m_debug_normal_line_vbo);
	
			let model_view_mat = view_mat_.get_mat4_multiplied(this.m_local_mat);
			shader_mgr.m_program_debug_normal_line.update_mesh_info(model_view_mat,
																	proj_mat_);
			gl.drawArrays(gl.LINES,
						0,
						this.m_debug_normal_line_count);
	
			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		if (this.m_debug_check_vao) {
			shader_mgr.m_program_debug_check_vao.use();

			gl.bindVertexArray(this.m_debug_check_vao_vao);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_debug_check_vao_ibo);
	
			let model_view_mat = view_mat_.get_mat4_multiplied(this.m_local_mat);
			let normal_model_view_mat = model_view_mat.get_copied();
			shader_mgr.m_program_debug_check_vao.update_mesh_info(model_view_mat,
																	normal_model_view_mat,
																	proj_mat_);
			gl.drawElements(gl.TRIANGLES,
							this.m_indices.length,
							gl.UNSIGNED_INT,
							0);
	
			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}

		if (this.m_debug_check_ub) {
			shader_mgr.m_program_debug_check_ub.use();

			gl.bindVertexArray(this.m_debug_check_ub_vao);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_debug_check_ub_ibo);
	
			let model_view_mat = view_mat_.get_mat4_multiplied(this.m_local_mat);
			let normal_model_view_mat = model_view_mat.get_copied();
			shader_mgr.m_program_debug_check_ub.update_mesh_info(model_view_mat,
																	normal_model_view_mat,
																	proj_mat_,
																	this.m_material);
			gl.drawElements(gl.TRIANGLES,
							this.m_indices.length,
							gl.UNSIGNED_INT,
							0);
	
			gl.bindVertexArray(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
 	}
}
