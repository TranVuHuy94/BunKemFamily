import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Helper to create emoji textures
function createEmojiTexture(emoji, size = 64) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.font = `${size * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText(emoji, size / 2, size / 2)
    const texture = new THREE.CanvasTexture(canvas)
    return texture
}

const emojis = ['🌸', '🐰', '⭐', '❤️', '☁️', '🎀', '🍬']

export default function FallingIcons({ count = 50 }) {
    const { viewport, camera } = useThree()
    const meshRefs = useRef([])

    // Generate textures for each emoji
    const textures = useMemo(() => emojis.map(e => createEmojiTexture(e)), [])

    // Create random data for each instance group
    const particles = useMemo(() => {
        return new Array(count).fill().map(() => ({
            x: (Math.random() - 0.5) * viewport.width * 2, // Wider spread
            y: viewport.height + Math.random() * 20, // Start above screen
            z: (Math.random() - 0.5) * 10,
            rotationX: Math.random() * Math.PI,
            rotationY: Math.random() * Math.PI,
            rotationZ: Math.random() * Math.PI,
            speed: Math.random() * 0.05 + 0.02,
            spinSpeed: (Math.random() - 0.5) * 0.05,
            iconIndex: Math.floor(Math.random() * emojis.length),
            scale: Math.random() * 0.5 + 0.5
        }))
    }, [count, viewport])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state, delta) => {
        // Reset positions if they fall below screen
        particles.forEach((p, i) => {
            p.y -= p.speed
            p.rotationX += p.spinSpeed
            p.rotationY += p.spinSpeed
            p.rotationZ += p.spinSpeed

            if (p.y < -viewport.height / 2 - 5) {
                p.y = viewport.height / 2 + 5 + Math.random() * 10
                p.x = (Math.random() - 0.5) * viewport.width * 2
            }

            // Update respective mesh instance
            // Since we have multiple textures, we use multiple InstancedMeshes
            // But for simplicity with few distinct textures, we can just group by texture or use sprites.
            // Using Sprites might be easier for 2D icons always facing camera, 
            // but user asked for "falling", likely meaning 3D tumbling.
            // Let's use individual meshes for simplicity as count is low (50).
            // Actually, for performance with 50 items, distinct meshes are fine.
        })
    })

    // Grouping particles by icon type for efficient InstancedMesh rendering
    const particlesByIcon = useMemo(() => {
        const groups = emojis.map(() => [])
        particles.forEach((p, i) => {
            groups[p.iconIndex].push({ ...p, originalIndex: i })
        })
        return groups
    }, [particles])

    return (
        <>
            {emojis.map((emoji, index) => (
                <IconInstanceGroup
                    key={index}
                    texture={textures[index]}
                    particles={particlesByIcon[index]}
                    dummy={dummy}
                />
            ))}
        </>
    )
}

function IconInstanceGroup({ texture, particles, dummy }) {
    const meshRef = useRef()

    useFrame(() => {
        if (!meshRef.current) return
        particles.forEach((p, i) => {
            // Re-calculate position based on shared state (would need shared state management for perfect sync, 
            // but here we can simulate independent motion or just update local copies if they were stateful).
            // WAIT: The particles array in parent is not stateful in a way that propagates down easily without context/props update.
            // Better approach: Let this component manage its own subset of particles.
        })
    })

    // Refactoring: Let's simply make one component that handles all particles but renders multiple InstancedMeshes.
    // We need to update the instance matrices every frame.

    useFrame((state) => {
        if (!meshRef.current) return
        particles.forEach((p, i) => {
            // Logic needs to be centralized or passed down. 
            // To simplify: I'll put the update logic INSIDE this component for its own particles.
            p.y -= p.speed
            p.rotationX += p.spinSpeed
            p.rotationY += p.spinSpeed

            if (p.y < -20) { // arbitrary bound based on standard camera
                p.y = 20
                p.x = (Math.random() - 0.5) * 40
            }

            dummy.position.set(p.x, p.y, p.z)
            dummy.rotation.set(p.rotationX, p.rotationY, p.rotationZ)
            dummy.scale.set(p.scale, p.scale, p.scale)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, particles.length]}>
            <planeGeometry args={[1, 1]} /> {/* Flat icons */}
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthWrite={false} />
        </instancedMesh>
    )
}
