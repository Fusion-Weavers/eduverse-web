# WebXR 3D Model Viewer Implementation

## Overview
The Eduverse web application now supports displaying 3D models using WebXR technology. This feature allows users to view interactive 3D models directly in the browser and, on supported devices, experience them in augmented reality (AR).

## Implementation Details

### Libraries Used
- **Three.js** - JavaScript 3D library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### Component Structure

#### WebXRViewer Component
Location: `src/components/WebXRViewer.jsx`

The WebXRViewer component provides:
- 3D model loading and rendering (GLB/GLTF formats)
- Interactive controls (rotate, zoom, pan)
- Fullscreen mode
- WebXR AR support (on compatible devices)
- Error handling and loading states

**Props:**
- `modelUrl` (string, required): URL to the GLB/GLTF model file
- `title` (string, optional): Title displayed in the viewer header

### Integration

The WebXRViewer is integrated into the ConceptView component and automatically displays when:
1. A concept has `arEnabled: true`
2. The concept has a `modelUrl` field in Firestore

### Firestore Data Structure

For concepts with 3D models, add the following field:
```javascript
{
  // ... other concept fields
  arEnabled: true,
  visualizationType: "3d-model",
  modelUrl: "https://raw.githubusercontent.com/your-org/your-repo/main/public/models/category/model-name.glb"
}
```

## Features

### 1. Interactive 3D Viewing
- **Rotate**: Click and drag to rotate the model
- **Zoom**: Scroll to zoom in/out
- **Pan**: Right-click and drag to pan

### 2. Fullscreen Mode
- Click the fullscreen button to view the model in fullscreen
- Press ESC or click the button again to exit

### 3. WebXR AR Support (Device-Dependent)
- On supported devices (Chrome on Android, Safari on iOS), users can view models in AR
- The AR Mode button appears only when WebXR is supported
- Requires HTTPS in production

### 4. Model Auto-Centering and Scaling
- Models are automatically centered and scaled to fit the viewport
- Works with models of any size

### 5. Error Handling
- Displays user-friendly error messages if model fails to load
- Provides retry functionality
- Shows loading state while model is loading

## Browser Compatibility

### 3D Viewing (Standard Mode)
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge

### WebXR AR Mode
- ✅ Chrome on Android (ARCore supported devices)
- ✅ Safari on iOS 12+ (ARKit supported devices)
- ❌ Desktop browsers (AR mode not available)

## Model File Requirements

### Supported Formats
- GLB (Binary GLTF) - Recommended
- GLTF (JSON + separate files)

### Best Practices
1. **File Size**: Keep models under 10MB for optimal loading
2. **Optimization**: Use tools like glTF-Pipeline to compress models
3. **Textures**: Embed textures in GLB files or ensure texture paths are correct
4. **Complexity**: Aim for models with <100k polygons for mobile compatibility
5. **Testing**: Test models in the viewer before deploying

### Model Optimization Tools
- [glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline) - Command-line tool
- [Blender](https://www.blender.org/) - 3D modeling software with glTF export
- [gltf.report](https://gltf.report/) - Online glTF validator

## Storing Models

### Current Approach: GitHub Raw URLs
Models are stored in the GitHub repository at:
```
public/models/
  ├── biology/
  │   └── respiratory-systems.glb
  ├── chemistry/
  ├── engineering/
  └── physics/
```

URL format in Firestore:
```
https://raw.githubusercontent.com/Fusion-Weavers/eduverse-web/main/public/models/biology/respiratory-systems.glb
```

### Alternative Storage Options (Future)
1. **Firebase Storage**: Better for large files, provides CDN
2. **AWS S3 / Azure Blob**: Enterprise-grade storage with global CDN
3. **Dedicated 3D Asset CDN**: Services like Sketchfab API

## Development

### Adding New 3D Models

1. **Prepare the Model**
   - Export as GLB format
   - Optimize file size
   - Test locally

2. **Add to Repository**
   ```bash
   # Add model file to appropriate category
   cp your-model.glb public/models/[category]/
   git add public/models/[category]/your-model.glb
   git commit -m "Add 3D model for [concept name]"
   git push
   ```

3. **Update Firestore**
   - Go to Firebase Console → Firestore
   - Find the concept document
   - Add/update fields:
     ```javascript
     {
       arEnabled: true,
       visualizationType: "3d-model",
       modelUrl: "https://raw.githubusercontent.com/Fusion-Weavers/eduverse-web/main/public/models/[category]/your-model.glb"
     }
     ```

### Testing Locally

1. Place model in `public/models/` directory
2. Use relative URL: `/models/[category]/your-model.glb`
3. Test in browser at `http://localhost:5173`

## Troubleshooting

### Model Not Loading - "The operation was aborted" Error

This error occurs when the model file cannot be loaded. Common causes:

1. **File doesn't exist**: Verify the model file exists at the specified GitHub path
   - Check the repository: `https://github.com/Fusion-Weavers/eduverse-web/tree/main/public/models/`
   - Ensure the file path matches exactly (case-sensitive)
   - Confirm the branch name is correct (`main` vs `master`)

2. **Check the exact URL**: Open the model URL in a new browser tab
   - If you get a 404 error, the file doesn't exist
   - If the file downloads, the URL is correct but there may be a loading issue

3. **Verify the file format**: Ensure the file is a valid GLB or GLTF file
   - Test the model in online viewers like [gltf.report](https://gltf.report/)
   - Re-export from Blender or your 3D software if corrupted

4. **CORS issues**: GitHub raw URLs should work, but check browser console
   - GitHub raw content is served with proper CORS headers
   - If using a different CDN, ensure CORS is enabled

### Model Not Loading
1. Check browser console for errors
2. Verify model URL is accessible (open in new tab)
3. Ensure model is valid GLB/GLTF format
4. Check CORS headers (GitHub raw URLs work, but custom servers need CORS)

### Model Appears Broken or Black
1. Check if model has textures
2. Verify lighting in the scene
3. Test with a known-good model

### AR Mode Not Working
1. Verify device supports WebXR (Chrome Android / Safari iOS)
2. Ensure site is served over HTTPS (required for WebXR)
3. Check browser permissions for AR

### Performance Issues
1. Reduce model complexity (polygon count)
2. Compress textures
3. Optimize model using glTF tools

## Security Considerations

1. **CORS**: Models must be served with proper CORS headers
2. **HTTPS**: Required for WebXR features in production
3. **File Size**: Implement upload limits to prevent abuse
4. **Validation**: Validate model files server-side before storing

## Future Enhancements

### Planned Features
- [ ] Model annotations and hotspots
- [ ] Multiple model variants (LOD - Level of Detail)
- [ ] Model animations support
- [ ] Screenshot/snapshot functionality
- [ ] Social sharing of 3D views
- [ ] Model comparison (side-by-side view)
- [ ] Custom lighting controls
- [ ] Model measurement tools

### Advanced AR Features
- [ ] Surface detection and placement
- [ ] Multi-model AR scenes
- [ ] AR annotations and labels
- [ ] Collaborative AR viewing

## Resources

### Learning Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [glTF 2.0 Specification](https://www.khronos.org/gltf/)

### Model Resources
- [Sketchfab](https://sketchfab.com/) - 3D model marketplace
- [Poly Pizza](https://poly.pizza/) - Free 3D models
- [NASA 3D Resources](https://nasa3d.arc.nasa.gov/) - Scientific models
- [NIH 3D Print Exchange](https://3dprint.nih.gov/) - Biomedical models

## Support

For issues or questions:
1. Check browser console for errors
2. Verify model URL and format
3. Test on different devices/browsers
4. Contact development team with error details

---

**Last Updated**: January 2026
**Version**: 1.0.0
