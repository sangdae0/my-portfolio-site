class c_buffer_lights {
	m_buffer;
	
	m_lt_type_arr;
	m_pos_arr;
	m_dir_arr;
	m_spot_cos_inner_angle_arr;
	m_spot_cos_outer_angle_arr;
	m_spot_cutoff_arr;
	m_ambient_arr;
	m_diffuse_arr;
	m_specular_arr;
	m_constant_att_arr;
	m_linear_att_arr;
	m_quadratic_att_arr;

	init(config_) {
		// https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance2/buffers/uniform-buffers.html
		let block_size = config_.m_ub_block_data_size;
		this.m_buffer = new ArrayBuffer(block_size);
		let curr = 0;

		this.m_lt_type_arr = new Int32Array(this.m_buffer,
													config_.m_ub_offsets[curr],
													Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_pos_arr = new Float32Array(this.m_buffer,
												config_.m_ub_offsets[curr],
												Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_dir_arr = new Float32Array(this.m_buffer,
												config_.m_ub_offsets[curr],
												Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_spot_cos_inner_angle_arr = new Float32Array(this.m_buffer,
																config_.m_ub_offsets[curr],
																Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_spot_cos_outer_angle_arr = new Float32Array(this.m_buffer,
																config_.m_ub_offsets[curr],
																Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_spot_cutoff_arr = new Float32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_ambient_arr = new Float32Array(this.m_buffer,
													config_.m_ub_offsets[curr],
													Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_diffuse_arr = new Float32Array(this.m_buffer,
													config_.m_ub_offsets[curr],
													Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_specular_arr = new Float32Array(this.m_buffer,
													config_.m_ub_offsets[curr],
													Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_constant_att_arr = new Float32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_linear_att_arr = new Float32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_quadratic_att_arr = new Float32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((block_size - config_.m_ub_offsets[curr]) / 4));
													
		this.set_spot_cos_inner_and_outer(0, 1.0, 0.0);
		this.set_spot_cutoff(0, 0.0);
		this.set_lt_ambient(0, c_vec3.gen(0.0, 0.0, 0.0));
		this.set_lt_diffuse(0, c_vec3.gen(0.0, 0.0, 0.0));
		this.set_lt_specular(0, c_vec3.gen(0.0, 0.0, 0.0));
		this.set_constant_att(0, 0.0);
		this.set_linear_att(0, 0.0);
		this.set_quadratic_att(0, 0.0);
	}

	/* public */
	set_lt_type(light_idx_, type_) {
		this.m_lt_type_arr[light_idx_] = type_;
	}

	set_lt_pos(light_idx_, pos_) {
		this.m_pos_arr[3 * light_idx_] = pos_.m_x;
		this.m_pos_arr[3 * light_idx_ + 1] = pos_.m_y;
		this.m_pos_arr[3 * light_idx_ + 2] = pos_.m_z;
	}

	set_lt_dir(light_idx_, dir_) {
		this.m_dir_arr[3 * light_idx_] = dir_.m_x;
		this.m_dir_arr[3 * light_idx_ + 1] = dir_.m_y;
		this.m_dir_arr[3 * light_idx_ + 2] = dir_.m_z;
	}

	set_spot_cos_inner_and_outer(light_idx_, cos_inner_angle_, cos_outer_angle_) {
		if (cos_inner_angle_ > cos_outer_angle_
			&& cos_inner_angle_ >= 0.0
			&& cos_outer_angle_ >= 0.0) {
			this.m_spot_cos_inner_angle_arr[light_idx_] = cos_inner_angle_;
			this.m_spot_cos_outer_angle_arr[light_idx_] = cos_outer_angle_;
		}
	}

	set_spot_cutoff(light_idx_, cutoff_) {
		this.m_spot_cutoff_arr[light_idx_] = cutoff_;
	}

	set_lt_ambient(light_idx_, ambient_) {
		this.m_ambient_arr[3 * light_idx_] = ambient_.m_x;
		this.m_ambient_arr[3 * light_idx_ + 1] = ambient_.m_y;
		this.m_ambient_arr[3 * light_idx_ + 2] = ambient_.m_z;		
	}

	set_lt_diffuse(light_idx_, diffuse_) {
		this.m_diffuse_arr[3 * light_idx_] = diffuse_.m_x;
		this.m_diffuse_arr[3 * light_idx_ + 1] = diffuse_.m_y;
		this.m_diffuse_arr[3 * light_idx_ + 2] = diffuse_.m_z;		
	}

	set_lt_specular(light_idx_, specular_) {
		this.m_specular_arr[3 * light_idx_] = specular_.m_x;
		this.m_specular_arr[3 * light_idx_ + 1] = specular_.m_y;
		this.m_specular_arr[3 * light_idx_ + 2] = specular_.m_z;		
	}	

	set_constant_att(light_idx_, constant_att_) {
		this.m_constant_att_arr[light_idx_] = constant_att_;
	}

	set_linear_att(light_idx_, linear_att_) {
		this.m_linear_att_arr[light_idx_] = linear_att_;
	}

	set_quadratic_att(light_idx_, quadratic_att_) {
		this.m_quadratic_att_arr[light_idx_] = quadratic_att_;
	}
}