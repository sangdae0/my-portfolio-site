class c_vec3 {
	/* private */
	m_arr = new Float32Array(3);

	update_arr() {
		this.m_arr[0] = this.m_x;
		this.m_arr[1] = this.m_y;
		this.m_arr[2] = this.m_z;
	}

	/* public */
	m_x;
	m_y;
	m_z;
	
	/** 
	 * Vector with zero
	 * @constructor
	 */
	constructor() {
		this.m_x = 0;
		this.m_y = 0;
		this.m_z = 0;
		this.update_arr();
	}

	set(x_, y_, z_) {
		this.m_x = x_;
		this.m_y = y_;
		this.m_z = z_;
		this.update_arr();		
	}

	/** 
	 * Vector with elem
	 * @constructor
	 * @param {!number} x_
	 * @param {!number} y_
	 * @param {!number} z_
	 */
	static gen(x_, y_, z_) {
		let ret = new c_vec3();
		ret.set(x_, y_, z_);
		return ret;
	}

	static gen_front_dir() {
		let ret = c_vec3.gen(0.0, 0.0, 1.0);
		return ret;
	}

	static gen_side_dir() {
		let ret = c_vec3.gen(1.0, 0.0, 0.0);
		return ret;
	}

	static gen_up_dir() {
		let ret = c_vec3.gen(0.0, 1.0, 0.0);
		return ret;
	}

	print() {
		let str = 'vec3\n';
		str += 'x: ' + this.m_x;
		str += ', y: ' + this.m_y;
		str += ', z: ' + this.m_z;
		str += '\n';
		console.log(str);
	}	
	
	static zero() {
		let ret = new c_vec3();
		ret.set(0, 0, 0);
		return ret;
	}

	get_copied() {
		let ret = c_vec3.zero();
		ret.set(this.m_x, this.m_y, this.m_z);
		return ret;
	}

	/** 
	 * Add
	 * @param {!object} rhs_
	 */
	get_vec3_added(rhs_) {
		let ret = c_vec3.zero();
		ret.m_x = this.m_x + rhs_.m_x;
		ret.m_y = this.m_y + rhs_.m_y;
		ret.m_z = this.m_z + rhs_.m_z;
		ret.update_arr();
		return ret;
	}

	get_vec3_subtracted(rhs_) {
		let ret = c_vec3.zero();
		ret.m_x = this.m_x - rhs_.m_x;
		ret.m_y = this.m_y - rhs_.m_y;
		ret.m_z = this.m_z - rhs_.m_z;
		ret.update_arr();
		return ret;	
	}

	get_num_multiplied(rhs_) {
		let ret = c_vec3.zero();
		ret.m_x = this.m_x * rhs_;
		ret.m_y = this.m_y * rhs_;
		ret.m_z = this.m_z * rhs_;
		ret.update_arr();
		return ret;	
	}	

	get_length() {
		return Math.sqrt((this.m_x * this.m_x)
						+ (this.m_y * this.m_y)
						+ (this.m_z * this.m_z));
	}

	get_normalized() {
		let ret = c_vec3.zero();
		let length = this.get_length();
		if (length < Number.EPSILON)
			return this;
		ret.m_x = this.m_x / length;
		ret.m_y = this.m_y / length;
		ret.m_z = this.m_z / length;
		ret.update_arr();
		return ret;
	}

	get_mat4_multiplied(lhs_) {
		let ret = new c_vec3();
		ret.m_x = (lhs_.m_e00 * this.m_x)
			+ (lhs_.m_e01 * this.m_y)
			+ (lhs_.m_e02 * this.m_z)
			+ (lhs_.m_e03 * 1.0);
		ret.m_y = (lhs_.m_e10 * this.m_x)
			+ (lhs_.m_e11 * this.m_y)
			+ (lhs_.m_e12 * this.m_z)
			+ (lhs_.m_e13 * 1.0);
		ret.m_z = (lhs_.m_e20 * this.m_x)
			+ (lhs_.m_e21 * this.m_y)
			+ (lhs_.m_e22 * this.m_z)
			+ (lhs_.m_e23 * 1.0);
		ret.update_arr();
		return ret;
	}	
}
