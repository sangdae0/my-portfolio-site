class c_camera {
	m_eye;
	m_target;

	m_is_orbit_mode;

	/**
	 * @param {boolean} is_orbit_mode_ 
	 */
	init(is_orbit_mode_) {
		this.m_is_orbit_mode = is_orbit_mode_;
	}

	// from prev project
	get_view_mat() {
		let cam_forward_dir = this.m_target.get_vec3_subtracted(this.m_eye);
		cam_forward_dir = cam_forward_dir.get_normalized();

		let up_dir = c_vec3.gen(0, 1, 0);

		let cam_side_dir = c_math.cross_product(cam_forward_dir, up_dir);
		cam_side_dir = cam_side_dir.get_normalized();

		let cam_up_dir = c_math.cross_product(cam_side_dir, cam_forward_dir)
							.get_normalized();

		let rot_mat = new c_mat4();
		rot_mat.m_e00 = cam_side_dir.m_x;
		rot_mat.m_e01 = cam_side_dir.m_y;
		rot_mat.m_e02 = cam_side_dir.m_z;

		rot_mat.m_e10 = cam_up_dir.m_x;
		rot_mat.m_e11 = cam_up_dir.m_y;
		rot_mat.m_e12 = cam_up_dir.m_z;

		rot_mat.m_e20 = -cam_forward_dir.m_x;
		rot_mat.m_e21 = -cam_forward_dir.m_y;
		rot_mat.m_e22 = -cam_forward_dir.m_z;

		rot_mat.m_e33 = 1.0;
		rot_mat.update_arr();

		let tr_mat = c_mat4.get_translated(c_vec3.gen(-this.m_eye.m_x,
														-this.m_eye.m_y,
														-this.m_eye.m_z));

		let ret = rot_mat.get_mat4_multiplied(tr_mat);
		return ret;
	}
	
	// https://www.toptal.com/javascript/3d-graphics-a-webgl-tutorial
	// refer from prev project
	/** Test */
	get_perspective_proj_mat(fov_vertical_deg_,
								aspect_ratio_,
								near_,
								far_) {
								
		let fov_vertical_rad = c_math.deg_to_rad(fov_vertical_deg_);

		let ret = new c_mat4();
		ret.m_e00 = 1.0 / (Math.tan(fov_vertical_rad * 0.5) * aspect_ratio_);
		ret.m_e11 = 1.0 / Math.tan(fov_vertical_rad * 0.5);
		ret.m_e22 = -(far_ + near_) / (far_ - near_);
		ret.m_e23 = (-2.0 * far_ * near_) / (far_ - near_);
		ret.m_e32 = -1.0;
		ret.update_arr();
		return ret;
	}

	zoom(amount_) {
		let to_target_dir = this.m_target
							.get_vec3_subtracted(this.m_eye)
							.get_normalized();
		let to_move = to_target_dir.get_num_multiplied(amount_);
		this.m_eye = this.m_eye.get_vec3_added(to_move);
		this.m_target = this.m_target.get_vec3_added(to_move);
	}

	rotate(amount_) {
		if (this.m_is_orbit_mode) {
			let tr_mat_to_original = c_mat4.get_translated(this.m_target);
			let tr_mat_to_zero = c_mat4.get_translated(c_vec3.gen(-this.m_target.m_x,
																	-this.m_target.m_y,
																	-this.m_target.m_z));
			let rot_mat = c_mat4.get_rotated_y(c_math.deg_to_rad(amount_));

			let mat_to_apply = tr_mat_to_original.get_mat4_multiplied(rot_mat.get_mat4_multiplied(tr_mat_to_zero));
			this.m_eye = mat_to_apply.get_vec4_multiplied(this.m_eye, 1.0);
		}
	}	
}