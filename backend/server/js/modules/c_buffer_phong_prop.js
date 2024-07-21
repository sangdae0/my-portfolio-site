class c_buffer_phong_prop {
	m_buffer;
	m_global_ambient_intensity_arr;
	m_fog_intensity_arr;
	m_current_lt_count_arr;
	m_z_near_arr;
	m_z_far_arr;

	init(config_) {
		// https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance2/buffers/uniform-buffers.html
		let block_size = config_.m_ub_block_data_size;
		this.m_buffer = new ArrayBuffer(block_size);
		let curr = 0;
		this.m_global_ambient_intensity_arr = new Float32Array(this.m_buffer,
																config_.m_ub_offsets[curr],
																Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_fog_intensity_arr = new Float32Array(this.m_buffer,
													config_.m_ub_offsets[curr],
													Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_current_lt_count_arr = new Int32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_z_near_arr = new Float32Array(this.m_buffer,
														config_.m_ub_offsets[curr],
														Math.floor((config_.m_ub_offsets[curr + 1] - config_.m_ub_offsets[curr]) / 4));
		++ curr;
		this.m_z_far_arr = new Float32Array(this.m_buffer,
											config_.m_ub_offsets[curr],
											Math.floor((block_size - config_.m_ub_offsets[curr]) / 4));
	}

	/* public */
	set_global_ambient_intensity(global_ambient_intensity_) {
		this.m_global_ambient_intensity_arr[0] = global_ambient_intensity_.m_x;
		this.m_global_ambient_intensity_arr[1] = global_ambient_intensity_.m_y;
		this.m_global_ambient_intensity_arr[2] = global_ambient_intensity_.m_z;
	}

	set_fog_intensity(fog_intensity_) {
		this.m_fog_intensity_arr[0] = fog_intensity_.m_x;
		this.m_fog_intensity_arr[1] = fog_intensity_.m_y;
		this.m_fog_intensity_arr[2] = fog_intensity_.m_z;
	}

	set_current_lt_count(lt_count_) {
		this.m_current_lt_count_arr[0] = lt_count_;
	}

	set_z_near_and_far(near_, far_) {
		if (near_ < far_) {
			this.m_z_near_arr[0] = near_;
			this.m_z_far_arr[0] = far_;
		}
	}
}