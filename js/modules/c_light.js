class c_light {
/* private */
/* public */
	m_lt_type;
	m_ambient;
	m_diffuse;
	m_specular;
}

class c_directional_light extends c_light { // https://javascript.info/class-inheritance
	/* private */
	/* public */
	m_lt_dir;

	static gen(light_direction_,
									ambient_,
									diffuse_,
									specular_) {
		let ret = new c_directional_light();
		ret.m_lt_type = 0;
		ret.m_lt_dir = light_direction_.get_copied();
		ret.m_ambient = ambient_.get_copied();
		ret.m_diffuse = diffuse_.get_copied();
		ret.m_specular = specular_.get_copied();
		return ret;
	}
}

class c_point_light extends c_light {
	/* private */
	/* public */
		m_lt_pos;
		m_constant_att;
		m_linear_att;
		m_quadratic_att;
	
		static gen(light_pos_,
									ambient_,
									diffuse_,
									specular_,
									constant_att_,
									linear_att_,
									quadratic_att_) {
			let ret = new c_point_light();
			ret.m_lt_type = 1;
			ret.m_lt_pos = light_pos_.get_copied();
			ret.m_ambient = ambient_.get_copied();
			ret.m_diffuse = diffuse_.get_copied();
			ret.m_specular = specular_.get_copied();
			ret.m_constant_att = constant_att_;
			ret.m_linear_att = linear_att_;
			ret.m_quadratic_att = quadratic_att_;
			return ret;
		}
}

class c_spot_light extends c_point_light {
	/* private */
	/* public */
		m_lt_dir;
		m_spot_inner_angle;
		m_spot_outer_angle;
		m_spot_cutoff;
	
		static gen(light_pos_,
								light_dir_,
								ambient_,
								diffuse_,
								specular_,
								constant_att_,
								linear_att_,
								quadratic_att_,
								spot_inner_angle_,
								spot_outer_angle_,
								spot_cutoff_) {
			let ret = new c_spot_light();
			ret.m_lt_type = 2;
			ret.m_lt_pos = light_pos_.get_copied();
			ret.m_lt_dir = light_dir_.get_copied();
			ret.m_ambient = ambient_.get_copied();
			ret.m_diffuse = diffuse_.get_copied();
			ret.m_specular = specular_.get_copied();
			ret.m_constant_att = constant_att_;
			ret.m_linear_att = linear_att_;
			ret.m_quadratic_att = quadratic_att_;
			ret.m_spot_inner_angle = spot_inner_angle_;
			ret.m_spot_outer_angle = spot_outer_angle_;
			ret.m_spot_cutoff = spot_cutoff_;
			return ret;
		}
}