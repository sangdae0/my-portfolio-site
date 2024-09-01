#version 300 es
layout (location=0) in vec3 vert_pos_;

uniform mat4 model_view_mat_;
uniform mat4 proj_mat_;

void main() {
	gl_Position = (proj_mat_ * model_view_mat_ * vec4(vert_pos_, 1.0));
}
