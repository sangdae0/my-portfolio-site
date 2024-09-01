function main() {
}

function btn_gen_from_l_system() {
	let l_str = document.getElementById("text_area_l_system_input").value;
	//console.log(l_str);
	if (l_str.length > 0) {
		c_mesh_builder.gen_from_l_system(l_str);
	}
}
