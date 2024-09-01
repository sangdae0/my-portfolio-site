#version 300 es
precision highp float;

uniform mat4 model_view_mat_;
uniform mat4 normal_model_view_mat_;

in vec3 out_surface_normal_;
in vec2 out_uv_;
in vec3 out_vert_pos_; // in view
out vec4 _color;

void main() {
	vec3 n_dir = normalize(out_surface_normal_);
	vec3 merge = n_dir + vec3(out_uv_.x, out_uv_.y, 0) + out_vert_pos_;
	_color = vec4(merge, 1);
	_color.x = 1.0;
}
