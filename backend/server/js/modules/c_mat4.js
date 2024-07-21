class c_mat4 {
	/* private */
	m_arr = new Float32Array(16);

	update_arr() {
		// http://learnwebgl.brown37.net/transformations2/matrix_library_introduction.html
		this.m_arr[0] = this.m_e00; this.m_arr[4] = this.m_e01; this.m_arr[8] = this.m_e02; this.m_arr[12] = this.m_e03;
		this.m_arr[1] = this.m_e10; this.m_arr[5] = this.m_e11; this.m_arr[9] = this.m_e12; this.m_arr[13] = this.m_e13;
		this.m_arr[2] = this.m_e20; this.m_arr[6] = this.m_e21; this.m_arr[10] = this.m_e22; this.m_arr[14] = this.m_e23;
		this.m_arr[3] = this.m_e30; this.m_arr[7] = this.m_e31; this.m_arr[11] = this.m_e32; this.m_arr[15] = this.m_e33;
	}

	/* public */
	m_e00; m_e01; m_e02; m_e03;
	m_e10; m_e11; m_e12; m_e13;
	m_e20; m_e21; m_e22; m_e23;
	m_e30; m_e31; m_e32; m_e33;

	constructor() {
		this.m_e00 = 0; this.m_e01 = 0; this.m_e02 = 0; this.m_e03 = 0;
		this.m_e10 = 0; this.m_e11 = 0; this.m_e12 = 0; this.m_e13 = 0;
		this.m_e20 = 0; this.m_e21 = 0; this.m_e22 = 0; this.m_e23 = 0;
		this.m_e30 = 0; this.m_e31 = 0; this.m_e32 = 0; this.m_e33 = 0;
		this.update_arr();
	}
	
	set(e00_, e01_, e02_, e03_,
		e10_, e11_, e12_, e13_,
		e20_, e21_, e22_, e23_,
		e30_, e31_, e32_, e33_) {
		this.m_e00 = e00_; this.m_e01 = e01_; this.m_e02 = e02_; this.m_e03 = e03_;
		this.m_e10 = e10_; this.m_e11 = e11_; this.m_e12 = e12_; this.m_e13 = e13_;
		this.m_e20 = e20_; this.m_e21 = e21_; this.m_e22 = e22_; this.m_e23 = e23_;
		this.m_e30 = e30_; this.m_e31 = e31_; this.m_e32 = e32_; this.m_e33 = e33_;
		this.update_arr();
	}

	get_copied() {
		let ret = new c_mat4();
		ret.set(this.m_e00, this.m_e01, this.m_e02, this.m_e03,
				this.m_e10, this.m_e11, this.m_e12, this.m_e13,
				this.m_e20, this.m_e21, this.m_e22, this.m_e23,
				this.m_e30, this.m_e31, this.m_e32, this.m_e33);
		return ret;
	}

	get_transposed() {
		let ret = this.get_copied();
		ret.m_e01 = this.m_e10;
		ret.m_e02 = this.m_e20;
		ret.m_e03 = this.m_e30;
		
		ret.m_e10 = this.m_e01;
		ret.m_e12 = this.m_e21;
		ret.m_e13 = this.m_e31;

		ret.m_e20 = this.m_e02;
		ret.m_e21 = this.m_e12;
		ret.m_e23 = this.m_e32;

		ret.m_e30 = this.m_e03;
		ret.m_e31 = this.m_e13;
		ret.m_e32 = this.m_e23;

		ret.update_arr();
		return ret;
	}

	static get_arr_idx(row_idx_, col_idx_) {
		return (col_idx_ * 4) + row_idx_;
	}

	static calc_det(mat4_) {
		let det = 0;
		for (let i = 0; i < 4; ++ i)
			det += (mat4_.m_arr[c_mat4.get_arr_idx(0, i)] * c_mat4.calc_cofactor(mat4_, 0, i));
		return det;
	}

	static is_invertible(det_) {
		if (c_math.is_zero(det_))
			return false;
		return true;
	}

	static calc_minor(mat4_, row_idx_, col_idx_) {
		if (row_idx_ === 0 && col_idx_ === 0)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e11, mat4_.m_e12, mat4_.m_e13,
													mat4_.m_e21, mat4_.m_e22, mat4_.m_e23,
													mat4_.m_e31, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 0 && col_idx_ === 1)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e10, mat4_.m_e12, mat4_.m_e13,
													mat4_.m_e20, mat4_.m_e22, mat4_.m_e23,
													mat4_.m_e30, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 0 && col_idx_ === 2)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e10, mat4_.m_e11, mat4_.m_e13,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e23,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e33));
		else if (row_idx_ === 0 && col_idx_ === 3)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e10, mat4_.m_e11, mat4_.m_e12,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e22,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e32));

		else if (row_idx_ === 1 && col_idx_ === 0)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e01, mat4_.m_e02, mat4_.m_e03,
													mat4_.m_e21, mat4_.m_e22, mat4_.m_e23,
													mat4_.m_e31, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 1 && col_idx_ === 1)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e02, mat4_.m_e03,
													mat4_.m_e20, mat4_.m_e22, mat4_.m_e23,
													mat4_.m_e30, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 1 && col_idx_ === 2)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e03,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e23,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e33));
		else if (row_idx_ === 1 && col_idx_ === 3)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e02,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e22,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e32));
										
		else if (row_idx_ === 2 && col_idx_ === 0)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e01, mat4_.m_e02, mat4_.m_e03,
													mat4_.m_e11, mat4_.m_e12, mat4_.m_e13,
													mat4_.m_e31, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 2 && col_idx_ === 1)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e02, mat4_.m_e03,
													mat4_.m_e10, mat4_.m_e12, mat4_.m_e13,
													mat4_.m_e30, mat4_.m_e32, mat4_.m_e33));
		else if (row_idx_ === 2 && col_idx_ === 2)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e03,
													mat4_.m_e10, mat4_.m_e11, mat4_.m_e13,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e33));
		else if (row_idx_ === 2 && col_idx_ === 3)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e02,
													mat4_.m_e10, mat4_.m_e11, mat4_.m_e12,
													mat4_.m_e30, mat4_.m_e31, mat4_.m_e32));

		else if (row_idx_ === 3 && col_idx_ === 0)
		return c_mat3.calc_det(c_mat3.gen(mat4_.m_e01, mat4_.m_e02, mat4_.m_e03,
												mat4_.m_e11, mat4_.m_e12, mat4_.m_e13,
												mat4_.m_e21, mat4_.m_e22, mat4_.m_e23));
		else if (row_idx_ === 3 && col_idx_ === 1)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e03,
													mat4_.m_e10, mat4_.m_e11, mat4_.m_e13,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e23));
		else if (row_idx_ === 3 && col_idx_ === 2)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e03,
													mat4_.m_e10, mat4_.m_e11, mat4_.m_e13,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e23));
		else if (row_idx_ === 3 && col_idx_ === 3)
			return c_mat3.calc_det(c_mat3.gen(mat4_.m_e00, mat4_.m_e01, mat4_.m_e02,
													mat4_.m_e10, mat4_.m_e11, mat4_.m_e12,
													mat4_.m_e20, mat4_.m_e21, mat4_.m_e22));
	}

	static calc_cofactor(mat4_, row_idx_, col_idx_) {
		let minor_val = c_mat4.calc_minor(mat4_, row_idx_, col_idx_);
		if ((row_idx_ + col_idx_) % 2 === 0)
			return minor_val;
		else
			return -minor_val;
	}

	get_adj() {
		let ret = new c_mat4();
		ret.set(c_mat4.calc_cofactor(this, 0, 0), c_mat4.calc_cofactor(this, 0, 1), c_mat4.calc_cofactor(this, 0, 2), c_mat4.calc_cofactor(this, 0, 3),
				c_mat4.calc_cofactor(this, 1, 0), c_mat4.calc_cofactor(this, 1, 1), c_mat4.calc_cofactor(this, 1, 2), c_mat4.calc_cofactor(this, 1, 3),
				c_mat4.calc_cofactor(this, 2, 0), c_mat4.calc_cofactor(this, 2, 1), c_mat4.calc_cofactor(this, 2, 2), c_mat4.calc_cofactor(this, 2, 3),
				c_mat4.calc_cofactor(this, 3, 0), c_mat4.calc_cofactor(this, 3, 1), c_mat4.calc_cofactor(this, 3, 2), c_mat4.calc_cofactor(this, 3, 3));
		return ret.get_transposed();
	}

	get_inversed() {
		let det = c_mat4.calc_det(this);
		if (c_mat4.is_invertible(det) === false)
			return;
		let adj_mat = this.get_adj();
		let inv_det = 1.0 / det;
		let inversed = c_mat4.get_num_multiplied(adj_mat, inv_det);
		return inversed;
	}

	print() {
		let str = 'mat4\n';
		str += 'e00: ' + this.m_e00; str += ', e01: ' + this.m_e01; str += ', e02: ' + this.m_e02; str += ', e03: ' + this.m_e03; str += '\n';
		str += 'e10: ' + this.m_e10; str += ', e11: ' + this.m_e11; str += ', e12: ' + this.m_e12; str += ', e13: ' + this.m_e13; str += '\n';
		str += 'e20: ' + this.m_e20; str += ', e21: ' + this.m_e21; str += ', e22: ' + this.m_e22; str += ', e23: ' + this.m_e23; str += '\n';
		str += 'e30: ' + this.m_e30; str += ', e31: ' + this.m_e31; str += ', e32: ' + this.m_e32; str += ', e33: ' + this.m_e33; str += '\n';
		console.log(str);
	}	
	
	static identity() {
		let ret = new c_mat4();
		ret.set(1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1);
		return ret;
	}

	static get_num_multiplied(mat4_, num_) {
		let ret = new c_mat4();
		ret.m_e00 = mat4_.m_e00 * num_;
		ret.m_e01 = mat4_.m_e01 * num_;
		ret.m_e02 = mat4_.m_e02 * num_;
		ret.m_e03 = mat4_.m_e03 * num_;
		ret.m_e10 = mat4_.m_e10 * num_;
		ret.m_e11 = mat4_.m_e11 * num_;
		ret.m_e12 = mat4_.m_e12 * num_;
		ret.m_e13 = mat4_.m_e13 * num_;
		ret.m_e20 = mat4_.m_e20 * num_;
		ret.m_e21 = mat4_.m_e21 * num_;
		ret.m_e22 = mat4_.m_e22 * num_;
		ret.m_e23 = mat4_.m_e23 * num_;
		ret.m_e30 = mat4_.m_e30 * num_;
		ret.m_e31 = mat4_.m_e31 * num_;
		ret.m_e32 = mat4_.m_e32 * num_;
		ret.m_e33 = mat4_.m_e33 * num_;
		ret.update_arr();
		return ret;	
	}

	static get_translated(amount_vec3_) {
		let ret = c_mat4.identity();
		ret.m_e03 = amount_vec3_.m_x;
		ret.m_e13 = amount_vec3_.m_y;
		ret.m_e23 = amount_vec3_.m_z;

		return ret;
	}

	static get_scaled(amount_vec3_) {
		let ret = c_mat4.identity();
		ret.m_e00 = amount_vec3_.m_x;
		ret.m_e11 = amount_vec3_.m_y;
		ret.m_e22 = amount_vec3_.m_z;
		return ret;
	}

	static get_rotated_x(rot_in_rad_) {
		let ret = c_mat4.identity();
		ret.m_e11 = Math.cos(rot_in_rad_); ret.m_e12 = -Math.sin(rot_in_rad_);
		ret.m_e21 = Math.sin(rot_in_rad_); ret.m_e22 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated_y(rot_in_rad_) {
		let ret = c_mat4.identity();
		ret.m_e00 = Math.cos(rot_in_rad_); ret.m_e02 = Math.sin(rot_in_rad_);
		ret.m_e20 = -Math.sin(rot_in_rad_); ret.m_e22 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated_z(rot_in_rad_) {
		let ret = c_mat4.identity();
		ret.m_e00 = Math.cos(rot_in_rad_); ret.m_e01 = -Math.sin(rot_in_rad_);
		ret.m_e10 = Math.sin(rot_in_rad_); ret.m_e11 = Math.cos(rot_in_rad_);
		return ret;
	}

	static get_rotated(rot_x_, rot_y_, rot_z_) {
		let rot_mat_x = c_mat4.get_rotated_x(rot_x_);
		let rot_mat_y = c_mat4.get_rotated_y(rot_y_);
		let rot_mat_z = c_mat4.get_rotated_z(rot_z_);

		// ret = rot_mat_z * rot_mat_y * rot_mat_x
		let ret = rot_mat_y.get_mat4_multiplied(rot_mat_x);
		ret = rot_mat_z.get_mat4_multiplied(ret);
		return ret;
	}

	get_mat4_added(rhs_) {
		let ret = new c_mat4();
		ret.m_e00 = this.m_e00 + rhs_.m_e00;
		ret.m_e01 = this.m_e01 + rhs_.m_e01;
		ret.m_e02 = this.m_e02 + rhs_.m_e02;
		ret.m_e03 = this.m_e03 + rhs_.m_e03;
		ret.m_e10 = this.m_e10 + rhs_.m_e10;
		ret.m_e11 = this.m_e11 + rhs_.m_e11;
		ret.m_e12 = this.m_e12 + rhs_.m_e12;
		ret.m_e13 = this.m_e13 + rhs_.m_e13;
		ret.m_e20 = this.m_e20 + rhs_.m_e20;
		ret.m_e21 = this.m_e21 + rhs_.m_e21;
		ret.m_e22 = this.m_e22 + rhs_.m_e22;
		ret.m_e23 = this.m_e23 + rhs_.m_e23;
		ret.m_e30 = this.m_e30 + rhs_.m_e30;
		ret.m_e31 = this.m_e31 + rhs_.m_e31;
		ret.m_e32 = this.m_e32 + rhs_.m_e32;
		ret.m_e33 = this.m_e33 + rhs_.m_e33;
		ret.update_arr();
		return ret;
	}

	get_vec4_multiplied(rhs_, w_) {
		let ret = new c_vec3();
		ret.m_x = (this.m_e00 * rhs_.m_x)
			+ (this.m_e01 * rhs_.m_y)
			+ (this.m_e02 * rhs_.m_z)
			+ (this.m_e03 * w_);
		ret.m_y = (this.m_e10 * rhs_.m_x)
			+ (this.m_e11 * rhs_.m_y)
			+ (this.m_e12 * rhs_.m_z)
			+ (this.m_e13 * w_);
		ret.m_z = (this.m_e20 * rhs_.m_x)
			+ (this.m_e21 * rhs_.m_y)
			+ (this.m_e22 * rhs_.m_z)
			+ (this.m_e23 * w_);
		ret.update_arr();
		return ret;
	}	

	get_mat4_multiplied(rhs_) {
		let ret = new c_mat4();
		ret.m_e00 = (this.m_e00 * rhs_.m_e00)
			+ (this.m_e01 * rhs_.m_e10)
			+ (this.m_e02 * rhs_.m_e20)
			+ (this.m_e03 * rhs_.m_e30);
		ret.m_e01 = (this.m_e00 * rhs_.m_e01)
			+ (this.m_e01 * rhs_.m_e11)
			+ (this.m_e02 * rhs_.m_e21)
			+ (this.m_e03 * rhs_.m_e31);
		ret.m_e02 = (this.m_e00 * rhs_.m_e02)
			+ (this.m_e01 * rhs_.m_e12)
			+ (this.m_e02 * rhs_.m_e22)
			+ (this.m_e03 * rhs_.m_e32);
		ret.m_e03 = (this.m_e00 * rhs_.m_e03)
			+ (this.m_e01 * rhs_.m_e13)
			+ (this.m_e02 * rhs_.m_e23)
			+ (this.m_e03 * rhs_.m_e33);		

		ret.m_e10 = (this.m_e10 * rhs_.m_e00)
			+ (this.m_e11 * rhs_.m_e10)
			+ (this.m_e12 * rhs_.m_e20)
			+ (this.m_e13 * rhs_.m_e30);
		ret.m_e11 = (this.m_e10 * rhs_.m_e01)
			+ (this.m_e11 * rhs_.m_e11)
			+ (this.m_e12 * rhs_.m_e21)
			+ (this.m_e13 * rhs_.m_e31);
		ret.m_e12 = (this.m_e10 * rhs_.m_e02)
			+ (this.m_e11 * rhs_.m_e12)
			+ (this.m_e12 * rhs_.m_e22)
			+ (this.m_e13 * rhs_.m_e32);
		ret.m_e13 = (this.m_e10 * rhs_.m_e03)
			+ (this.m_e11 * rhs_.m_e13)
			+ (this.m_e12 * rhs_.m_e23)
			+ (this.m_e13 * rhs_.m_e33);

		ret.m_e20 = (this.m_e20 * rhs_.m_e00)
			+ (this.m_e21 * rhs_.m_e10)
			+ (this.m_e22 * rhs_.m_e20)
			+ (this.m_e23 * rhs_.m_e30);
		ret.m_e21 = (this.m_e20 * rhs_.m_e01)
			+ (this.m_e21 * rhs_.m_e11)
			+ (this.m_e22 * rhs_.m_e21)
			+ (this.m_e23 * rhs_.m_e31);
		ret.m_e22 = (this.m_e20 * rhs_.m_e02)
			+ (this.m_e21 * rhs_.m_e12)
			+ (this.m_e22 * rhs_.m_e22)
			+ (this.m_e23 * rhs_.m_e32);
		ret.m_e23 = (this.m_e20 * rhs_.m_e03)
			+ (this.m_e21 * rhs_.m_e13)
			+ (this.m_e22 * rhs_.m_e23)
			+ (this.m_e23 * rhs_.m_e33);

		ret.m_e30 = (this.m_e30 * rhs_.m_e00)
			+ (this.m_e31 * rhs_.m_e10)
			+ (this.m_e32 * rhs_.m_e20)
			+ (this.m_e33 * rhs_.m_e30);
		ret.m_e31 = (this.m_e30 * rhs_.m_e01)
			+ (this.m_e31 * rhs_.m_e11)
			+ (this.m_e32 * rhs_.m_e21)
			+ (this.m_e33 * rhs_.m_e31);
		ret.m_e32 = (this.m_e30 * rhs_.m_e02)
			+ (this.m_e31 * rhs_.m_e12)
			+ (this.m_e32 * rhs_.m_e22)
			+ (this.m_e33 * rhs_.m_e32);
		ret.m_e33 = (this.m_e30 * rhs_.m_e03)
			+ (this.m_e31 * rhs_.m_e13)
			+ (this.m_e32 * rhs_.m_e23)
			+ (this.m_e33 * rhs_.m_e33);		

		ret.update_arr();
		return ret;
	}
}
