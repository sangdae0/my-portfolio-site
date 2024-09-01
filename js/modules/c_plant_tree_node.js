class c_plant_tree_node {
	m_pos;

	static gen(pos_) {
		let ret = new c_plant_tree_node();
		ret.m_pos = pos_.get_copied();
		return ret;
	}
}