class c_uniform_buffer_config{
	m_ub_idx;
	m_ub_block_data_size;
	m_ub_indices;
	m_ub_types;
	m_ub_offsets;
	m_ub_arr_strides;
	m_ub_sizes;

	init(program_,
			ub_name_,
			ub_uniform_names_) {
		this.m_ub_idx = gl.getUniformBlockIndex(program_, ub_name_);
		this.m_ub_block_data_size = gl.getActiveUniformBlockParameter(program_,
																		this.m_ub_idx,
																		gl.UNIFORM_BLOCK_DATA_SIZE);
		this.m_ub_indices = gl.getUniformIndices(program_, ub_uniform_names_);
		this.m_ub_types = gl.getActiveUniforms(program_,
												this.m_ub_indices,
												gl.UNIFORM_TYPE);
		this.m_ub_offsets = gl.getActiveUniforms(program_,
													this.m_ub_indices,
													gl.UNIFORM_OFFSET);
		this.m_ub_arr_strides = gl.getActiveUniforms(program_,
														this.m_ub_indices,
														gl.UNIFORM_ARRAY_STRIDE);
		this.m_ub_sizes = gl.getActiveUniforms(program_,
												this.m_ub_indices,
												gl.UNIFORM_SIZE);
	}
}
