#version 300 es
precision highp float;

layout (std140) uniform phong_prop {
	vec3 global_ambient_intensity;
	vec3 fog_intensity;
	int current_lt_count;
	float z_near;
	float z_far;
} phong_prop_;

layout (std140) uniform lights { // for OpenGL(WebGL only uses std140)
	int lt_type_arr[16];

	vec3 pos_arr[16];
	vec3 dir_arr[16]; // should be normalized
	float spot_cos_inner_angle_arr[16]; // theta
	float spot_cos_outer_angle_arr[16]; // phi, outer angle shoulde be bigger than inner angle
	float spot_cutoff_arr[16];

	vec3 ambient_arr[16];
	vec3 diffuse_arr[16];
	vec3 specular_arr[16];

	float constant_att_arr[16];
	float linear_att_arr[16];
	float quadratic_att_arr[16];
} lights_;

uniform int material_has_diffuse_tex_;
uniform sampler2D material_diffuse_tex_;
uniform int material_has_specular_tex_;
uniform sampler2D material_specular_tex_;
uniform vec3 material_ambient_; // k_a
uniform vec3 material_diffuse_; // k_d
uniform vec3 material_specular_; // k_s
uniform vec3 material_emission_; // emissive intensity
uniform float material_shininess_;

uniform mat4 model_view_mat_;
uniform mat4 normal_model_view_mat_;

in vec3 out_surface_normal_;
in vec2 out_uv_;
in vec3 out_vert_pos_; // in view
out vec4 _color;

void main() {
	vec3 n_dir = normalize(out_surface_normal_);
	vec3 to_eye = -out_vert_pos_; // v
	vec3 to_eye_dir = normalize(to_eye);

	// https://www.glprogramming.com/red/chapter05.html
	vec3 total_local_intensity = material_emission_
									+ phong_prop_.global_ambient_intensity * material_ambient_;

	for (int i = 0; i < 16; ++ i) {
		if (i < phong_prop_.current_lt_count) {
			int lt_type = lights_.lt_type_arr[i];
			if (lt_type == 0) { // directional light
				vec3 ambient_intensity = lights_.ambient_arr[i] * material_ambient_;
				vec3 l_dir = vec3(normal_model_view_mat_ * vec4(-lights_.dir_arr[i], 0.0)); // dir to light
				float dot_nl = dot(l_dir, n_dir);
				vec3 diffuse_intensity = vec3(0.0);
				vec3 specular_intensity = vec3(0.0);
				if (dot_nl > 0.0) { // optimize
					if (material_has_diffuse_tex_ > 0)
						diffuse_intensity = lights_.diffuse_arr[i] * texture(material_diffuse_tex_, out_uv_).rgb * dot_nl;
					else
						diffuse_intensity = lights_.diffuse_arr[i] * material_diffuse_ * dot_nl;
						
					vec3 r_dir = normalize(((2.0 * dot_nl) * n_dir) - l_dir); // light reflection dir
					float dot_rv = dot(r_dir, to_eye_dir);
					if (dot_rv > 0.0) { // optimize
						if (material_has_specular_tex_ > 0)
							specular_intensity = lights_.specular_arr[i] * texture(material_specular_tex_, out_uv_).rgb * pow(dot_rv, material_specular_.r * material_specular_.r);
						else
							specular_intensity = lights_.specular_arr[i] * material_specular_ * pow(dot_rv, material_shininess_);
					}
				}
				total_local_intensity += ambient_intensity + diffuse_intensity + specular_intensity;
			} else if (lt_type == 1) { // point light
				vec3 ambient_intensity = lights_.ambient_arr[i] * material_ambient_;
				vec3 lt_pos = vec3(model_view_mat_ * vec4(lights_.pos_arr[i], 1.0));
				vec3 to_lt = lt_pos - out_vert_pos_;
				vec3 l_dir = normalize(to_lt);
				float dot_nl = dot(l_dir, n_dir);
				vec3 diffuse_intensity = vec3(0.0);
				vec3 specular_intensity = vec3(0.0);
				if (dot_nl > 0.0) { // optimize
					if (material_has_diffuse_tex_ > 0)
						diffuse_intensity = lights_.diffuse_arr[i] * texture(material_diffuse_tex_, out_uv_).rgb * dot_nl;
					else
						diffuse_intensity = lights_.diffuse_arr[i] * material_diffuse_ * dot_nl;
					vec3 r_dir = normalize(((2.0 * dot_nl) * n_dir) - l_dir);
					float dot_rv = dot(r_dir, to_eye_dir);
					if (dot_rv > 0.0) { // optimize
						if (material_has_specular_tex_ > 0)
							specular_intensity = lights_.specular_arr[i] * texture(material_specular_tex_, out_uv_).rgb * pow(dot_rv, material_specular_.r * material_specular_.r);
						else
							specular_intensity = lights_.specular_arr[i] * material_specular_ * pow(dot_rv, material_shininess_);
					}
				}

				float dist_to_lt = length(to_lt);
				float att = min(1.0 / (lights_.constant_att_arr[i]
									+ (lights_.linear_att_arr[i] * dist_to_lt)
									+ (lights_.quadratic_att_arr[i] * dist_to_lt * dist_to_lt)), 1.0);
				total_local_intensity += att * (ambient_intensity + diffuse_intensity + specular_intensity);
			} else if (lt_type == 2) { // spot light
				vec3 ambient_intensity = lights_.ambient_arr[i] * material_ambient_;
				vec3 lt_pos = vec3(model_view_mat_ * vec4(lights_.pos_arr[i], 1.0));
				vec3 l_dir = vec3(normal_model_view_mat_ * vec4(-lights_.dir_arr[i], 0.0)); // dir to light
				vec3 d_dir = normalize(out_vert_pos_ - lt_pos);
				float dot_ld = dot(l_dir, d_dir);

				float spotlight_effect = 0.0;
				float cos_cone_inn = lights_.spot_cos_inner_angle_arr[i];
				float cos_cone_out = lights_.spot_cos_outer_angle_arr[i];
				if (dot_ld < cos_cone_out) // when the vertex is out of outer cone
					continue; // optimize
				else if (dot_ld > cos_cone_inn) // when the vertex is in inner
					spotlight_effect = 1.0;
				else // when the vertex is between inner and outer
					spotlight_effect = pow((dot_ld - cos_cone_out) / (cos_cone_inn - cos_cone_out), lights_.spot_cutoff_arr[i]); // outer angle shoulde be bigger than inner angle

				float dot_nl = dot(l_dir, n_dir);
				vec3 diffuse_intensity = vec3(0.0);
				vec3 specular_intensity = vec3(0.0);
				if (dot_nl > 0.0) { // optimize
					if (material_has_diffuse_tex_ > 0)
						diffuse_intensity = lights_.diffuse_arr[i] * texture(material_diffuse_tex_, out_uv_).rgb * dot_nl;
					else
						diffuse_intensity = lights_.diffuse_arr[i] * material_diffuse_ * dot_nl;

					vec3 r_dir = normalize(((2.0 * dot_nl) * n_dir) - l_dir); // light reflection dir
					float dot_rv = dot(r_dir, to_eye_dir);
					if (dot_rv > 0.0) { // optimize
						if (material_has_specular_tex_ > 0)
							specular_intensity = lights_.specular_arr[i] * texture(material_specular_tex_, out_uv_).rgb * pow(dot_rv, material_specular_.r * material_specular_.r);
						else
							specular_intensity = lights_.specular_arr[i] * material_specular_ * pow(dot_rv, material_shininess_);
					}
				}
				
				float dist_to_lt = length(lt_pos - out_vert_pos_);
				float att = min(1.0 / (lights_.constant_att_arr[i]
									+ (lights_.linear_att_arr[i] * dist_to_lt)
									+ (lights_.quadratic_att_arr[i] * dist_to_lt * dist_to_lt)), 1.0);
				total_local_intensity += (att * ambient_intensity) 
											+ (att * spotlight_effect * (diffuse_intensity + specular_intensity));
			} else {
				continue;
			}
		}
	}

	float dist_to_eye = length(to_eye);
	float s = (phong_prop_.z_far - dist_to_eye) / (phong_prop_.z_far - phong_prop_.z_near);
	vec3 final_intensity = s * total_local_intensity + (1.0 - s) * phong_prop_.fog_intensity;
	_color = vec4(final_intensity, 1);
}
