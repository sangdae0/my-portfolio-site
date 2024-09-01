class c_material {
/* private */
/* public */
	m_has_diffuse_tex;
	m_has_specular_tex;
	m_ambient;
	m_diffuse;
	m_specular;
	m_emission;
	m_shininess;

	static gen(has_diffuse_tex_,
				has_specular_tex_,
				ambient_,
				diffuse_,
				specular_,
				emission_,
				shininess_) {
		let ret = new c_material();
		ret.m_has_diffuse_tex = has_diffuse_tex_;
		ret.m_has_specular_tex = has_specular_tex_;
		ret.m_ambient = ambient_;
		ret.m_diffuse = diffuse_;
		ret.m_specular = specular_;
		ret.m_emission = emission_;
		ret.m_shininess = shininess_;
		return ret;
	}
}