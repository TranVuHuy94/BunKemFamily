import { Canvas } from '@react-three/fiber'
import Particles from './Particles'

export default function App() {
    return (
        <Canvas
            camera={{ position: [0, 0, 20], fov: 75 }}
            dpr={[1, 2]} // Handle high-DPI screens
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            style={{ background: 'transparent' }} // Transparent to show website bg color if needed
        >
            <Particles count={12000} />
        </Canvas>
    )
}
