#version 330

layout(location = 0) in vec3 a_vertex;
layout(location = 1) in vec2 a_uv;
layout(location = 2) in vec3 a_normal;


out vec2 v_uv;
out vec3 v_normal;

void main(){

	v_uv = a_uv;
	//v_normal = a_normal;

	gl_Position = vec4(a_vertex, 1.0);
}