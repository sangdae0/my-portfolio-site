class c_mat2 {
	/* private */
	m_arr = new Float32Array(4);

	update_arr() {
		// http://learnwebgl.brown37.net/transformations2/matrix_library_introduction.html
		this.m_arr[0] = this.m_e00; this.m_arr[2] = this.m_e01;
		this.m_arr[1] = this.m_e10; this.m_arr[3] = this.m_e11;
	}

	/* public */
	m_e00; m_e01;
	m_e10; m_e11;

	constructor() {
		this.m_e00 = 0; this.m_e01 = 0;
		this.m_e10 = 0; this.m_e11 = 0;
		this.update_arr();
	}
	
	set(e00_, e01_,
		e10_, e11_) {
		this.m_e00 = e00_; this.m_e01 = e01_;
		this.m_e10 = e10_; this.m_e11 = e11_;
		this.update_arr();
	}

	static gen(e00_, e01_,
				e10_, e11_) {
		let ret = new c_mat2();
		ret.set(e00_, e01_,
				e10_, e11_);
		return ret;
	}

	get_copied() {
		let ret = new c_mat2();
		ret.set(this.m_e00, this.m_e01,
				this.m_e10, this.m_e11);
		return ret;
	}

	get_transposed() {
		let ret = this.get_copied();
		ret.m_e01 = this.m_e10;
		ret.m_e10 = this.m_e01;
		ret.update_arr();
		return ret;
	}

	static get_arr_idx(row_idx_, col_idx_) {
		return (col_idx_ * 2) + row_idx_;
	}

	static calc_det(mat2_) {
		let det = 0;
		for (let i = 0; i < 2; ++ i)
			det += (mat2_.m_arr[c_mat2.get_arr_idx(0, i)] * c_mat2.calc_cofactor(mat2_, 0, i));
		return det;
	}

	static is_invertible(det_) {
		if (c_math.is_zero(det_))
			return false;
		return true;
	}

	static calc_minor(mat2_, row_idx_, col_idx_) {
		if (row_idx_ === 0 && col_idx_ === 0)
			return mat2_.m_e11;
		else if (row_idx_ === 0 && col_idx_ === 1)
			return mat2_.m_e10;
		else if (row_idx_ === 1 && col_idx_ === 0)
			return mat2_.m_e01;
		else if (row_idx_ === 1 && col_idx_ === 1)
			return mat2_.m_e00;
	}

	static calc_cofactor(mat2_, row_idx_, col_idx_) {
		let minor_val = c_mat2.calc_minor(mat2_, row_idx_, col_idx_);
		if ((row_idx_ + col_idx_) % 2 === 0)
			return minor_val;
		else
			return -minor_val;
	}

	get_adj() {
		let ret = new c_mat2();
		ret.set(c_mat2.calc_cofactor(this, 0, 0), c_mat2.calc_cofactor(this, 0, 1),
				c_mat2.calc_cofactor(this, 1, 0), c_mat2.calc_cofactor(this, 1, 1));
		return ret.get_transposed();
	}

	get_inversed() {
		let det = c_mat2.calc_det(this);
		if (c_mat2.is_invertible(det) === false)
			return;
		let adj_mat = this.get_adj();
		let inv_det = 1.0 / det;
		let inversed = c_mat2.get_num_multiplied(adj_mat, inv_det);
		return inversed;
	}

	print() {
		let str = 'mat2\n';
		str += 'e00: ' + this.m_e00; str += ', e01: ' + this.m_e01; str += '\n';
		str += 'e10: ' + this.m_e10; str += ', e11: ' + this.m_e11; str += '\n';
		console.log(str);
	}	
	
	static identity() {
		let ret = new c_mat2();
		ret.set(1, 0,
				0, 1);
		return ret;
	}

	static get_scaled(amount_vec3_) {
		let ret = c_mat4.identity();
		ret.m_e00 = amount_vec3_.m_x;
		ret.m_e11 = amount_vec3_.m_y;
		ret.m_e22 = amount_vec3_.m_z;
		return ret;
	}

	static get_num_multiplied(mat2_, num_) {
		let ret = new c_mat2();
		ret.m_e00 = mat2_.m_e00 * num_;
		ret.m_e01 = mat2_.m_e01 * num_;
		ret.m_e10 = mat2_.m_e10 * num_;
		ret.m_e11 = mat2_.m_e11 * num_;
		ret.update_arr();
		return ret;	
	}

	get_mat2_added(rhs_) {
		let ret = new c_mat2();
		ret.m_e00 = this.m_e00 + rhs_.m_e00;
		ret.m_e01 = this.m_e01 + rhs_.m_e01;
		ret.m_e10 = this.m_e10 + rhs_.m_e10;
		ret.m_e11 = this.m_e11 + rhs_.m_e11;
		ret.update_arr();
		return ret;
	}

	get_vec2_multiplied(rhs_) {
		let ret = new c_vec2();
		ret.m_x = (this.m_e00 * rhs_.m_x)
			+ (this.m_e01 * rhs_.m_y);
		ret.m_y = (this.m_e10 * rhs_.m_x)
			+ (this.m_e11 * rhs_.m_y);
		ret.m_z = (this.m_e20 * rhs_.m_x)
			+ (this.m_e21 * rhs_.m_y);
		ret.update_arr();
		return ret;
	}

	get_mat2_multiplied(rhs_) {
		let ret = new c_mat2();
		ret.m_e00 = (this.m_e00 * rhs_.m_e00)
			+ (this.m_e01 * rhs_.m_e10);
		ret.m_e01 = (this.m_e00 * rhs_.m_e01)
			+ (this.m_e01 * rhs_.m_e11);

		ret.m_e10 = (this.m_e10 * rhs_.m_e00)
			+ (this.m_e11 * rhs_.m_e10);
		ret.m_e11 = (this.m_e10 * rhs_.m_e01)
			+ (this.m_e11 * rhs_.m_e11);

		ret.update_arr();
		return ret;
	}
}
