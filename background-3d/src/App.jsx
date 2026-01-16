import { Canvas } from '@react-three/fiber'
import Particles from './Particles'
import FallingIcons from './FallingIcons'
import CursorTrail from './CursorTrail'
import PaintSplatter from './PaintSplatter'

export default function App() {
    return (
        <Canvas
            camera={{ position: [0, 0, 20], fov: 75 }}
            dpr={[1, 2]} // Handle high-DPI screens
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            style={{ background: 'transparent' }} // Transparent to show website bg color if needed
        >
            <Particles count={12000} />
            <FallingIcons count={40} />
            <CursorTrail />
            <PaintSplatter />
        </Canvas>
    )
}
