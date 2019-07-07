#version 330

layout (location = 0) out vec3 g_position;
layout (location = 1) out vec3 g_normal;
layout (location = 2) out vec4 g_albedo;
layout (location = 3) out vec3 g_bloom;
layout (location = 4) out vec3 g_depth;
layout (location = 5) out vec3 g_ambient;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;

uniform float u_normal_factor;

uniform int u_use_diffuse_map;
uniform sampler2D u_diffuse_map;
uniform vec3 u_diffuse;
uniform vec3 u_specular;
uniform vec3 u_ambient;
uniform int u_bloom;

mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)
{
    // get edge vectors of the pixel triangle
    vec3 dp1 = dFdx( p );
    vec3 dp2 = dFdy( p );
    vec2 duv1 = dFdx( uv );
    vec2 duv2 = dFdy( uv );
    
    // solve the linear system
    vec3 dp2perp = cross( dp2, N );
    vec3 dp1perp = cross( N, dp1 );
    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
    
    // construct a scale-invariant frame
    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
    return mat3( T * invmax, B * invmax, N );
}

// perturbs the normal using a tangent space normal map
// N - normal vector from geometry
// P - vertex position
// texcoord - the current texture coordinates
// normal_sample - the sample from the normal map
vec3 perturbNormal( vec3 N, vec3 P, vec2 texcoord, vec3 normal_sample )
{
    
    normal_sample = normal_sample * 2.0 - 1.0;
    mat3 TBN = cotangent_frame(N, -P, texcoord);
    return normalize(TBN * normal_sample);
}

void main() {

    g_position = v_vertex_world_pos;

    g_normal = normalize(v_normal);

    vec3 diffuse_color = u_diffuse;
    if (u_use_diffuse_map == 1)
        diffuse_color *= texture(u_diffuse_map, v_uv).xyz;

    float specular = (u_specular.x + u_specular.y + u_specular.z) / 3.0;

    g_albedo = vec4(diffuse_color, specular); 

    if (u_bloom == 1){
        g_bloom = diffuse_color.xyz;
    } else {
        g_bloom = vec3(0.0,0.0,0.0);
    }

    g_depth = vec3(gl_FragCoord.z / gl_FragCoord.w, 1.0, 0.0);
    
    g_ambient = u_ambient;
}

