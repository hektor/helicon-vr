import bpy
import sys

name = bpy.path.basename(bpy.context.blend_data.filepath)
bpy.ops.export_scene.gltf(filepath='./' + name.rsplit(".", 1)[0] + '.gltf')
