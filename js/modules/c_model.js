class c_model {
	/* private */
	m_meshes;
	
	/* public */
	static gen_with_meshes(meshes_) {
		let ret = new c_model();
		ret.m_meshes = meshes_;
		return ret;
	}

	render(dt_,
			view_mat_,
			proj_mat_) {
		for (let i = 0; i < this.m_meshes.length; ++ i) {
			this.m_meshes[i].render(dt_,
									view_mat_,
									proj_mat_);
		}
	}
}