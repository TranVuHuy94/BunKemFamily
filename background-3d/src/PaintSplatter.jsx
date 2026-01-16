import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function PaintSplatter({ onSplatter }) {
    const { camera } = useThree()
    const [splatters, setSplatters] = useState([])

    useEffect(() => {
        const handleClick = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1

            const vector = new THREE.Vector3(x, y, 0)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = -camera.position.z / dir.z
            const pos = camera.position.clone().add(dir.multiplyScalar(distance))

            createSplatter(pos)
            if (onSplatter) onSplatter(pos)
        }
        window.addEventListener('mouseup', handleClick) // mouseup works better for clicks sometimes
        return () => window.removeEventListener('mouseup', handleClick)
    }, [camera, onSplatter])

    const createSplatter = (pos) => {
        const color = new THREE.Color().setHSL(Math.random(), 1, 0.6)
        const count = 12
        const newParticles = []
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 0.2 + 0.1
            newParticles.push({
                x: pos.x, y: pos.y, z: pos.z,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                vz: (Math.random() - 0.5) * speed,
                scale: Math.random() * 0.5 + 0.2,
                color: color,
                life: 1.0
            })
        }

        setSplatters(prev => [...prev, { id: Math.random(), particles: newParticles }])
    }

    useFrame(() => {
        setSplatters(prev => prev.map(s => ({
            ...s,
            particles: s.particles.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                z: p.z + p.vz,
                life: p.life - 0.03,
                scale: p.scale * 0.95
            })).filter(p => p.life > 0)
        })).filter(s => s.particles.length > 0))
    })

    return (
        <>
            {splatters.flatMap(s => s.particles.map((p, i) => (
                <mesh key={s.id + i} position={[p.x, p.y, p.z]} scale={[p.scale, p.scale, p.scale]}>
                    <sphereGeometry args={[0.5, 8, 8]} />
                    <meshBasicMaterial color={p.color} transparent opacity={p.life} />
                </mesh>
            )))}
        </>
    )
}
