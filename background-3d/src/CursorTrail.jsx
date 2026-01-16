import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

function createEmojiTexture(emoji, size = 32) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.font = `${size * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText(emoji, size / 2, size / 2)
    return new THREE.CanvasTexture(canvas)
}

const trailEmojis = ['✨', '⭐', '🌸', '💫']

export default function CursorTrail() {
    const { camera, viewport } = useThree()
    const [trail, setTrail] = useState([])
    const lastMousePos = useRef(new THREE.Vector3(0, 0, 0))
    const mouseRef = useRef({ x: 0, y: 0 })

    const textures = useRef(trailEmojis.map(e => createEmojiTexture(e)))

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse to -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1
            mouseRef.current = { x, y }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state) => {
        // Convert mouse screen pos to world pos at z=0 plane
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))

        // Spawn new particle if moved enough
        if (pos.distanceTo(lastMousePos.current) > 0.5) {
            setTrail(prev => [
                ...prev,
                {
                    pos: pos.clone(),
                    id: Math.random(),
                    scale: 1,
                    opacity: 1,
                    texture: textures.current[Math.floor(Math.random() * textures.current.length)]
                }
            ].slice(-20)) // Keep last 20
            lastMousePos.current.copy(pos)
        }

        // Update trail
        setTrail(prev => prev.map(p => ({
            ...p,
            scale: p.scale * 0.967, // Shrink (Slower: 0.95 -> 0.967)
            opacity: p.opacity * 0.967 // Fade (Slower: 0.95 -> 0.967)
        })).filter(p => p.opacity > 0.1))
    })

    return (
        <>
            {trail.map(p => (
                <mesh key={p.id} position={p.pos} scale={[p.scale, p.scale, p.scale]}>
                    <planeGeometry args={[0.5, 0.5]} />
                    <meshBasicMaterial map={p.texture} transparent opacity={p.opacity} depthWrite={false} />
                </mesh>
            ))}
        </>
    )
}
