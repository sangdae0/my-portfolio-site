class c_object {
	/* private */
	m_mesh;
	/* public */
	m_pos;

	/**
	 * 
	 * @param mesh_builder_ already inited 
	 */
	static gen_with_mesh_builder(mesh_builder_, material_) {
		let ret = new c_object();
		ret.m_mesh = c_mesh.gen_with_mesh_builder(mesh_builder_, material_);
		return ret;
	}
	
	render(dt_,
			view_mat_,
			proj_mat_) {
		let move_spd = 0.0;
		let move_amount = move_spd * dt_;
		let move_amount_vec3 = new c_vec3();
		move_amount_vec3.set(move_amount, 0.0, 0.0);
		this.m_mesh.m_local_mat = c_mat4.get_translated(move_amount_vec3)
			.get_mat4_multiplied(this.m_mesh.m_local_mat);
		this.m_mesh.render(dt_,
							view_mat_,
							proj_mat_);
	}

	debug_render(dt_,
					view_mat_,
					proj_mat_) {
		this.m_mesh.debug_render(dt_,
									view_mat_,
									proj_mat_);
	}	
}
