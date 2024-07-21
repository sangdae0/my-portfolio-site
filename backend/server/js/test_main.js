function main() {
	{
		let vec3_a = new c_vec3();
		vec3_a.print();
		vec3_a.set(1, 2, 3);
		vec3_a.print();
		console.log('vec3 set test done');

		let vec3_b = new c_vec3();
		vec3_b.set(-1, -2, -3);
		let added = vec3_a.get_vec3_added(vec3_b);
		added.print();
		console.log('vec3 add test done');
	}
	{
		let mat4_a = c_mat4.identity();
		mat4_a.print();

		let vec3_b = new c_vec3();
		vec3_b.set(1, 2, 3);
		let multiplied = vec3_b.get_mat4_multiplied(mat4_a);
		multiplied.print();
	}

	{
		console.log('mat4 a');
		let mat4_a = c_mat4.identity();

		console.log('mat4 b');
		let mat4_b = c_mat4.identity();
		mat4_b.set(1, 2, 3, 4,
				   5, 6, 7, 8,
				   9, 10, 11, 12,
				   13, 14, 15, 16);
		
		let multiplied = mat4_a.get_mat4_multiplied(mat4_b);
		multiplied.print();
	}	
}
