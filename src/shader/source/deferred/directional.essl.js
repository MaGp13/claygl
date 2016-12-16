define(function () {
return "@export qtek.deferred.directional_light\n\n@import qtek.deferred.chunk.light_head\n\n@import qtek.deferred.chunk.light_equation\n\nuniform vec3 lightDirection;\nuniform vec3 lightColor;\n\nuniform vec3 eyePosition;\n\n#ifdef SHADOWMAP_ENABLED\nuniform sampler2D lightShadowMaps[SHADOW_CASCADE];\nuniform mat4 lightMatrices[SHADOW_CASCADE];\nuniform float lightShadowMapSize;\n#endif\n\n@import qtek.plugin.shadow_map_common\n\nvoid main()\n{\n    @import qtek.deferred.chunk.gbuffer_read\n\n    vec3 L = -normalize(lightDirection);\n    vec3 V = normalize(eyePosition - position);\n\n    vec3 H = normalize(L + V);\n    float ndl = clamp(dot(N, L), 0.0, 1.0);\n    float ndh = clamp(dot(N, H), 0.0, 1.0);\n    float ndv = clamp(dot(N, V), 0.0, 1.0);\n\n    gl_FragColor.rgb = lightEquation(\n        lightColor, diffuseColor, specularColor, ndl, ndh, ndv, glossiness\n    );\n\n#ifdef SHADOWMAP_ENABLED\n    // http://www.opengl.org/wiki/Compute_eye_space_from_window_space\n    float depth = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far)\n                    / (gl_DepthRange.far - gl_DepthRange.near);\n    float shadowContrib = 1.0;\n    for (int i = 0; i < SHADOW_CASCADE; i++) {\n        if (\n            depth >= shadowCascadeClipsNear[i] &&\n            depth <= shadowCascadeClipsFar[i]\n        ) {\n            shadowContrib = computeShadowContrib(lightShadowMaps[i], lightMatrices[i], position, lightShadowMapSize);\n        }\n    }\n\n    gl_FragColor.rgb *= shadowContrib;\n#endif\n\n    gl_FragColor.a = 1.0;\n}\n@end\n";
});