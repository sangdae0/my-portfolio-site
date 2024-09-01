class c_program_debug_normal_line {
	m_program;

	/* public */

	m_attloc_vert_pos_;
	m_loc_model_view_mat_;
	m_loc_proj_mat_;

	set_program(program_) {
		this.m_program = program_;
	}

	init() {
		this.use();

		this.m_attloc_vert_pos_ = gl.getAttribLocation(this.m_program, "vert_pos_");	
		this.m_loc_model_view_mat_ = gl.getUniformLocation(this.m_program, "model_view_mat_");
		this.m_loc_proj_mat_ = gl.getUniformLocation(this.m_program, "proj_mat_");
	}

	use() {
		gl.useProgram(this.m_program);
	}

	get_program() {
		return this.m_program;
	}

	update_mesh_info(model_view_mat_,
						proj_mat_) {
		gl.uniformMatrix4fv(this.m_loc_model_view_mat_,
							false,
							model_view_mat_.m_arr);
		gl.uniformMatrix4fv(this.m_loc_proj_mat_,
							false,
							proj_mat_.m_arr);
	}

	destroy() {
	}
}
