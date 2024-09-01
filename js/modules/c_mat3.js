class c_mat3 {
	/* private */
	m_arr = new Float32Array(9);

	update_arr() {
		// http://learnwebgl.brown37.net/transformations2/matrix_library_introduction.html
		this.m_arr[0] = this.m_e00; this.m_arr[3] = this.m_e01; this.m_arr[6] = this.m_e02;
		this.m_arr[1] = this.m_e10; this.m_arr[4] = this.m_e11; this.m_arr[7] = this.m_e12;
		this.m_arr[2] = this.m_e20; this.m_arr[5] = this.m_e21; this.m_arr[8] = this.m_e22;
	}

	/* public */
	m_e00; m_e01; m_e02;
	m_e10; m_e11; m_e12;
	m_e20; m_e21; m_e22;

	constructor() {
		this.m_e00 = 0; this.m_e01 = 0; this.m_e02 = 0;
		this.m_e10 = 0; this.m_e11 = 0; this.m_e12 = 0;
		this.m_e20 = 0; this.m_e21 = 0; this.m_e22 = 0;
		this.update_arr();
	}

	static gen(e00_, e01_, e02_,
				e10_, e11_, e12_,
				e20_, e21_, e22_) {
		let ret = new c_mat3();
		ret.set(e00_, e01_, e02_,
				e10_, e11_, e12_,
				e20_, e21_, e22_);
		return ret;
	}
	
	set(e00_, e01_, e02_,
		e10_, e11_, e12_,
		e20_, e21_, e22_) {
		this.m_e00 = e00_; this.m_e01 = e01_; this.m_e02 = e02_;
		this.m_e10 = e10_; this.m_e11 = e11_; this.m_e12 = e12_;
		this.m_e20 = e20_; this.m_e21 = e21_; this.m_e22 = e22_;
		this.update_arr();
	}

	get_copied() {
		let ret = new c_mat3();
		ret.set(this.m_e00, this.m_e01, this.m_e02,
				this.m_e10, this.m_e11, this.m_e12,
				this.m_e20, this.m_e21, this.m_e22);
		return ret;
	}

	get_transposed() {
		let ret = this.get_copied();
		ret.m_e01 = this.m_e10;
		ret.m_e02 = this.m_e20;

		ret.m_e10 = this.m_e01;
		ret.m_e12 = this.m_e21;

		ret.m_e20 = this.m_e02;
		ret.m_e21 = this.m_e12;

		ret.update_arr();
		return ret;
	}

	static get_arr_idx(row_idx_, col_idx_) {
		return (col_idx_ * 3) + row_idx_;
	}

	static calc_det(mat3_) {
		let det = 0;
		for (let i = 0; i < 3; ++ i)
			det += (mat3_.m_arr[c_mat3.get_arr_idx(0, i)] * c_mat3.calc_cofactor(mat3_, 0, i));
		return det;
	}

	static is_invertible(det_) {
		if (c_math.is_zero(det_))
			return false;
		return true;
	}

	static calc_minor(mat3_, row_idx_, col_idx_) {
		if (row_idx_ === 0 && col_idx_ === 0)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e11, mat3_.m_e12,
													mat3_.m_e21, mat3_.m_e22));
		else if (row_idx_ === 0 && col_idx_ === 1)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e10, mat3_.m_e12,
													mat3_.m_e20, mat3_.m_e22));
		else if (row_idx_ === 0 && col_idx_ === 2)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e10, mat3_.m_e11,
													mat3_.m_e20, mat3_.m_e21));

		else if (row_idx_ === 1 && col_idx_ === 0)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e01, mat3_.m_e02,
													mat3_.m_e21, mat3_.m_e22));
		else if (row_idx_ === 1 && col_idx_ === 1)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e00, mat3_.m_e02,
													mat3_.m_e20, mat3_.m_e22));
		else if (row_idx_ === 1 && col_idx_ === 2)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e00, mat3_.m_e01,
													mat3_.m_e20, mat3_.m_e21));

		else if (row_idx_ === 2 && col_idx_ === 0)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e01, mat3_.m_e02,
													mat3_.m_e11, mat3_.m_e12));
		else if (row_idx_ === 2 && col_idx_ === 1)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e00, mat3_.m_e02,
													mat3_.m_e10, mat3_.m_e12));
		else if (row_idx_ === 2 && col_idx_ === 2)
			return c_mat2.calc_det(c_mat2.gen(mat3_.m_e00, mat3_.m_e01,
													mat3_.m_e10, mat3_.m_e11));
	}

	static calc_cofactor(mat3_, row_idx_, col_idx_) {
		let minor_val = c_mat3.calc_minor(mat3_, row_idx_, col_idx_);
		if ((row_idx_ + col_idx_) % 2 === 0)
			return minor_val;
		else
			return -minor_val;
	}

	get_adj() {
		let ret = new c_mat3();
		ret.set(c_mat3.calc_cofactor(this, 0, 0), c_mat3.calc_cofactor(this, 0, 1), c_mat3.calc_cofactor(this, 0, 2),
				c_mat3.calc_cofactor(this, 1, 0), c_mat3.calc_cofactor(this, 1, 1), c_mat3.calc_cofactor(this, 1, 2),
				c_mat3.calc_cofactor(this, 2, 0), c_mat3.calc_cofactor(this, 2, 1), c_mat3.calc_cofactor(this, 2, 2));
		return ret.get_transposed();
	}

	get_inversed() {
		let det = c_mat3.calc_det(this);
		if (c_mat3.is_invertible(det) === false)
			return;
		let adj_mat = this.get_adj();
		let inv_det = 1.0 / det;
		let inversed = c_mat3.get_num_multiplied(adj_mat, inv_det);
		return inversed;
	}

	print() {
		let str = 'mat3\n';
		str += 'e00: ' + this.m_e00; str += ', e01: ' + this.m_e01; str += ', e02: ' + this.m_e02; str += '\n';
		str += 'e10: ' + this.m_e10; str += ', e11: ' + this.m_e11; str += ', e12: ' + this.m_e12; str += '\n';
		str += 'e20: ' + this.m_e20; str += ', e21: ' + this.m_e21; str += ', e22: ' + this.m_e22; str += '\n';
		console.log(str);
	}	
	
	static identity() {
		let ret = new c_mat3();
		ret.set(1, 0, 0,
				0, 1, 0,
				0, 0, 1);
		return ret;
	}

	static get_rotated_x(rot_in_rad_) {
		let ret = c_mat3.identity();
		ret.m_e11 = Math.cos(rot_in_rad_); ret.m_e12 = -Math.sin(rot_in_rad_);
		ret.m_e21 = Math.sin(rot_in_rad_); ret.m_e22 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated_y(rot_in_rad_) {
		let ret = c_mat3.identity();
		ret.m_e00 = Math.cos(rot_in_rad_); ret.m_e02 = Math.sin(rot_in_rad_);
		ret.m_e20 = -Math.sin(rot_in_rad_); ret.m_e22 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated_z(rot_in_rad_) {
		let ret = c_mat3.identity();
		ret.m_e00 = Math.cos(rot_in_rad_); ret.m_e01 = -Math.sin(rot_in_rad_);
		ret.m_e10 = Math.sin(rot_in_rad_); ret.m_e11 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated(rot_x_, rot_y_, rot_z_) {
		let rot_mat_x = c_mat3.get_rotated_x(rot_x_);
		let rot_mat_y = c_mat3.get_rotated_y(rot_y_);
		let rot_mat_z = c_mat3.get_rotated_z(rot_z_);

		// ret = rot_mat_z * rot_mat_y * rot_mat_x
		let ret = rot_mat_y.get_mat3_multiplied(rot_mat_x);
		ret = rot_mat_z.get_mat3_multiplied(ret);
		return ret;
	}

	static get_num_multiplied(mat3_, num_) {
		let ret = new c_mat3();
		ret.m_e00 = mat3_.m_e00 * num_;
		ret.m_e01 = mat3_.m_e01 * num_;
		ret.m_e02 = mat3_.m_e02 * num_;
		ret.m_e10 = mat3_.m_e10 * num_;
		ret.m_e11 = mat3_.m_e11 * num_;
		ret.m_e12 = mat3_.m_e12 * num_;
		ret.m_e20 = mat3_.m_e20 * num_;
		ret.m_e21 = mat3_.m_e21 * num_;
		ret.m_e22 = mat3_.m_e22 * num_;
		ret.update_arr();
		return ret;	
	}

	get_mat3_added(rhs_) {
		let ret = new c_mat3();
		ret.m_e00 = this.m_e00 + rhs_.m_e00;
		ret.m_e01 = this.m_e01 + rhs_.m_e01;
		ret.m_e02 = this.m_e02 + rhs_.m_e02;
		ret.m_e10 = this.m_e10 + rhs_.m_e10;
		ret.m_e11 = this.m_e11 + rhs_.m_e11;
		ret.m_e12 = this.m_e12 + rhs_.m_e12;
		ret.m_e20 = this.m_e20 + rhs_.m_e20;
		ret.m_e21 = this.m_e21 + rhs_.m_e21;
		ret.m_e22 = this.m_e22 + rhs_.m_e22;
		ret.update_arr();
		return ret;
	}

	get_vec3_multiplied(rhs_) {
		let ret = new c_vec3();
		ret.m_x = (this.m_e00 * rhs_.m_x)
			+ (this.m_e01 * rhs_.m_y)
			+ (this.m_e02 * rhs_.m_z);
		ret.m_y = (this.m_e10 * rhs_.m_x)
			+ (this.m_e11 * rhs_.m_y)
			+ (this.m_e12 * rhs_.m_z);
		ret.m_z = (this.m_e20 * rhs_.m_x)
			+ (this.m_e21 * rhs_.m_y)
			+ (this.m_e22 * rhs_.m_z);
		ret.update_arr();
		return ret;
	}

	get_mat3_multiplied(rhs_) {
		let ret = new c_mat3();
		ret.m_e00 = (this.m_e00 * rhs_.m_e00)
			+ (this.m_e01 * rhs_.m_e10)
			+ (this.m_e02 * rhs_.m_e20);
		ret.m_e01 = (this.m_e00 * rhs_.m_e01)
			+ (this.m_e01 * rhs_.m_e11)
			+ (this.m_e02 * rhs_.m_e21);
		ret.m_e02 = (this.m_e00 * rhs_.m_e02)
			+ (this.m_e01 * rhs_.m_e12)
			+ (this.m_e02 * rhs_.m_e22);

		ret.m_e10 = (this.m_e10 * rhs_.m_e00)
			+ (this.m_e11 * rhs_.m_e10)
			+ (this.m_e12 * rhs_.m_e20);
		ret.m_e11 = (this.m_e10 * rhs_.m_e01)
			+ (this.m_e11 * rhs_.m_e11)
			+ (this.m_e12 * rhs_.m_e21);
		ret.m_e12 = (this.m_e10 * rhs_.m_e02)
			+ (this.m_e11 * rhs_.m_e12)
			+ (this.m_e12 * rhs_.m_e22);

		ret.m_e20 = (this.m_e20 * rhs_.m_e00)
			+ (this.m_e21 * rhs_.m_e10)
			+ (this.m_e22 * rhs_.m_e20);
		ret.m_e21 = (this.m_e20 * rhs_.m_e01)
			+ (this.m_e21 * rhs_.m_e11)
			+ (this.m_e22 * rhs_.m_e21);
		ret.m_e22 = (this.m_e20 * rhs_.m_e02)
			+ (this.m_e21 * rhs_.m_e12)
			+ (this.m_e22 * rhs_.m_e22);

		ret.update_arr();
		return ret;
	}
}
