class c_vec2 {
	/* private */
	m_arr = new Float32Array(2);

	update_arr() {
		this.m_arr[0] = this.m_x;
		this.m_arr[1] = this.m_y;
	}

	/* public */
	m_x;
	m_y;
	
	/** 
	 * Vector with zero
	 * @constructor
	 */
	constructor() {
		this.m_x = 0;
		this.m_y = 0;
		this.update_arr();
	}

	set(x_, y_) {
		this.m_x = x_;
		this.m_y = y_;
		this.update_arr();		
	}

	/** 
	 * Vector with elem
	 * @constructor
	 * @param {!number} x_
	 * @param {!number} y_
	 */
	static gen(x_, y_) {
		let ret = new c_vec2();
		ret.set(x_, y_);
		return ret;
	}

	print() {
		let str = 'vec3\n';
		str += 'x: ' + this.m_x;
		str += ', y: ' + this.m_y;
		str += '\n';
		console.log(str);
	}	
	
	static zero() {
		let ret = new c_vec2();
		ret.set(0, 0, 0);
		return ret;
	}

	/** 
	 * Add
	 * @param {!object} rhs_
	 */
	get_vec3_added(rhs_) {
		let ret = c_vec2.zero();
		ret.m_x = this.m_x + rhs_.m_x;
		ret.m_y = this.m_y + rhs_.m_y;
		ret.update_arr();
		return ret;
	}

	get_vec3_subtracted(rhs_) {
		let ret = c_vec2.zero();
		ret.m_x = this.m_x - rhs_.m_x;
		ret.m_y = this.m_y - rhs_.m_y;
		ret.update_arr();
		return ret;
	}

	get_num_multiplied(rhs_) {
		let ret = c_vec2.zero();
		ret.m_x = this.m_x * rhs_;
		ret.m_y = this.m_y * rhs_;
		ret.update_arr();
		return ret;	
	}	

	get_length() {
		return Math.sqrt((this.m_x * this.m_x)
						+ (this.m_y * this.m_y));
	}

	get_normalized() {
		let ret = c_vec2.zero();
		let length = this.get_length();
		if (length < Number.EPSILON)
			return this;
		ret.m_x = this.m_x / length;
		ret.m_y = this.m_y / length;
		ret.update_arr();
		return ret;
	}
}
