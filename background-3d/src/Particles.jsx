import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Reusable objects to avoid GC
const dummy = new THREE.Object3D()

export default function Particles({ count = 12000 }) {
    const mesh = useRef()
    const { camera } = useThree()

    // Custom mouse tracker to bypass "pointer-events: none"
    const mouseRef = useRef({ x: 9999, y: 9999 })

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Initialize particles
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            // Uniform distribution across a wide area (Box ~ 50x50x30)
            const x = (Math.random() - 0.5) * 50
            const y = (Math.random() - 0.5) * 50
            const z = (Math.random() - 0.5) * 30

            temp.push({
                x, y, z,
                ix: x, iy: y, iz: z,
                factor: Math.random() * 100,
                speed: Math.random() * 0.15 + 0.05, // Slower
                scaleSpeed: Math.random() * 0.1 + 0.05,
                scaleOffset: Math.random() * Math.PI * 2,
                baseScale: Math.random() * 0.03 + 0.01
            })
        }
        return temp
    }, [count])

    // Colors - Darker/Saturated Gradient for visibility on light bg
    const colorArray = useMemo(() => {
        const color1 = new THREE.Color('#FFC125') // GoldenRod 1
        const color2 = new THREE.Color('#FF1493') // DeepPink
        const color3 = new THREE.Color('#00B2EE') // DeepSkyBlue 2

        const colors = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            const r = Math.random()
            let c
            if (r < 0.33) c = color1.clone()
            else if (r < 0.66) c = color2.clone()
            else c = color3.clone()

            c.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1)

            colors[i * 3] = c.r
            colors[i * 3 + 1] = c.g
            colors[i * 3 + 2] = c.b
        }
        return colors
    }, [count])

    // Shockwave logic
    const shockwaveRef = useRef({ x: 9999, y: 9999, z: 9999, time: 0, active: false })

    useEffect(() => {
        const handleClick = (event) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1
            const y = -(event.clientY / window.innerHeight) * 2 + 1

            // Unproject to world position
            const vector = new THREE.Vector3(x, y, 0)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = -camera.position.z / dir.z
            const pos = camera.position.clone().add(dir.multiplyScalar(distance))

            shockwaveRef.current = { x: pos.x, y: pos.y, z: pos.z, time: 1.0, active: true }
        }

        window.addEventListener('mouseup', handleClick)
        return () => window.removeEventListener('mouseup', handleClick)
    }, [camera])

    useFrame((state, delta) => {
        if (!mesh.current) return

        const time = state.clock.getElapsedTime()

        // Decay shockwave
        if (shockwaveRef.current.active) {
            shockwaveRef.current.time -= delta * 3 // Decay speed
            if (shockwaveRef.current.time <= 0) shockwaveRef.current.active = false
        }

        let targetPos = new THREE.Vector3(0, 0, 0)
        const hasMouse = mouseRef.current.x < 2

        if (hasMouse) {
            const mouseVector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0)
            mouseVector.unproject(camera)
            const dir = mouseVector.sub(camera.position).normalize()
            const dist = -camera.position.z / dir.z
            targetPos = camera.position.clone().add(dir.multiplyScalar(dist))
        }

        particles.forEach((particle, i) => {
            let { x, y, z, ix, iy, iz, factor, speed, scaleSpeed, scaleOffset, baseScale } = particle

            // 1. Gentle Drift
            const t = time * speed
            const driftX = ix + Math.sin(t * 0.5 + factor) * 1.5
            const driftY = iy + Math.cos(t * 0.3 + factor) * 1.5
            const driftZ = iz + Math.sin(t * 0.4 + factor) * 1.5

            let tx = driftX
            let ty = driftY
            let tz = driftZ

            // 2. Mouse Repulsion (Blowing)
            if (hasMouse) {
                const dx = tx - targetPos.x
                const dy = ty - targetPos.y
                const dz = tz - targetPos.z
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
                const radius = 5

                if (dist < radius) {
                    const force = (radius - dist) / radius
                    const strength = 4
                    const dirX = dx / dist
                    const dirY = dy / dist
                    const dirZ = dz / dist

                    tx += dirX * force * strength
                    ty += dirY * force * strength
                    tz += dirZ * force * strength
                    baseScale *= 1.2
                }
            }

            // 3. Shockwave Repulsion (Click)
            if (shockwaveRef.current.active) {
                const sw = shockwaveRef.current
                const dx = tx - sw.x
                const dy = ty - sw.y
                const dz = tz - sw.z
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
                const radius = 15 // Big radius for explosion

                if (dist < radius) {
                    const force = (radius - dist) / radius
                    const strength = 20 * sw.time // Strong force decaying with time
                    const dirX = dx / dist
                    const dirY = dy / dist
                    const dirZ = dz / dist

                    tx += dirX * force * strength
                    ty += dirY * force * strength
                    tz += dirZ * force * strength

                    // Particles "break" (scale down or flicker)
                    baseScale *= (1 + sw.time)
                }
            }

            // Damp
            particle.x += (tx - particle.x) * 0.08
            particle.y += (ty - particle.y) * 0.08
            particle.z += (tz - particle.z) * 0.08

            // 4. Sparkle
            const scale = baseScale * (0.8 + 0.5 * Math.sin(time * 3 * scaleSpeed + scaleOffset))

            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.scale.set(scale, scale, scale)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        })

        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
                vertexColors
                toneMapped={false}
                transparent
                opacity={0.8}
            />
            <instancedBufferAttribute attach="geometry-attributes-color" args={[colorArray, 3]} />
        </instancedMesh>
    )
}
