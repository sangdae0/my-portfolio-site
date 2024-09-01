#version 300 es
layout (location=0) in vec3 vert_pos_;
layout (location=1) in vec3 vert_normal_;
layout (location=2) in vec2 vert_uv_;

uniform mat4 model_view_mat_;
uniform mat4 normal_model_view_mat_;
uniform mat4 proj_mat_;

out vec3 out_surface_normal_;
out vec2 out_uv_;
out vec3 out_vert_pos_;

void main() {
	out_surface_normal_ = vec3(normal_model_view_mat_ * vec4(vert_normal_, 0.0));
	out_uv_ = vert_uv_;

	vec4 vert_pos_in_view = model_view_mat_ * vec4(vert_pos_, 1.0);
	out_vert_pos_ = vec3(vert_pos_in_view);
	gl_Position = proj_mat_ * vert_pos_in_view;
}