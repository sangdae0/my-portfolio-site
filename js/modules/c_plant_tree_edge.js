class c_plant_tree_edge {
	m_starting_node;
	m_ending_node;
	m_segment_model;

	static gen(start_radius_,
				end_radius_,
				starting_node_,
				ending_node_,
				orientation_mat_,
				enable_bending_,
				unbended_end_,
				slice_count_,
				stack_count_) {
		let ret = new c_plant_tree_edge();
		ret.m_starting_node = starting_node_;
		ret.m_ending_node = ending_node_;

		let segment_material = c_material.gen(false,
												false,
												c_vec3.gen(0.1, 0.1, 0.2), // ambient
												c_vec3.gen(0.3, 0.3, 0.4), // diffuse
												c_vec3.gen(0.6, 0.5, 0.4), // specular
												c_vec3.gen(0.0, 0.0, 0.0), // emission
												32); // shininess

		let to_current = ret.m_ending_node.m_pos.get_vec3_subtracted(ret.m_starting_node.m_pos);
		let to_current_dir = to_current.get_normalized();
		let diff_length = to_current.get_length();

		let orientation_heading_vec = c_vec3.gen(orientation_mat_.m_e00,
										orientation_mat_.m_e10,
										orientation_mat_.m_e20);
		let segment_mb = c_mesh_builder.gen_cylinder(null,
														c_vec3.gen(0, 0, 0),
														diff_length,
														start_radius_,
														end_radius_,
														slice_count_,
														stack_count_,
														enable_bending_,
														unbended_end_);
		let cylinder_heading_dir = c_vec3.gen_up_dir();
		let cylinder_rot_mat;
		// to prevent the case, https://math.stackexchange.com/a/476311
		if (c_math.is_opposite_direction(cylinder_heading_dir,
											orientation_heading_vec) == true)
			// flip
			cylinder_rot_mat = c_mat3.get_rotated_x(c_math.deg_to_rad(180.0));
		else
			cylinder_rot_mat = c_math.get_rotation_from_vec_to_vec(cylinder_heading_dir,
																	orientation_heading_vec);
		let tr_mat = c_mat4.get_translated(ret.m_starting_node.m_pos);
		for (let j = 0; j < segment_mb.m_vertices.length; ++ j){
			segment_mb.m_vertices[j] = cylinder_rot_mat.get_vec3_multiplied(segment_mb.m_vertices[j]);
			segment_mb.m_vertices[j] = tr_mat.get_vec4_multiplied(segment_mb.m_vertices[j],
																	1.0);
		}
		for (let j = 0; j < segment_mb.m_normals.length; ++ j)
			segment_mb.m_normals[j] = cylinder_rot_mat.get_vec3_multiplied(segment_mb.m_normals[j]);

		let segment_mesh = c_mesh.gen_with_mesh_builder(segment_mb, segment_material);
		ret.m_segment_model = segment_mesh;
		return ret;
	}
	
	render(dt_,
			root_model_mat_,
			view_mat_,
			proj_mat_) {
		if (this.m_starting_node === undefined)
				return;
		this.m_segment_model.m_local_mat = root_model_mat_;
		this.m_segment_model.render(dt_,
									view_mat_,
									proj_mat_);
	}
}