#version 330

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_tex_phong;
uniform sampler2D u_tex_bloom;
uniform sampler2D u_tex_background;

void main(){

    vec3 col = texture(u_tex_phong, v_uv).xyz + texture(u_tex_background, v_uv).xyz;
    vec3 col_bloom = texture(u_tex_bloom, v_uv).xyz;
    col = col * 0.9 + col_bloom;

    fragColor = vec4(col, 1.0);
}