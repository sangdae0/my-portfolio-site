class c_math {
	static dot_product(vec_a_, vec_b_) {
		let dp_x = vec_a_.m_x * vec_b_.m_x;
		let dp_y = vec_a_.m_y * vec_b_.m_y;
		let dp_z = vec_a_.m_z * vec_b_.m_z;

		let dp = dp_x + dp_y + dp_z;
		return dp;
	}

	static cross_product(vec_a_, vec_b_) {
		let x = (vec_a_.m_y * vec_b_.m_z) - (vec_a_.m_z * vec_b_.m_y);
		let y = (vec_a_.m_z * vec_b_.m_x) - (vec_a_.m_x * vec_b_.m_z);
		let z = (vec_a_.m_x * vec_b_.m_y) - (vec_a_.m_y * vec_b_.m_x);
		return c_vec3.gen(x, y, z);
	}

	static deg_to_rad(deg_) {
		return (deg_ * Math.PI) / 180.0;
	}

	static is_zero(val_) {
		let abs_val = Math.abs(val_);
		if (abs_val <= Number.EPSILON)
			return true;
		return false;
	}

	static pi() {
		return Math.PI;
	}

	// https://www.slideshare.net/KKARUNKARTHIK/hermit-curves-amp-beizer-curves
	static lerp(t_,
										p_0_,
										p_1_) {
		let inv_t = 1.0 - t_;
		let ret_x = inv_t * p_0_.m_x + t_ * p_1_.m_x;
		let ret_y = inv_t * p_0_.m_y + t_ * p_1_.m_y;
		let ret_z = inv_t * p_0_.m_z + t_ * p_1_.m_z;
		let ret = c_vec3.gen(ret_x, ret_y, ret_z);
		return ret;
	}

	// https://www.slideshare.net/KKARUNKARTHIK/hermit-curves-amp-beizer-curves
	static gen_cubic_bezier_curve(t_,
									control_pts_) {
		let subject_pts = control_pts_;
		let interpolated_pts = [];
		for (let i = 0; i < 3; ++ i) {
			interpolated_pts = [];
			for (let j = 0; j < subject_pts.length - 1; ++ j) {
				let curr_pt = subject_pts[j];
				let next_pt = subject_pts[j + 1];
				let interpolated = c_math.lerp(t_, curr_pt, next_pt);
				interpolated_pts.push(interpolated);
			}
			subject_pts = interpolated_pts;
		}
		let ret = interpolated_pts[0];
		return ret;
	}

	// paramateres should be normalized
	static is_opposite_direction(dir_a_, dir_b_) {
		let dp = c_math.dot_product(dir_a_, dir_b_);
		// when opposite(cos(180))
		if (c_math.is_zero(dp + 1.0) == true)
			return true;
		return false;
	}

	// https://math.stackexchange.com/a/476311
	// do not consider the case when two vecs point opposite dir
	static get_rotation_from_vec_to_vec(from_dir_,
										to_dir_) {
		let v = c_math.cross_product(from_dir_, to_dir_);
		let s = v.get_length();

		if (c_math.is_zero(s) == true)
			return c_mat3.identity();

		let c = c_math.dot_product(from_dir_, to_dir_);

		let rot_mat = c_mat3.identity();
		let skew_sym_cp_mat = c_mat3.gen(0, -v.m_z, v.m_y,
											v.m_z, 0, -v.m_x,
											-v.m_y, v.m_x, 0);
		let skew_sym_cp_sq_mat = skew_sym_cp_mat.get_mat3_multiplied(skew_sym_cp_mat);
		let merge_mat = c_mat3.get_num_multiplied(skew_sym_cp_sq_mat, 1.0 / (1.0 + c));
		rot_mat = rot_mat.get_mat3_added(skew_sym_cp_mat);
		rot_mat = rot_mat.get_mat3_added(merge_mat);
		return rot_mat;
	}
} 