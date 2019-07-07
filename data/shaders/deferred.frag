#version 330

const int MAX_LIGHTS = 8;

in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D u_tex_position;
uniform sampler2D u_tex_normal;
uniform sampler2D u_tex_albedo;

//light structs and uniforms
struct Light {
    vec4 position;
    vec4 direction;
    vec4 color;
    float linear_att;
    float quadratic_att;
    float spot_inner_cosine;
    float spot_outer_cosine;
    mat4 view_projection;
    int type; // 0 - directional; 1 - point; 2 - spot
    int cast_shadow;
};

uniform int u_num_lights;

layout (std140) uniform u_lights_ubo
{
    Light lights[MAX_LIGHTS]; 
};

void main(){

	vec3 position = texture(u_tex_position, v_uv).xyz;
	vec3 N = normalize(texture(u_tex_normal, v_uv).xyz);
	vec3 diffuse_texture = texture(u_tex_albedo, v_uv).xyz;

	vec3 final_color = vec3(0);

	for (int i = 0; i < u_num_lights; i++) {
		vec3 L = -normalize(lights[i].direction.xyz);
		float NdotL = dot(N, L);

		vec3 diffuse_color = NdotL * diffuse_texture;
		final_color += diffuse_color;
	}

	fragColor = vec4(final_color, 1.0);
    
}
