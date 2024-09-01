// refer from https://www.gamasutra.com/blogs/JayelindaSuridge/20130903/199457/Modelling_by_numbers_Part_One_A.php
class c_mesh_builder {
	m_vertices = [];
	m_indices = [];
	m_normals = [];
	m_uvs = [];

	static gen_from_l_system(code_str_) {
		let lines = code_str_.split(';');
		
		let corresponds_funcs = new Map();
		let n;
		let w_func;
		let turn_angle;
		let set_type = -1;
		for (let i = 0; i < lines.length; ++ i) {
			let line = lines[i].trim();
			if (line.length === 0) continue;
			let words = line.split(':');
			let lhs = words[0].trim();
			if (lhs === "set") {
				let set_name = words[1].trim();
				if (set_name === "str")
					set_type = 0;
				else if (set_name === "2d_tree")
					set_type = 1;
				else if (set_name === "3d_tree")
					set_type = 2;
				continue;
			} else if (lhs === 'n') {
				n = parseInt(words[1]);
				continue;
			} else if (lhs === "turn_angle") {
				turn_angle = parseFloat(words[1]);
				continue;
			}

			if (corresponds_funcs.has(lhs) === true) {
				console.log("duplicate rule!: " + lhs);
				return;
			}

			let rhses = words[1].trim().split('$');
			let funcs = [];
			let is_w = false;
			for (let j = 0; j < rhses.length; ++ j) {
				let rhs = rhses[j];
				if (rhs === "")
					continue;
				let func;
				if (lhs === "w") {
					is_w = true;
					w_func = function() {
						return rhs;
					}
				} else {
					func = function() {
						return rhs;
					}
					if (func !== undefined)
						funcs.push(func);
				}
			}
			if (funcs.length > 0 && is_w === false)
				corresponds_funcs.set(lhs, funcs);
		}

		let result_arr = [];
		c_mesh_builder.sub_gen_l(w_func(),
								corresponds_funcs,
								result_arr,
								n,
								0);
		
		if (set_type === 0) {
			console.log("str gen: " + result_arr);
		} else {
			if (result_arr.length === 0)
				return;
			let f_str = [];
			for (let i = 0; i < result_arr.length; ++ i) {
				let result_str = result_arr[i];
				for (let j = 0; j < result_str.length; ++ j) {
					f_str.push(result_str[j]);
				}
			}
			let tree_segment_mbs = [];
			if (set_type === 1) {
				console.log("gen 2d tree str: " + result_arr);
				let is_2d = true;
				tree_segment_mbs = c_tree_builder.gen_tree_from_l_strs(is_2d,
																			f_str,
																			c_vec3.gen(50, 0, 50),
																			turn_angle,
																			5.0,
																			0.4,
																			0.2);
			} else {
				console.log("gen 3d tree str: " + result_arr);
				tree_segment_mbs = c_tree_builder.gen_tree_from_l_strs(false,
																			f_str,
																			c_vec3.gen(50, 0, 50),
																			turn_angle,
																			5.0,
																			0.4,
																			0.2);
			}
			for (let i = 0; i < tree_segment_mbs.length; ++ i) {
				let obj = c_object.gen_with_mesh_builder(
					tree_segment_mbs[i],
					c_material.gen(false,
									false,
									c_vec3.gen(0.6, 0.2, 0.1), // ambient
									c_vec3.gen(0.4, 0.4, 0.4), // diffuse
									c_vec3.gen(0.3, 0.3, 0.1), // specular
									c_vec3.gen(0.0, 0.0, 0.0), // emission
									32) // shininess
				);
				current_scene.m_objects.push(obj);
			}
		}
	}

	static sub_gen_l(word_,
					 corresponds_funcs_,
					 result_arr_,
					 n_,
					 count_) {
		if (n_ < 1) {
			console.log("n should be bigger than 0");
			return;
		}

		if (word_ === undefined)
			return null;

		let elems = word_.split('$');
		for (let i = 0; i < elems.length; ++ i) {
			let elem = elems[i];
			if (elem === "")
				continue;
			if (corresponds_funcs_.has(elem) === false) {
				console.log("error in sub gen l")
				return;
			}
			let funcs_to_run = corresponds_funcs_.get(elem);
			for (let j = 0; j < funcs_to_run.length; ++ j) {
				let func_to_run = funcs_to_run[j];
				let interpreted_str = func_to_run();
				let interpreted_elems = interpreted_str.split('$');
				for (let k = 0; k < interpreted_elems.length; ++ k) {
					let interpreted_elem = interpreted_elems[k];
					if (interpreted_elem === "")
						continue;
					if ((count_ + 1) >= n_) {
						result_arr_.push(interpreted_elem);
					} else {
						c_mesh_builder.sub_gen_l(interpreted_elem,
													corresponds_funcs_,
													result_arr_,
													n_,
													count_ + 1);
					}
				}
			}
		}
		return null;
	}

	// refer from prev GAM project and https://www.gamasutra.com/blogs/JayelindaSuridge/20130905/199626/Modelling_by_numbers_Part_Two_A.php
	static gen_cylinder(to_append_,
						bottom_,
						height_,
						bottom_radius_,
						top_radius_,
						slice_count_,
						stack_count_,
						enable_bending_,
						unbended_end_) {
		let ret = to_append_ ? to_append_ : new c_mesh_builder();
		
		let height_step = height_ / stack_count_;
		let radius_diff = top_radius_ - bottom_radius_;
		let increase_rad = (c_math.is_zero(radius_diff) === true) ? false : true;
		let radius_step;
		if (increase_rad === true)
			radius_step = radius_diff / stack_count_;

		let top_center = c_vec3.gen(bottom_.m_x,
									bottom_.m_y + height_,
									bottom_.m_z);		

		let current_center = c_vec3.gen(bottom_.m_x,
										bottom_.m_y,
										bottom_.m_z);
		let current_radius = bottom_radius_;
		if (enable_bending_ === true) {
			let t_step = 1.0 / stack_count_;
			let current_t = 0.0;
			let to_unbended_end = unbended_end_.get_vec3_subtracted(bottom_).get_normalized();
			
			let inter_node_1 = bottom_.get_vec3_added(to_unbended_end.get_num_multiplied(0.25));
			let inter_node_2 = bottom_.get_vec3_added(to_unbended_end.get_num_multiplied(0.75));
			let control_pts = [];
			control_pts.push(bottom_);
			top_center.print();
			inter_node_1.print();
			control_pts.push(inter_node_1);
			control_pts.push(inter_node_2);
			control_pts.push(top_center);
			let prev_center = c_vec3.zero();
			for (let i = 0; i < stack_count_; ++ i) {
				current_t += t_step;
				let interpolated;
				// if last just use last point(bezier curve)
				if (i == (stack_count_ - 1))
					interpolated = top_center;
				else
					interpolated = c_math.gen_cubic_bezier_curve(current_t, control_pts);
				//interpolated.print();
				c_mesh_builder.gen_ring(ret,
										prev_center,
										interpolated,
										current_radius,
										slice_count_);
				prev_center = interpolated;
				if (increase_rad === true)
					current_radius += radius_step;
			}
		} else {
			let to_end = c_vec3.gen(0, height_step, 0);
			let prev_center = c_vec3.zero();
			for (let i = 0; i < stack_count_; ++ i) {
				let interpolated = prev_center.get_vec3_added(to_end);
				c_mesh_builder.gen_ring(ret,
										prev_center,
										interpolated,
										current_radius,
										slice_count_);
				prev_center = interpolated;
				if (increase_rad === true)
					current_radius += radius_step;
			}
		}
	
		c_mesh_builder.gen_cap(ret,
								top_center,
								top_radius_,
								true,
								slice_count_);

		c_mesh_builder.gen_cap(ret,
								bottom_,
								bottom_radius_,
								false,
								slice_count_);
	
		return ret;
	}

	// refer from prev GAM project and https://www.gamasutra.com/blogs/JayelindaSuridge/20130905/199626/Modelling_by_numbers_Part_Two_A.php
	static gen_ring(to_append_,
					center_start_,
					center_end_,
					radius_,
					slice_count_) {
		let ret = to_append_ ? to_append_ : new c_mesh_builder();

		let start_vert_idx = ret.m_vertices.length === 0 ? 0 : ret.m_vertices.length;

		let theta_step = (2.0 * c_math.pi()) / slice_count_;
		for (let i = 0; i < slice_count_; ++ i) {
			let unit_pos = c_vec3.gen(Math.cos(i * theta_step) * radius_,
										0,
										Math.sin(i * theta_step) * radius_);
			let bottom_ring_vert_pos = center_start_.get_copied();
			bottom_ring_vert_pos = bottom_ring_vert_pos.get_vec3_added(unit_pos);

			ret.m_vertices.push(bottom_ring_vert_pos);
			let bottom_ring_vert_idx = ret.m_vertices.length - 1;
			ret.m_normals.push(unit_pos);
			ret.m_uvs.push(c_vec2.gen(0, 0));
			
			let top_ring_vert_pos = center_end_.get_copied();
			top_ring_vert_pos = top_ring_vert_pos.get_vec3_added(unit_pos);

			ret.m_vertices.push(top_ring_vert_pos);
			let top_ring_vert_idx = ret.m_vertices.length - 1;
			ret.m_normals.push(unit_pos);
			ret.m_uvs.push(c_vec2.gen(0, 0));

			if (i > 0) {
				let prev_bottom_ring_vert_idx = ret.m_vertices.length - 4;
				let prev_top_ring_vert_idx = prev_bottom_ring_vert_idx + 1;

				let current_bottom_ring_vert_idx = bottom_ring_vert_idx;
				let current_top_ring_vert_idx = top_ring_vert_idx;

				ret.m_indices.push(prev_top_ring_vert_idx);
				ret.m_indices.push(prev_bottom_ring_vert_idx);
				ret.m_indices.push(current_bottom_ring_vert_idx);

				ret.m_indices.push(prev_top_ring_vert_idx);
				ret.m_indices.push(current_bottom_ring_vert_idx);
				ret.m_indices.push(current_top_ring_vert_idx);
			}
		}

		let prev_bottom_ring_vert_idx = ret.m_vertices.length - 2;
		let prev_top_ring_vert_idx = prev_bottom_ring_vert_idx + 1;

		let current_bottom_ring_vert_idx = start_vert_idx;
		let current_top_ring_vert_idx = start_vert_idx + 1;

		ret.m_indices.push(prev_top_ring_vert_idx);
		ret.m_indices.push(prev_bottom_ring_vert_idx);
		ret.m_indices.push(current_bottom_ring_vert_idx);

		ret.m_indices.push(prev_top_ring_vert_idx);
		ret.m_indices.push(current_bottom_ring_vert_idx);
		ret.m_indices.push(current_top_ring_vert_idx);

		return ret;
	}

	// refer from prev GAM project and https://www.gamasutra.com/blogs/JayelindaSuridge/20130905/199626/Modelling_by_numbers_Part_Two_A.php
	static gen_cap(to_append_,
					center_,
					radius_,
					is_top_cap_,
					slice_count_) {
		let ret = to_append_ ? to_append_ : new c_mesh_builder();

		let cap_normal = (is_top_cap_ === true) ? 
								c_vec3.gen_up_dir()
								: c_vec3.gen_up_dir().get_num_multiplied(-1.0);
		ret.m_vertices.push(center_);
		ret.m_normals.push(cap_normal);
		ret.m_uvs.push(c_vec2.gen(0, 0));

		let center_vert_idx = ret.m_vertices.length - 1;

		let theta_step = (2.0 * c_math.pi()) / slice_count_;
		for (let i = 0; i < slice_count_; ++ i) {
			let vert = center_;
			let unit_pos = c_vec3.gen(Math.cos(i * theta_step) * radius_,
										0,
										Math.sin(i * theta_step) * radius_);
			let added = vert.get_vec3_added(unit_pos);
			ret.m_vertices.push(added);
			ret.m_normals.push(cap_normal);
			ret.m_uvs.push(c_vec2.gen(0, 0));

			if (i > 0) {
				let base_idx = ret.m_vertices.length - 1;

				if (is_top_cap_ === true) {
					ret.m_indices.push(center_vert_idx);
					ret.m_indices.push(base_idx - 1);
					ret.m_indices.push(base_idx);
				} else {
					ret.m_indices.push(center_vert_idx);
					ret.m_indices.push(base_idx);
					ret.m_indices.push(base_idx - 1);
				}
			}
		}
		let base_idx = ret.m_vertices.length - 1;

		if (is_top_cap_ === true) {
			ret.m_indices.push(center_vert_idx);
			ret.m_indices.push(base_idx);
			ret.m_indices.push(center_vert_idx + 1);
		} else {
			ret.m_indices.push(center_vert_idx);
			ret.m_indices.push(center_vert_idx + 1);
			ret.m_indices.push(base_idx);
		}
		return ret;
	}

	static gen_quad(to_append_,
					width_,
					height_,
					use_xy_,
					offset_vec_) {
			let ret = to_append_ ? to_append_ : new c_mesh_builder();

			ret.m_vertices.push((use_xy_ ?
								c_vec3.gen(0.0, height_, 0.0)
								: c_vec3.gen(0.0, 0.0, 0.0))
							.get_vec3_added(offset_vec_));
			ret.m_normals.push(use_xy_ ? c_vec3.gen_front_dir() : c_vec3.gen_up_dir());
			ret.m_uvs.push(c_vec2.gen(0.0, 0.0));

			ret.m_vertices.push((use_xy_ ? 
								c_vec3.gen(0.0, 0.0, 0.0)
								: c_vec3.gen(0.0, 0.0, height_))
							.get_vec3_added(offset_vec_));
			ret.m_normals.push(use_xy_ ? c_vec3.gen_front_dir() : c_vec3.gen_up_dir());
			ret.m_uvs.push(c_vec2.gen(0.0, 1.0));

			ret.m_vertices.push((use_xy_ ?
								c_vec3.gen(width_, 0.0, 0.0)
									: c_vec3.gen(width_, 0.0, height_))
							.get_vec3_added(offset_vec_));
			ret.m_normals.push(use_xy_ ? c_vec3.gen_front_dir() : c_vec3.gen_up_dir());
			ret.m_uvs.push(c_vec2.gen(1.0, 1.0));


			ret.m_vertices.push((use_xy_ ? 
									c_vec3.gen(width_, height_, 0.0)
									: c_vec3.gen(width_, 0.0, 0.0))
								.get_vec3_added(offset_vec_));
			ret.m_normals.push(use_xy_ ? c_vec3.gen_front_dir() : c_vec3.gen_up_dir());
			ret.m_uvs.push(c_vec2.gen(1.0, 0.0));

			let base_idx = ret.m_vertices.length - 4;
			ret.m_indices.push(base_idx);
			ret.m_indices.push(base_idx + 1);
			ret.m_indices.push(base_idx + 3);

			ret.m_indices.push(base_idx + 1);
			ret.m_indices.push(base_idx + 2);
			ret.m_indices.push(base_idx + 3);

			return ret;
	}

	static gen_terrain(to_append_,
						terrain_width_,
						terrain_height_,
						row_tile_count_,
						col_tile_count_,
						offset_vec_) {
		let tile_width = terrain_width_ / col_tile_count_;
		let tile_height = terrain_height_ / row_tile_count_;

		let tile_start_pos = offset_vec_;
		let original_x = tile_start_pos.m_x;
		let ret = to_append_ ? to_append_ : new c_mesh_builder();
		for (let i = 0; i < row_tile_count_; ++ i) {
			for (let j = 0; j < col_tile_count_; ++ j) {
				c_mesh_builder.gen_quad(ret,
										tile_width,
										tile_height,
										false,
										tile_start_pos);
				tile_start_pos.set(tile_start_pos.m_x + tile_width,
									tile_start_pos.m_y,
									tile_start_pos.m_z);
			}
			tile_start_pos.set(original_x,
								tile_start_pos.m_y,
								tile_start_pos.m_z + tile_height);			
		}
		return ret;
	}
}